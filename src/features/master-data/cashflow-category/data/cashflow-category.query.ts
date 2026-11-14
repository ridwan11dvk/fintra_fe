import type { CashflowCategoryResponse } from "@/features/master-data/cashflow-category/data/cashflow-category.types";
import type {
  ApiResponse,
  PagedApiResponse,
  PaginationParams,
} from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { cashflowCategoryService } from "./cashflow-category.service";

export const cashflowCategoryQueryKeys = {
  all: ["cashflowCategories"],
  lists: () => [...cashflowCategoryQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [
    ...cashflowCategoryQueryKeys.lists(),
    params,
  ],
  details: () => [...cashflowCategoryQueryKeys.all, "detail"],
  detail: (id: number) => [...cashflowCategoryQueryKeys.details(), id],
};

export const useListCashflowCategories = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<CashflowCategoryResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: cashflowCategoryQueryKeys.list(params),
    queryFn: () => cashflowCategoryService.listCashflowCategories(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Cashflow categories loaded successfully",
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
          query.error.message ||
          "Failed to load cashflow categories",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

export const useGetCashflowCategoryById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<CashflowCategoryResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: cashflowCategoryQueryKeys.detail(id),
    queryFn: () => cashflowCategoryService.getCashflowCategoryById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message ||
          query.error.message ||
          "Failed to load cashflow category",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
