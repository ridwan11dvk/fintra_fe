import type { ProvinceResponse } from "@/features/master-data/province/data/province.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { provinceService } from "./province.service";

// Query Keys
export const provinceQueryKeys = {
  all: ["provinces"],
  lists: () => [...provinceQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [...provinceQueryKeys.lists(), params],
  details: () => [...provinceQueryKeys.all, "detail"],
  detail: (id: number) => [...provinceQueryKeys.details(), id],
};

/**
 * Hook to fetch paginated provinces
 */
export const useListProvinces = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<ProvinceResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: provinceQueryKeys.list(params),
    queryFn: () => provinceService.listProvinces(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Provinces loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load provinces",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific province by ID
 */
export const useGetProvinceById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<ProvinceResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: provinceQueryKeys.detail(id),
    queryFn: () => provinceService.getProvinceById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Province loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load province",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
