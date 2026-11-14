import type { TransactionTypeResponse } from "@/features/master-data/transaction-type/data/transaction-type.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { transactionTypeService } from "./transaction-type.service";

// Query Keys
export const transactionTypeQueryKeys = {
  all: ["transaction-types"],
  lists: () => [...transactionTypeQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [
    ...transactionTypeQueryKeys.lists(),
    params,
  ],
  details: () => [...transactionTypeQueryKeys.all, "detail"],
  detail: (id: number) => [...transactionTypeQueryKeys.details(), id],
  byCompanyCode: (companyCode: string) => [
    ...transactionTypeQueryKeys.all,
    "company",
    companyCode,
  ],
  byModuleId: (moduleId: number) => [
    ...transactionTypeQueryKeys.all,
    "module",
    moduleId,
  ],
};

/**
 * Hook to fetch paginated transaction types
 */
export const useListTransactionTypes = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<TransactionTypeResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: transactionTypeQueryKeys.list(params),
    queryFn: () => transactionTypeService.listTransactionTypes(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Transaction types loaded successfully",
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
          "Failed to load transaction types",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific transaction type by ID
 */
export const useGetTransactionTypeById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<TransactionTypeResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: transactionTypeQueryKeys.detail(id),
    queryFn: () => transactionTypeService.getTransactionTypeById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Transaction type loaded successfully",
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
          "Failed to load transaction type",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch transaction types by company code
 */
export const useGetTransactionTypesByCompanyCode = (
  companyCode: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<TransactionTypeResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: transactionTypeQueryKeys.byCompanyCode(companyCode),
    queryFn: () =>
      transactionTypeService.getTransactionTypesByCompanyCode(companyCode),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message ||
          "Failed to load transaction types",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch transaction types by module ID
 */
export const useGetTransactionTypesByModuleId = (
  moduleId: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<TransactionTypeResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: transactionTypeQueryKeys.byModuleId(moduleId),
    queryFn: () =>
      transactionTypeService.getTransactionTypesByModuleId(moduleId),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message ||
          "Failed to load transaction types",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
