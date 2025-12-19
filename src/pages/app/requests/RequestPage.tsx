import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { Loader2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRequestTable } from "@/hooks/useRequestTable";
import { getColumns } from "@/pages/config/requestListColumnsConfig";

const RequestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data,
    paginationMeta,
    isLoading,
    isError,
    filters,
    localSearch,
    setLocalSearch,
    handleSort,
    handleStatusChange,
    handlePaginationChange,
  } = useRequestTable();

  const columns = useMemo(
    () =>
      getColumns({
        navigate,
        location,
        sortBy: filters.sortBy || "createdAt",
        sortOrder: filters.sortOrder || "desc",
        onSort: handleSort,
      }),
    [navigate, location, filters.sortBy, filters.sortOrder, handleSort]
  );

  if (isError) {
    return <div className="p-8 text-red-500">Error loading requests.</div>;
  }

  return (
    <div className="mx-auto max-w space-y-6">
      {/* Page Header */}
      <div className="space-y-6">
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

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/20 p-4 rounded-lg border">
          <div className="relative w-full flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="w-full sm:w-auto min-w-[180px]">
            <Select
              value={filters.status || "ALL"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PENDING_MANAGER">
                  Pending Manager Review
                </SelectItem>
                <SelectItem value="PENDING_VP">Pending VP Review</SelectItem>
                <SelectItem value="REVISION_MANAGER">
                  Revision Needed (Manager)
                </SelectItem>
                <SelectItem value="REVISION_VP">
                  Revision Needed (VP)
                </SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED_MANAGER">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table Section */}
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="space-y-4">
            <DataTable
              columns={columns}
              data={data}
              rowCount={paginationMeta?.total || 0}
              pagination={{
                pageIndex: filters.page - 1,
                pageSize: filters.limit,
              }}
              onPaginationChange={handlePaginationChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPage;
