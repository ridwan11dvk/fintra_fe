import type { CustomsOfficeResponse } from "@/features/master-data/customs-office/data/customs-office.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { customsOfficeService } from "./customs-office.service";

// Query Keys
export const customsOfficeQueryKeys = {
  all: ["customsOffices"],
  lists: () => [...customsOfficeQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [
    ...customsOfficeQueryKeys.lists(),
    params,
  ],
  listAlt: (params?: { search?: string }) => [
    ...customsOfficeQueryKeys.lists(),
    "alt",
    params,
  ],
  details: () => [...customsOfficeQueryKeys.all, "detail"],
  detail: (id: number) => [...customsOfficeQueryKeys.details(), id],
};

export const useListCustomsOfficesAlt = (
  params?: { search?: string }, // Hanya search, tanpa page/size
  options?: Omit<
    UseQueryOptions<ApiResponse<CustomsOfficeResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: customsOfficeQueryKeys.listAlt(params),
    queryFn: () => customsOfficeService.listCustomsOfficesAlt(params),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load customs offices",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch paginated customs offices
 */
export const useListCustomsOffices = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<CustomsOfficeResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: customsOfficeQueryKeys.list(params),
    queryFn: () => customsOfficeService.listCustomsOffices(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Customs offices loaded successfully",
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
        axiosError?.response?.data?.message || "Failed to load customs offices",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific customs office by ID
 */
export const useGetCustomsOfficeById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<CustomsOfficeResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: customsOfficeQueryKeys.detail(id),
    queryFn: () => customsOfficeService.getCustomsOfficeById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Customs office loaded successfully",
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
        axiosError?.response?.data?.message || "Failed to load customs office",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
