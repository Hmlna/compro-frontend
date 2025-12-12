import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import type { RequestFormSchema } from "@/schema/requestFormSchema";
import { DataTable } from "@/components/ui/data-table";
import { Eye, Trash, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import RequestDetailsDialog from "@/components/requests/RequestDetailsDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequestsbyCreatedById } from "@/api/requests/getRequests";
import { axiosInstance } from "@/api/axios";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import type { RequestRecord, RequestStatus } from "@/types/request";
import { useAuth } from "@/hooks/useAuth";

// Helper for status colors
const getStatusBadge = (status: RequestStatus) => {
  switch (status) {
    case "pending_manager":
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">
          Manager Review
        </Badge>
      );
    case "pending_vp":
      return <Badge className="bg-blue-500 hover:bg-blue-600">VP Review</Badge>;
    case "revision_needed":
      return (
        <Badge className="bg-orange-500 hover:bg-orange-600">
          Revision Needed
        </Badge>
      );
    case "approved":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
      );
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    case "in_progress":
      return (
        <Badge className="bg-indigo-500 hover:bg-indigo-600">In Progress</Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// Adjust type to match your API response structure if needed
type RequestEntry = RequestFormSchema & { id: string };

const RequestPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<RequestEntry | null>(null);

  // 1. Fetch requests from API
  const {
    data: items = [],
    isLoading,
    isError,
  } = useQuery<RequestRecord[]>({
    queryKey: ["requests", user?.id],
    queryFn: () => getRequestsbyCreatedById(user?.id),
    enabled: !!user,
  });

  // 2. Handle Delete via API
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/requests/${id}`);
    },
    onSuccess: () => {
      toast.success("Request deleted");
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
    onError: () => {
      toast.error("Failed to delete request");
    },
  });

  const columns: ColumnDef<RequestRecord>[] = [
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate font-medium">
          {row.getValue("title")}
        </div>
      ),
    },
    {
      // Note: Check if your API returns 'proposers' or 'proposers1'
      accessorKey: "proposers1",
      header: "Proposers",
      cell: ({ row }) => <div>{row.getValue("proposers1")}</div>,
    },
    {
      accessorKey: "businessArea",
      header: "Business Area",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("businessArea")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const r = row.original;
        return (
          <div className="flex gap-2 justify-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setPreviewItem(r);
                    setPreviewOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Preview</TooltipContent>
            </Tooltip>

            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:bg-destructive/10"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (confirm("Are you sure you want to delete this request?")) {
                  deleteMutation.mutate(r.id);
                }
              }}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash className="h-4 w-4" />
              )}
            </Button>
          </div>
        );
      },
    },
  ];

  if (isError) {
    return <div className="p-8 text-red-500">Error loading requests.</div>;
  }

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="space-y-6">
          {/* Header with New Request Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                My Change Requests
              </h1>
              <p className="text-muted-foreground">
                All requests you have submitted.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate("/new-request")}
                className="w-full sm:w-auto cursor-pointer"
              >
                New Request
              </Button>
            </div>
          </div>

          {/* Data Table */}
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <DataTable columns={columns} data={items} initialPageSize={10} />
          )}
        </div>
      </div>
      <RequestDetailsDialog
        open={previewOpen}
        onOpenChange={(v) => {
          setPreviewOpen(v);
          if (!v) setPreviewItem(null);
        }}
        data={previewItem}
      />
    </>
  );
};

export default RequestPage;
