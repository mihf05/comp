"use server";

import { performance } from "node:perf_hooks";
import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { Resend } from "resend";
import { authActionClient } from "../safe-action";
import { organizationSchema } from "../schema";
import { createStripeCustomer } from "./lib/create-stripe-customer";
import {
	createControlArtifacts,
	createFrameworkInstance,
	createOrganizationPolicies,
	createOrganizationTasks,
	getRelevantControls,
} from "./lib/utils";
import { env } from "@/env.mjs";
import ky from "ky";
import { tasks } from "@trigger.dev/sdk/v3";
import type { newOrgSequence } from "@/jobs/tasks/marketing/new-org-sequence";

export const createOrganizationAction = authActionClient
	.schema(organizationSchema)
	.metadata({
		name: "create-organization",
		track: {
			event: "create-organization",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }) => {
		const { name, frameworks, website } = parsedInput;
		const { id: userId } = ctx.user;

		if (!name) {
			console.log("Invalid input detected:", { name });
			throw new Error("Invalid user input");
		}

		const timings = {
			getAuthSession: 0,
			createStripeCustomer: 0,
			updateOrganizationWithStripeId: 0,
			transaction: 0, // Timing for the whole transaction
			getRelevantControls: 0,
			createFrameworkInstances: 0,
			createPoliciesAndTasksParallel: 0,
			createControlArtifacts: 0,
			total: 0,
		};

		const totalStart = performance.now();
		let start = performance.now();

		try {
			const session = await auth.api.getSession({
				headers: await headers(),
			});

			timings.getAuthSession = (performance.now() - start) / 1000;

			if (!session?.session.activeOrganizationId) {
				throw new Error("User is not part of an organization");
			}

			if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
				const resend = new Resend(process.env.RESEND_API_KEY);

				await resend.contacts.create({
					firstName:
						session.user.name?.split(" ")[0] ||
						session.user.email.split("@")[0] ||
						"",
					lastName:
						session.user.name?.split(" ")[1] ||
						session.user.email.split("@")[1] ||
						"",
					email: session.user.email,
					unsubscribed: false,
					audienceId: process.env.RESEND_AUDIENCE_ID,
				});

				await tasks.trigger<typeof newOrgSequence>("new-org-sequence", {
					email: session.user.email,
				});
			}

			await db.onboarding.create({
				data: {
					organizationId: session.session.activeOrganizationId,
				},
			});

			const organizationId = session.session.activeOrganizationId;

			// --- External API Call + Initial Org Update (Outside Transaction) ---
			start = performance.now();
			const stripeCustomerId = await createStripeCustomer({
				name,
				email: session.user.email,
				organizationId,
			});
			timings.createStripeCustomer = (performance.now() - start) / 1000;

			if (!stripeCustomerId) {
				throw new Error("Failed to create Stripe customer");
			}

			start = performance.now();
			await db.organization.update({
				where: { id: organizationId },
				data: { stripeCustomerId, website },
			});
			timings.updateOrganizationWithStripeId =
				(performance.now() - start) / 1000;

			// --- Main Creation Logic (Inside Transaction) ---
			const transactionStart = performance.now();
			const result = await db.$transaction(
				async (tx) => {
					// REVISIT: Consider if more granular error handling/logging is needed within the transaction

					start = performance.now();
					const relevantControls = getRelevantControls(frameworks);
					const getRelevantControlsTime =
						(performance.now() - start) / 1000;

					start = performance.now();
					// Pass the transaction client `tx` to the helper
					const organizationFrameworks = await Promise.all(
						frameworks.map(
							(frameworkId) =>
								createFrameworkInstance(
									organizationId,
									frameworkId,
									tx,
								), // Pass tx
						),
					);
					const createFrameworkInstancesTime =
						(performance.now() - start) / 1000;

					// Fetch DB controls needed for Task creation
					const dbControlsList = await tx.control.findMany({
						where: {
							organizationId,
							name: { in: relevantControls.map((c) => c.name) },
						},
						select: { id: true, name: true },
					});
					const dbControlsMap = new Map<string, { id: string }>();
					for (const control of dbControlsList) {
						dbControlsMap.set(control.name, control);
					}

					// Run policy and task creation in parallel
					start = performance.now();
					const [policiesForFrameworks, tasksCreationResult] =
						await Promise.all([
							createOrganizationPolicies(
								organizationId,
								relevantControls,
								userId,
								tx,
							), // Pass tx
							createOrganizationTasks(
								organizationId,
								relevantControls,
								dbControlsMap, // Pass the map
								userId,
								tx,
							),
						]);
					const createPoliciesAndTasksParallelTime =
						(performance.now() - start) / 1000;

					start = performance.now();
					// Pass the transaction client `tx` to the helper
					await createControlArtifacts(
						organizationId,
						organizationFrameworks.map((framework) => framework.id),
						relevantControls,
						policiesForFrameworks,
						tx, // Pass tx
					);
					const createControlArtifactsTime =
						(performance.now() - start) / 1000;

					// Return timings calculated inside the transaction scope
					return {
						getRelevantControlsTime,
						createFrameworkInstancesTime,
						createPoliciesAndTasksParallelTime,
						createControlArtifactsTime,
						organizationFrameworks, // Need this for the final return value potentially
					};
				},
				{
					maxWait: 15000,
					timeout: 40000,
				},
			);
			timings.transaction = (performance.now() - transactionStart) / 1000;

			// Assign timings from the transaction result
			timings.getRelevantControls = result.getRelevantControlsTime;
			timings.createFrameworkInstances =
				result.createFrameworkInstancesTime;
			timings.createPoliciesAndTasksParallel =
				result.createPoliciesAndTasksParallelTime;
			timings.createControlArtifacts = result.createControlArtifactsTime;

			timings.total = (performance.now() - totalStart) / 1000;
			console.log("createOrganizationAction timings (s):", timings);
			console.warn(
				"NOTE: Transactionality currently relies on global 'db' client within helpers. Refactor helpers to accept 'tx' for true atomicity.",
			);

			const userOrgs = await db.member.findMany({
				where: {
					userId: userId,
				},
				select: {
					organizationId: true,
				},
			});

			for (const org of userOrgs) {
				revalidatePath(`/${org.organizationId}`);
			}

			await auth.api.setActiveOrganization({
				headers: await headers(),
				body: {
					organizationId,
				},
			});

			return {
				success: true,
				organizationId,
			};
		} catch (error) {
			console.error("Error during organization creation/update:", error);
			timings.total = (performance.now() - totalStart) / 1000;
			console.log(
				"createOrganizationAction timings on error (s):",
				timings,
			);

			// More specific error handling could be added here
			throw new Error(
				"Failed to create or update organization structure",
			);
		}
	});
