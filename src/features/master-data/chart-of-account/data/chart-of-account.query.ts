import type {
  ApiResponse,
  PagedApiResponse,
  PaginationParams,
} from "@railfinance/core";
import { toast } from "@railfinance/core";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { chartOfAccountService } from "./chart-of-account.service";
import type { ChartOfAccountResponse } from "./chart-of-account.types";

export const chartOfAccountQueryKeys = {
  all: ["chartOfAccounts"],
  lists: () => [...chartOfAccountQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [
    ...chartOfAccountQueryKeys.lists(),
    params,
  ],
  details: () => [...chartOfAccountQueryKeys.all, "detail"],
  detail: (id: string | number) => [...chartOfAccountQueryKeys.details(), id],
};

/**
 * Hook to fetch paginated chart of accounts
 */
export const useListChartOfAccounts = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<ChartOfAccountResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: chartOfAccountQueryKeys.list(params),
    queryFn: () => chartOfAccountService.listChartOfAccounts(params),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message ||
          "Failed to load chart of accounts",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a single chart of account by ID
 */
export const useGetChartOfAccountById = (
  id: string | number,
  options?: Omit<
    UseQueryOptions<ApiResponse<ChartOfAccountResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: chartOfAccountQueryKeys.detail(id),
    queryFn: () => chartOfAccountService.getChartOfAccountById(id),
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: "always",
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message ||
          "Failed to load chart of account details",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
