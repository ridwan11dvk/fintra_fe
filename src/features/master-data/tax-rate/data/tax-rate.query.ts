import type { TaxRateResponse } from "@/features/master-data/tax-rate/data/tax-rate.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { taxRateService } from "./tax-rate.service";

// Query Keys
export const taxRateQueryKeys = {
  all: ["taxRates"],
  lists: () => [...taxRateQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [...taxRateQueryKeys.lists(), params],
  details: () => [...taxRateQueryKeys.all, "detail"],
  detail: (id: number) => [...taxRateQueryKeys.details(), id],
  byCode: (code: string) => [...taxRateQueryKeys.all, "byCode", code],
};

/**
 * Hook to fetch paginated tax rates
 */
export const useListTaxRates = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<TaxRateResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: taxRateQueryKeys.list(params),
    queryFn: () => taxRateService.listTaxRates(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Tax rates loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load tax rates",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific tax rate by ID
 */
export const useGetTaxRateById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<TaxRateResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: taxRateQueryKeys.detail(id),
    queryFn: () => taxRateService.getTaxRateById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Tax rate loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load tax rate",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific tax rate by code
 */
export const useGetTaxRateByCode = (
  code: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<TaxRateResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: taxRateQueryKeys.byCode(code),
    queryFn: () => taxRateService.getTaxRateByCode(code),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Tax rate loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load tax rate",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
