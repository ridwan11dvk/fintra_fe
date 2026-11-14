import type { TermOfPaymentResponse } from "@/features/master-data/term-of-payment/data/term-of-payment.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { termOfPaymentService } from "./term-of-payment.service";

// Query Keys
export const termOfPaymentQueryKeys = {
  all: ["termOfPayments"],
  lists: () => [...termOfPaymentQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [
    ...termOfPaymentQueryKeys.lists(),
    params,
  ],
  details: () => [...termOfPaymentQueryKeys.all, "detail"],
  detail: (id: number) => [...termOfPaymentQueryKeys.details(), id],
};

/**
 * Hook to fetch paginated payment terms
 */
export const useListTermOfPayments = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<TermOfPaymentResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: termOfPaymentQueryKeys.list(params),
    queryFn: () => termOfPaymentService.listTermOfPayments(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Payment terms loaded successfully",
        );
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load payment terms",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific payment term by ID
 */
export const useGetTermOfPaymentById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<TermOfPaymentResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: termOfPaymentQueryKeys.detail(id),
    queryFn: () => termOfPaymentService.getTermOfPaymentById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Payment term loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load payment term",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
