import type { TemplatePolicy } from "../types";

export const codeOfConductPolicy: TemplatePolicy = {
	type: "doc",
	metadata: {
		id: "code_of_conduct",
		name: "Code of Conduct Policy",
		description:
			"This policy outlines the expected standards of behavior and ethical conduct for all employees and representatives of the organization.",
		frequency: "yearly",
		department: "hr",
	},
	content: [
		{
			type: "heading",
			attrs: { level: 1 },
			content: [{ type: "text", text: "Code of Conduct Policy" }],
		},
		{
			type: "heading",
			attrs: { level: 2 },
			content: [{ type: "text", text: "Policy Information" }],
		},
		{
			type: "table",
			content: [
				{
					type: "tableRow",
					content: [
						{
							type: "tableCell",
							content: [{ type: "text", text: "Organization" }],
						},
						{
							type: "tableCell",
							content: [{ type: "text", text: "Last Review" }],
						},
						{
							type: "tableCell",
							content: [{ type: "text", text: "Review Frequency" }],
						},
						{
							type: "tableCell",
							content: [{ type: "text", text: "Approved By" }],
						},
						{
							type: "tableCell",
							content: [{ type: "text", text: "Classification" }],
						},
					],
				},
				{
					type: "tableRow",
					content: [
						{
							type: "tableCell",
							content: [{ type: "text", text: "{{organization}}" }],
						},
						{
							type: "tableCell",
							content: [{ type: "text", text: "{{date}}" }],
						},
						{
							type: "tableCell",
							content: [{ type: "text", text: "Annual" }],
						},
						{
							type: "tableCell",
							content: [{ type: "text", text: "Human Resources" }],
						},
						{
							type: "tableCell",
							content: [{ type: "text", text: "Confidential" }],
						},
					],
				},
			],
		},
		{
			type: "heading",
			attrs: { level: 2 },
			content: [{ type: "text", text: "Purpose and Scope" }],
		},
		{
			type: "orderedList",
			attrs: { tight: true, start: 1 },
			content: [
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									text: "The purpose of this policy is to define expected behavior from employees towards their colleagues, supervisors, and the organization as a whole.",
								},
							],
						},
					],
				},
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									text: "All employees and contractors must follow this policy as outlined in their Employment Offer Letter or Independent Contractor Agreement while performing their duties.",
								},
							],
						},
					],
				},
			],
		},
		{
			type: "heading",
			attrs: { level: 2 },
			content: [{ type: "text", text: "Policy" }],
		},
		{
			type: "orderedList",
			attrs: { tight: true, start: 1 },
			content: [
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									text: "Compliance with Law: Employees must understand and comply with environmental, safety, and fair dealing laws while ensuring ethical and responsible conduct in their job duties.",
								},
							],
						},
					],
				},
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									text: "Respect in the Workplace: Discriminatory behavior, harassment, or victimization is strictly prohibited.",
								},
							],
						},
					],
				},
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									text: "Protection of Company Property: Employees must not misuse company equipment, respect intellectual property, and protect material property from damage.",
								},
							],
						},
					],
				},
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									text: "Personal Appearance: Employees must present themselves in a professional manner and adhere to the company dress code.",
								},
							],
						},
					],
				},
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									text: "Corruption: Employees must not accept bribes or inappropriate gifts from clients or partners.",
								},
							],
						},
					],
				},
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									text: "Job Duties and Authority: Employees must act with integrity, respect team members, and avoid abuse of authority when delegating responsibilities.",
								},
							],
						},
					],
				},
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									text: "Absenteeism and Tardiness: Employees must adhere to their designated work schedules unless exceptions are approved by their hiring manager.",
								},
							],
						},
					],
				},
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									text: "Conflict of Interest: Employees must avoid personal or financial interests that interfere with their job duties.",
								},
							],
						},
					],
				},
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									text: "Collaboration: Employees must promote a positive and cooperative work environment.",
								},
							],
						},
					],
				},
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									text: "Communication: Employees must maintain open and professional communication with colleagues and supervisors.",
								},
							],
						},
					],
				},
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									text: "Benefits: Employees must not abuse employment benefits, such as time off, insurance, or company resources.",
								},
							],
						},
					],
				},
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									text: "Policy Adherence: Employees must comply with all company policies. Questions should be directed to HR or their hiring manager.",
								},
							],
						},
					],
				},
			],
		},
		{
			type: "heading",
			attrs: { level: 2 },
			content: [{ type: "text", text: "Disciplinary Actions" }],
		},
		{
			type: "orderedList",
			attrs: { tight: true, start: 1 },
			content: [
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									text: "Violations of this policy may result in disciplinary actions, including but not limited to:",
								},
							],
						},
						{
							type: "bulletList",
							content: [
								{
									type: "listItem",
									content: [{ type: "text", text: "Demotion" }],
								},
								{
									type: "listItem",
									content: [{ type: "text", text: "Reprimand" }],
								},
								{
									type: "listItem",
									content: [
										{ type: "text", text: "Suspension or termination" },
									],
								},
								{
									type: "listItem",
									content: [{ type: "text", text: "Reduction of benefits" }],
								},
							],
						},
					],
				},
				{
					type: "listItem",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									text: "Serious violations such as corruption, theft, or embezzlement may result in legal action.",
								},
							],
						},
					],
				},
			],
		},
	],
};
