import type { TransactionCategoryResponse } from "@/features/master-data/transaction-category/data/transaction-category.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { transactionCategoryService } from "./transaction-category.service";

// Query Keys
export const transactionCategoryQueryKeys = {
  all: ["transaction-categories"],
  lists: () => [...transactionCategoryQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [
    ...transactionCategoryQueryKeys.lists(),
    params,
  ],
  details: () => [...transactionCategoryQueryKeys.all, "detail"],
  detail: (id: number) => [...transactionCategoryQueryKeys.details(), id],
};

/**
 * Hook to fetch paginated transaction categories
 */
export const useListTransactionCategories = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<TransactionCategoryResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: transactionCategoryQueryKeys.list(params),
    queryFn: () => transactionCategoryService.listTransactionCategories(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Transaction categories loaded successfully",
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
        axiosError?.response?.data?.message ||
          "Failed to load transaction categories",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific transaction category by ID
 */
export const useGetTransactionCategoryById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<TransactionCategoryResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: transactionCategoryQueryKeys.detail(id),
    queryFn: () => transactionCategoryService.getTransactionCategoryById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Transaction category loaded successfully",
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
        axiosError?.response?.data?.message ||
          "Failed to load transaction category",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
