import { useSearchParams } from "react-router";
import { useCallback } from "react";
import type { RequestStatus } from "@/types/request";

export const useRequestFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
    search: searchParams.get("search") || "",
    status: (searchParams.get("status") as RequestStatus) || undefined,
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
  };

  const setFilters = useCallback(
    (newFilters: Partial<typeof filters>) => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      if (
        !newFilters.page &&
        (newFilters.search !== undefined || newFilters.status !== undefined)
      ) {
        newParams.set("page", "1");
      }

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  return { filters, setFilters };
};
