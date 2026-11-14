import type { CurrencyResponse } from "@/features/master-data/currency/data/currency.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { currencyService } from "./currency.service";

// Query Keys
export const currencyQueryKeys = {
  all: ["currencies"],
  lists: () => [...currencyQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [...currencyQueryKeys.lists(), params],
  details: () => [...currencyQueryKeys.all, "detail"],
  detail: (id: number) => [...currencyQueryKeys.details(), id],
  byCountry: () => [...currencyQueryKeys.all, "by-country"],
  byCountryId: (countryId: number) => [
    ...currencyQueryKeys.byCountry(),
    countryId,
  ],
};

/**
 * Hook to fetch paginated currencies
 */
export const useListCurrencies = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<CurrencyResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: currencyQueryKeys.list(params),
    queryFn: () => currencyService.listCurrencies(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Currencies loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load currencies",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific currency by ID
 */
export const useGetCurrencyById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<CurrencyResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: currencyQueryKeys.detail(id),
    queryFn: () => currencyService.getCurrencyById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Currency loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load currency",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch currencies by country
 */
export const useGetCurrenciesByCountry = (
  countryId: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<CurrencyResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: currencyQueryKeys.byCountryId(countryId),
    queryFn: () => currencyService.getCurrenciesByCountry(countryId),
    ...options,
  });

  return query;
};

/**
 * Hook to fetch active currencies by country
 */
export const useGetActiveCurrenciesByCountry = (
  countryId: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<CurrencyResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: [...currencyQueryKeys.byCountryId(countryId), "active"],
    queryFn: () => currencyService.getActiveCurrenciesByCountry(countryId),
    ...options,
  });

  return query;
};
