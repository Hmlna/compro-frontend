/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { getRequest } from "@/api/requests/getRequests";
import { useRequestFilters } from "@/hooks/useRequestFilter";
import type { RequestStatus } from "@/types/request";

export const useRequestTable = () => {
  const { filters, setFilters } = useRequestFilters();
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [debouncedSearch] = useDebounce(localSearch, 500);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch, setFilters, filters.search]);

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["requests", filters],
    queryFn: () => getRequest(filters),
    placeholderData: keepPreviousData,
    refetchInterval: 5000,
  });

  const handleSort = (field: string) => {
    const isAsc = filters.sortBy === field && filters.sortOrder === "asc";
    setFilters({
      sortBy: field,
      sortOrder: isAsc ? "desc" : "asc",
      page: 1,
    });
  };

  const handleStatusChange = (val: string) => {
    setFilters({
      status: val === "ALL" ? undefined : (val as RequestStatus),
      page: 1,
    });
  };

  const handlePaginationChange = (updater: any) => {
    if (typeof updater === "function") {
      const newState = updater({
        pageIndex: filters.page - 1,
        pageSize: filters.limit,
      });
      setFilters({ page: newState.pageIndex + 1 });
    } else {
      setFilters({ page: updater.pageIndex + 1 });
    }
  };

  return {
    data: response?.data || [],
    paginationMeta: response?.pagination,
    isLoading,
    isError,
    filters,
    localSearch,
    setLocalSearch,
    handleSort,
    handleStatusChange,
    handlePaginationChange,
  };
};
