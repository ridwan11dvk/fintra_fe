import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import type { RejectCategoryResponse } from "@railfinance/core/masterdata";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { rejectCategoryService } from "./reject-category.service";

export const rejectCategoryQueryKeys = {
  all: ["rejectCategories"],
  lists: () => [...rejectCategoryQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [
    ...rejectCategoryQueryKeys.lists(),
    params,
  ],
  details: () => [...rejectCategoryQueryKeys.all, "detail"],
  detail: (id: number) => [...rejectCategoryQueryKeys.details(), id],
};

export const useListRejectCategories = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<RejectCategoryResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: rejectCategoryQueryKeys.list(params),
    queryFn: () => rejectCategoryService.listRejectCategories(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Reject categories loaded successfully",
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
          "Failed to load reject categories",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

export const useGetRejectCategoryById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<RejectCategoryResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: rejectCategoryQueryKeys.detail(id),
    queryFn: () => rejectCategoryService.getRejectCategoryById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Reject category loaded successfully",
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
        axiosError?.response?.data?.message || "Failed to load reject category",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
