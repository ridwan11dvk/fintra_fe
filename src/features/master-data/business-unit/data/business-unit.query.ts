import type {
  ApiResponse,
  PagedApiResponse,
  PaginationParams,
} from "@railfinance/core";
import { toast } from "@railfinance/core";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { businessUnitService } from "./business-unit.service";
import type { BusinessUnitResponse } from "./business-unit.types";

export const businessUnitQueryKeys = {
  all: ["businessUnits"],
  lists: () => [...businessUnitQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [
    ...businessUnitQueryKeys.lists(),
    params,
  ],
  details: () => [...businessUnitQueryKeys.all, "detail"],
  detail: (id: string | number) => [...businessUnitQueryKeys.details(), id],
};

/**
 * Hook to fetch paginated business units
 */
export const useListBusinessUnits = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<BusinessUnitResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: businessUnitQueryKeys.list(params),
    queryFn: () => businessUnitService.listBusinessUnits(params),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load business units",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a single business unit by ID
 */
export const useGetBusinessUnitById = (
  id: string | number,
  options?: Omit<
    UseQueryOptions<ApiResponse<BusinessUnitResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: businessUnitQueryKeys.detail(id),
    queryFn: () => businessUnitService.getBusinessUnitById(id),
    enabled: !!id,
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message ||
          "Failed to load business unit details",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
