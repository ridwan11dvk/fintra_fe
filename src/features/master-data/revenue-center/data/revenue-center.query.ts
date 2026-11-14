import type { RevenueCenterResponse } from "@/features/master-data/revenue-center/data/revenue-center.types";
import type {
  ApiResponse,
  PagedApiResponse,
  PaginationParams,
} from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { revenueCenterService } from "./revenue-center.service";

export const revenueCenterQueryKeys = {
  all: ["revenueCenters"],
  lists: () => [...revenueCenterQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [
    ...revenueCenterQueryKeys.lists(),
    params,
  ],
  active: () => [...revenueCenterQueryKeys.all, "active"],
  byCompanyAndBA: (companyCode: string, baCode: string) => [
    ...revenueCenterQueryKeys.all,
    "company",
    companyCode,
    "ba",
    baCode,
  ],
  details: () => [...revenueCenterQueryKeys.all, "detail"],
  detail: (id: number) => [...revenueCenterQueryKeys.details(), id],
};

export const useListRevenueCenters = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<RevenueCenterResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: revenueCenterQueryKeys.list(params),
    queryFn: () => revenueCenterService.listRevenueCenters(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Revenue centers loaded successfully",
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
        axiosError?.response?.data?.message || "Failed to load revenue centers",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

export const useGetActiveRevenueCenters = (
  options?: Omit<
    UseQueryOptions<ApiResponse<RevenueCenterResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: revenueCenterQueryKeys.active(),
    queryFn: () => revenueCenterService.getActiveRevenueCenters(),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message ||
          "Failed to load active revenue centers",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

export const useGetRevenueCentersByCompanyAndBA = (
  companyCode: string,
  baCode: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<RevenueCenterResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: revenueCenterQueryKeys.byCompanyAndBA(companyCode, baCode),
    queryFn: () =>
      revenueCenterService.getRevenueCentersByCompanyAndBA(
        companyCode,
        baCode,
      ),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load revenue centers",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

export const useGetRevenueCenterById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<RevenueCenterResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: revenueCenterQueryKeys.detail(id),
    queryFn: () => revenueCenterService.getRevenueCenterById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load revenue center",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
