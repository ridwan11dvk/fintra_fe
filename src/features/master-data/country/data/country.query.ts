import type { CountryResponse } from "@/features/master-data/country/data/country.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { countryService } from "./country.service";

// Query Keys
export const countryQueryKeys = {
  all: ["countries"],
  lists: () => [...countryQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [...countryQueryKeys.lists(), params],
  details: () => [...countryQueryKeys.all, "detail"],
  detail: (id: number) => [...countryQueryKeys.details(), id],
};

/**
 * Hook to fetch paginated countries
 */
export const useListCountries = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<CountryResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: countryQueryKeys.list(params),
    queryFn: () => countryService.listCountries(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Countries loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load countries",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific country by ID
 */
export const useGetCountryById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<CountryResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: countryQueryKeys.detail(id),
    queryFn: () => countryService.getCountryById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Country loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load country",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
