import type { UomResponse } from "@/features/master-data/unit-of-measure/data/uom.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { uomService } from "./uom.service";

// Query Keys
export const uomQueryKeys = {
  all: ["uoms"],
  lists: () => [...uomQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [...uomQueryKeys.lists(), params],
  details: () => [...uomQueryKeys.all, "detail"],
  detail: (id: number) => [...uomQueryKeys.details(), id],
  detailByCode: (code: string) => [...uomQueryKeys.details(), "code", code],
  active: () => [...uomQueryKeys.all, "active"],
};

/**
 * Hook to fetch paginated units of measure
 */
export const useListUoms = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<UomResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: uomQueryKeys.list(params),
    queryFn: () => uomService.listUoms(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Units of measure loaded successfully",
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
          "Failed to load units of measure",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch all active units of measure (no pagination)
 */
export const useGetActiveUoms = (
  options?: Omit<
    UseQueryOptions<ApiResponse<UomResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: uomQueryKeys.active(),
    queryFn: () => uomService.getActiveUoms(),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message ||
          "Failed to load active units of measure",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific unit of measure by ID
 */
export const useGetUomById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<UomResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: uomQueryKeys.detail(id),
    queryFn: () => uomService.getUomById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Unit of measure loaded successfully",
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
        axiosError?.response?.data?.message || "Failed to load unit of measure",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a unit of measure by code
 */
export const useGetUomByCode = (
  code: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<UomResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: uomQueryKeys.detailByCode(code),
    queryFn: () => uomService.getUomByCode(code),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Unit of measure loaded successfully",
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
        axiosError?.response?.data?.message || "Failed to load unit of measure",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
