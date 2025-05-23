"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { StatusIndicator } from "@/components/status-indicator";
import { useDataTable } from "@/hooks/use-data-table";
import { useI18n } from "@/locales/client";
import { Artifact, Policy } from "@comp/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { Input } from "@comp/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

interface ArtifactsTableProps {
	artifacts: (Artifact & {
		policy: Policy | null;
	})[];
	orgId: string;
	controlId: string;
}

export function ArtifactsTable({
	artifacts,
	orgId,
	controlId,
}: ArtifactsTableProps) {
	const t = useI18n();
	const [searchTerm, setSearchTerm] = useState("");

	// Define columns for artifacts table
	const columns = useMemo<
		ColumnDef<
			Artifact & {
				policy: Policy | null;
			}
		>[]
	>(
		() => [
			{
				accessorKey: "name",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t("frameworks.artifacts.table.name")}
					/>
				),
				cell: ({ row }) => {
					const name = row.original.policy?.name;
					return <span>{name}</span>;
				},
				enableSorting: true,
				sortingFn: (rowA, rowB, columnId) => {
					const nameA = rowA.original.policy?.name || "";
					const nameB = rowB.original.policy?.name || "";
					return nameA.localeCompare(nameB);
				},
			},
			{
				accessorKey: "type",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t("frameworks.artifacts.table.type")}
					/>
				),
				cell: ({ row }) => (
					<span className="capitalize">{row.original.type}</span>
				),
				enableSorting: true,
				sortingFn: (rowA, rowB, columnId) => {
					return rowA.original.type.localeCompare(rowB.original.type);
				},
			},
			{
				accessorKey: "createdAt",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t("frameworks.artifacts.table.created_at")}
					/>
				),
				cell: ({ row }) => (
					<span>
						{new Date(row.original.createdAt).toLocaleDateString()}
					</span>
				),
				enableSorting: true,
				sortingFn: (rowA, rowB, columnId) => {
					const dateA = new Date(rowA.original.createdAt);
					const dateB = new Date(rowB.original.createdAt);
					return dateA.getTime() - dateB.getTime();
				},
			},
			{
				accessorKey: "status",
				header: ({ column }) => (
					<DataTableColumnHeader
						column={column}
						title={t("frameworks.artifacts.table.status")}
					/>
				),
				cell: ({ row }) => {
					const rawStatus = row.original.policy?.status;

					// Pass the mapped status directly to StatusIndicator
					return <StatusIndicator status={rawStatus} />;
				},
			},
		],
		[t],
	);

	// Filter artifacts data based on search term
	const filteredArtifacts = useMemo(() => {
		if (!searchTerm.trim()) return artifacts;

		const searchLower = searchTerm.toLowerCase();
		return artifacts.filter(
			(artifact) =>
				artifact.id.toLowerCase().includes(searchLower) ||
				artifact.policy?.name?.toLowerCase().includes(searchLower) ||
				artifact.type.toLowerCase().includes(searchLower),
		);
	}, [artifacts, searchTerm]);

	// Set up the artifacts table
	const table = useDataTable({
		data: filteredArtifacts,
		columns,
		pageCount: 1,
		shallow: false,
		getRowId: (row) => row.id,
		initialState: {
			sorting: [{ id: "createdAt", desc: true }],
		},
		tableId: "a",
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{t("frameworks.artifacts.title")} (
					{filteredArtifacts.length})
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-center mb-4">
					<Input
						placeholder={t(
							"frameworks.artifacts.search.universal_placeholder",
						)}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="max-w-sm"
					/>
					<div className="ml-auto">
						<DataTableSortList
							table={table.table}
							align="end"
							tableId="a"
						/>
					</div>
				</div>
				<DataTable
					table={table.table}
					rowClickBasePath={`/${orgId}/`}
					getRowId={(row) => {
						if (row.type === "policy") {
							return `/policies/${row.policyId}`;
						}

						return `/artifacts/${row.id}`;
					}}
					tableId={"a"}
				/>
			</CardContent>
		</Card>
	);
}
