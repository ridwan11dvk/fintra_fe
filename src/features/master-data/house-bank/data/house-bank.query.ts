import type { HouseBankResponse } from "@/features/master-data/house-bank/data/house-bank.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { houseBankService } from "./house-bank.service";

// Query Keys
export const houseBankQueryKeys = {
  all: ["house-banks"],
  lists: () => [...houseBankQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [...houseBankQueryKeys.lists(), params],
  details: () => [...houseBankQueryKeys.all, "detail"],
  detail: (id: number) => [...houseBankQueryKeys.details(), id],
};

/**
 * Hook to fetch paginated house banks
 */
export const useListHouseBanks = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<HouseBankResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: houseBankQueryKeys.list(params),
    queryFn: () => houseBankService.listHouseBanks(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "House banks loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load house banks",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific house bank by ID
 */
export const useGetHouseBankById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<HouseBankResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: houseBankQueryKeys.detail(id),
    queryFn: () => houseBankService.getHouseBankById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "House bank loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load house bank",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
