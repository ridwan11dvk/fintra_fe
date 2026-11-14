import type { DistrictResponse } from "@/features/master-data/district/data/district.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { districtService } from "./district.service";

// Query Keys
export const districtQueryKeys = {
  all: ["districts"],
  lists: () => [...districtQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [...districtQueryKeys.lists(), params],
  details: () => [...districtQueryKeys.all, "detail"],
  detail: (id: number) => [...districtQueryKeys.details(), id],
  byRegency: (regencyId: number) => [
    ...districtQueryKeys.all,
    "regency",
    regencyId,
  ],
};

/**
 * Hook to fetch paginated districts
 */
export const useListDistricts = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<DistrictResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: districtQueryKeys.list(params),
    queryFn: () => districtService.listDistricts(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Districts loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load districts",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific district by ID
 */
export const useGetDistrictById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<DistrictResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: districtQueryKeys.detail(id),
    queryFn: () => districtService.getDistrictById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "District loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load district",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch districts by regency ID
 */
export const useGetDistrictsByRegencyId = (
  regencyId: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<DistrictResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: districtQueryKeys.byRegency(regencyId),
    queryFn: () => districtService.getDistrictsByRegencyId(regencyId),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Districts loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load districts",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
