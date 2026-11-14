import type { CurrencyRateResponse } from "@/features/master-data/currency-rate/data/currency-rate.types";
import type { ApiResponse, PagedApiResponse } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  currencyRateService,
  type CurrencyRateListParams,
} from "./currency-rate.service";

// Query Keys
export const currencyRateQueryKeys = {
  all: ["currency-rates"],
  lists: () => [...currencyRateQueryKeys.all, "list"],
  list: (params?: CurrencyRateListParams) => [
    ...currencyRateQueryKeys.lists(),
    params,
  ],
  details: () => [...currencyRateQueryKeys.all, "detail"],
  detail: (id: number) => [...currencyRateQueryKeys.details(), id],
  byCurrency: () => [...currencyRateQueryKeys.all, "by-currency"],
  byCurrencyCode: (currencyCode: string) => [
    ...currencyRateQueryKeys.byCurrency(),
    currencyCode,
  ],
  byType: (currencyCode: string, rateType: string) => [
    ...currencyRateQueryKeys.byCurrencyCode(currencyCode),
    rateType,
  ],
};

/**
 * Hook to fetch paginated currency rates
 */
export const useListCurrencyRates = (
  params?: CurrencyRateListParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<CurrencyRateResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: currencyRateQueryKeys.list(params),
    queryFn: () => currencyRateService.listCurrencyRates(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Currency rates loaded successfully",
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
        axiosError?.response?.data?.message || "Failed to load currency rates",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific currency rate by ID
 */
export const useGetCurrencyRateById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<CurrencyRateResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: currencyRateQueryKeys.detail(id),
    queryFn: () => currencyRateService.getCurrencyRateById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Currency rate loaded successfully",
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
        axiosError?.response?.data?.message || "Failed to load currency rate",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch currency rates by currency code
 */
export const useGetCurrencyRatesByCurrency = (
  currencyCode: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<CurrencyRateResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: currencyRateQueryKeys.byCurrencyCode(currencyCode),
    queryFn: () => currencyRateService.getCurrencyRatesByCurrency(currencyCode),
    ...options,
  });

  return query;
};

/**
 * Hook to fetch currency rates by currency code and rate type
 */
export const useGetCurrencyRatesByType = (
  currencyCode: string,
  rateType: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<CurrencyRateResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: currencyRateQueryKeys.byType(currencyCode, rateType),
    queryFn: () =>
      currencyRateService.getCurrencyRatesByType(currencyCode, rateType),
    ...options,
  });

  return query;
};

/**
 * Hook to fetch rate at specific date
 */
export const useGetRateAtDate = (
  currencyCode: string,
  rateType: string,
  date: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<CurrencyRateResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: [
      ...currencyRateQueryKeys.byType(currencyCode, rateType),
      "at-date",
      date,
    ],
    queryFn: () =>
      currencyRateService.getRateAtDate(currencyCode, rateType, date),
    ...options,
  });

  return query;
};

/**
 * Hook to fetch latest rates by rate type
 */
export const useGetLatestRatesByRateType = (
  rateType: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<CurrencyRateResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: ["currency-rates", rateType, "latest"],
    queryFn: () => currencyRateService.getLatestRatesByRateType(rateType),
    ...options,
  });

  return query;
};

/**
 * Hook to fetch latest rate
 */
export const useGetLatestRate = (
  currencyCode: string,
  rateType: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<CurrencyRateResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: [
      ...currencyRateQueryKeys.byType(currencyCode, rateType),
      "latest",
    ],
    queryFn: () => currencyRateService.getLatestRate(currencyCode, rateType),
    ...options,
  });

  return query;
};
