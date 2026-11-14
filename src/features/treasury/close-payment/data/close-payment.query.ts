import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { closePaymentService } from "./close-payment.service";
import type { ClosePaymentResponse } from "./close-payment.types";

// Query Keys
export const closePaymentQueryKeys = {
  all: ["closePayments"],
  lists: () => [...closePaymentQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [
    ...closePaymentQueryKeys.lists(),
    params,
  ],
  details: () => [...closePaymentQueryKeys.all, "detail"],
  detail: (id: number) => [...closePaymentQueryKeys.details(), id],
  summaries: () => [...closePaymentQueryKeys.all, "summary"],
  unpaidCount: () => [...closePaymentQueryKeys.summaries(), "unpaid-count"],
  countByStatus: (status: 0 | 1) => [
    ...closePaymentQueryKeys.summaries(),
    "count-by-status",
    status,
  ],
};

/**
 * Hook to fetch paginated close payments
 */
export const useListClosePayments = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<ClosePaymentResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: closePaymentQueryKeys.list(params),
    queryFn: () => closePaymentService.listClosePayments(params),
    ...options,
  });
};

/**
 * Hook to fetch a specific close payment by ID
 */
export const useGetClosePaymentById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<ClosePaymentResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: closePaymentQueryKeys.detail(id),
    queryFn: () => closePaymentService.getClosePaymentById(id),
    ...options,
  });
};

/**
 * Hook to fetch unpaid count
 */
export const useGetUnpaidCount = (
  options?: Omit<
    UseQueryOptions<ApiResponse<number>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: closePaymentQueryKeys.unpaidCount(),
    queryFn: () => closePaymentService.getUnpaidCount(),
    ...options,
  });
};

/**
 * Hook to fetch count by payment status
 */
export const useGetPaymnetCountByStatus = (
  paymentStatus: 0 | 1,
  options?: Omit<
    UseQueryOptions<ApiResponse<number>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: closePaymentQueryKeys.countByStatus(paymentStatus),
    queryFn: () => closePaymentService.getCountByStatus(paymentStatus),
    ...options,
  });
};
