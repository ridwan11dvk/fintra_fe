import type { PartnerCategoryResponse } from "@/features/master-data/partner-category/data/partner-category.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { partnerCategoryService } from "./partner-category.service";

// Query Keys
export const partnerCategoryQueryKeys = {
  all: ["partner-categories"],
  lists: () => [...partnerCategoryQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [
    ...partnerCategoryQueryKeys.lists(),
    params,
  ],
  details: () => [...partnerCategoryQueryKeys.all, "detail"],
  detail: (id: number) => [...partnerCategoryQueryKeys.details(), id],
};

/**
 * Hook to fetch paginated partner categories
 */
export const useListPartnerCategories = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<PartnerCategoryResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: partnerCategoryQueryKeys.list(params),
    queryFn: () => partnerCategoryService.listPartnerCategories(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Partner categories loaded successfully",
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
          "Failed to load partner categories",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific partner category by ID
 */
export const useGetPartnerCategoryById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<PartnerCategoryResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: partnerCategoryQueryKeys.detail(id),
    queryFn: () => partnerCategoryService.getPartnerCategoryById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Partner category loaded successfully",
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
          "Failed to load partner category",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
