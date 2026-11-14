import type { VillageResponse } from "@/features/master-data/village/data/village.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { villageService } from "./village.service";

// Query Keys
export const villageQueryKeys = {
  all: ["villages"],
  lists: () => [...villageQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [...villageQueryKeys.lists(), params],
  details: () => [...villageQueryKeys.all, "detail"],
  detail: (id: number) => [...villageQueryKeys.details(), id],
  byDistrict: (districtId: number) => [
    ...villageQueryKeys.all,
    "district",
    districtId,
  ],
};

/**
 * Hook to fetch paginated villages
 */
export const useListVillages = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<VillageResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: villageQueryKeys.list(params),
    queryFn: () => villageService.listVillages(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Villages loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load villages",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific village by ID
 */
export const useGetVillageById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<VillageResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: villageQueryKeys.detail(id),
    queryFn: () => villageService.getVillageById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Village loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load village",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch villages by district ID
 */
export const useGetVillagesByDistrictId = (
  districtId: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<VillageResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: villageQueryKeys.byDistrict(districtId),
    queryFn: () => villageService.getVillagesByDistrictId(districtId),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Villages loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load villages",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
