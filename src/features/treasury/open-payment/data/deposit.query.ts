import {
  depositService,
  type CountByStatusResponse,
  type DepositResponse,
  type DepositSummary,
} from "@/features/treasury";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

// Query Keys
export const depositQueryKeys = {
  all: ["deposits"],
  lists: () => [...depositQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [...depositQueryKeys.lists(), params],
  details: () => [...depositQueryKeys.all, "detail"],
  detail: (id: number) => [...depositQueryKeys.details(), id],
  summaries: () => [...depositQueryKeys.all, "summary"],
  summary: () => [...depositQueryKeys.summaries(), "stats"],
  countByStatus: () => [...depositQueryKeys.summaries(), "count-by-status"],
};

/**
 * Hook to fetch paginated deposits with filters
 */
export const useListDeposits = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<DepositResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: depositQueryKeys.list(params),
    queryFn: () => depositService.listDeposits(params),
    ...options,
  });
};

/**
 * Hook to fetch a specific deposit by ID
 */
export const useGetDepositById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<DepositResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: depositQueryKeys.detail(id),
    queryFn: () => depositService.getDepositById(id),
    ...options,
  });
};

/**
 * Hook to fetch deposit summary
 */
export const useGetDepositSummary = (
  options?: Omit<
    UseQueryOptions<ApiResponse<DepositSummary>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: depositQueryKeys.summary(),
    queryFn: () => depositService.getSummary(),
    ...options,
  });
};

/**
 * Hook to fetch count by send status
 */
export const useGetDepositCountByStatus = (
  options?: Omit<
    UseQueryOptions<ApiResponse<CountByStatusResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: depositQueryKeys.countByStatus(),
    queryFn: () => depositService.getCountByStatus(),
    ...options,
  });
};
