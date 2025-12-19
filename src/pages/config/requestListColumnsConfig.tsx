import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortableHeader } from "@/components/SortableHeader";
import { RequestStatusBadge } from "@/components/RequestStatusBadge";
import type { RequestListItem } from "@/types/request";
import type { NavigateFunction, Location } from "react-router";

interface GetColumnsProps {
  navigate: NavigateFunction;
  location: Location;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
}

export const getColumns = ({
  navigate,
  location,
  sortBy,
  sortOrder,
  onSort,
}: GetColumnsProps): ColumnDef<RequestListItem>[] => [
  {
    accessorKey: "createdAt",
    header: () => (
      <div className="pl-7">
        <SortableHeader
          title="Created Date"
          field="createdAt"
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
          onSort={onSort}
        />
      </div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "formData.title",
    header: "Title",
    cell: ({ row }) => (
      <div className="truncate font-medium">
        {row.original.formData?.title || "No Title"}
      </div>
    ),
  },
  {
    accessorKey: "formData.targetDate",
    header: "Target Date",
    cell: ({ row }) => <div>{row.original.formData?.targetDate || "-"}</div>,
  },
  {
    accessorKey: "formData.categoryImpact",
    header: "Category",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.formData?.categoryImpact || "-"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <RequestStatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          navigate(`/requests/${row.original.id}`, {
            state: { from: location },
          });
        }}
      >
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span>View details</span>
        </div>
      </Button>
    ),
  },
];
