import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Kapan perlu refresh data
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Seberapa lama data di-cache
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // AxiosError has response?.status
        if (
          error instanceof AxiosError &&
          (error as AxiosError).response &&
          (error as AxiosError).response!.status >= 400 &&
          (error as AxiosError).response!.status < 500
        ) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      // avoid a global blocking alert; handle errors per-mutation
      retry: false, // sensible default for mutations (override per-mutation)
      onError: (err) => {
        // log by default; UI should show toast in specific components
        console.warn("Mutation error:", err);
      },
    },
  },
});

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
  }
}

window.__TANSTACK_QUERY_CLIENT__ = queryClient;
