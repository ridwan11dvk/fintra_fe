import type { BusinessAreaResponse } from "@/features/master-data/business-area/data/business-area.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { businessAreaService } from "./business-area.service";

// Query Keys
export const businessAreaQueryKeys = {
  all: ["business-areas"],
  lists: () => [...businessAreaQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [
    ...businessAreaQueryKeys.lists(),
    params,
  ],
  details: () => [...businessAreaQueryKeys.all, "detail"],
  detail: (id: number) => [...businessAreaQueryKeys.details(), id],
  byCode: (baCode: string) => [...businessAreaQueryKeys.all, "code", baCode],
};

/**
 * Hook to fetch paginated business areas
 */
export const useListBusinessAreas = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<BusinessAreaResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: businessAreaQueryKeys.list(params),
    queryFn: () => businessAreaService.listBusinessAreas(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Business areas loaded successfully",
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
        axiosError?.response?.data?.message || "Failed to load business areas",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific business area by ID
 */
export const useGetBusinessAreaById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<BusinessAreaResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: businessAreaQueryKeys.detail(id),
    queryFn: () => businessAreaService.getBusinessAreaById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Business area loaded successfully",
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
        axiosError?.response?.data?.message || "Failed to load business area",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a business area by code
 */
export const useGetBusinessAreaByCode = (
  baCode: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<BusinessAreaResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: businessAreaQueryKeys.byCode(baCode),
    queryFn: () => businessAreaService.getBusinessAreaByCode(baCode),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Business area loaded successfully",
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
        axiosError?.response?.data?.message || "Failed to load business area",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
