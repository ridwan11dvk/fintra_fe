import type { RegencyResponse } from "@/features/master-data/regency/data/regency.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { regencyService } from "./regency.service";

// Query Keys
export const regencyQueryKeys = {
  all: ["regencies"],
  lists: () => [...regencyQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [...regencyQueryKeys.lists(), params],
  details: () => [...regencyQueryKeys.all, "detail"],
  detail: (id: number) => [...regencyQueryKeys.details(), id],
  byProvince: (provinceId: number) => [
    ...regencyQueryKeys.all,
    "province",
    provinceId,
  ],
};

/**
 * Hook to fetch paginated regencies
 */
export const useListRegencies = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<RegencyResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: regencyQueryKeys.list(params),
    queryFn: () => regencyService.listRegencies(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Regencies loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load regencies",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific regency by ID
 */
export const useGetRegencyById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<RegencyResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: regencyQueryKeys.detail(id),
    queryFn: () => regencyService.getRegencyById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Regency loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load regency",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch regencies by province ID
 */
export const useGetRegenciesByProvinceId = (
  provinceId: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<RegencyResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: regencyQueryKeys.byProvince(provinceId),
    queryFn: () => regencyService.getRegenciesByProvinceId(provinceId),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Regencies loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load regencies",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
