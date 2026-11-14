import type { CostCenterResponse } from "@/features/master-data/cost-center/data/cost-center.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { costCenterService } from "./cost-center.service";

// Query Keys
export const costCenterQueryKeys = {
  all: ["costCenters"],
  lists: () => [...costCenterQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [...costCenterQueryKeys.lists(), params],
  active: () => [...costCenterQueryKeys.all, "active"],
  byCompanyAndBA: (companyCode: string, baCode: string) => [
    ...costCenterQueryKeys.all,
    "company",
    companyCode,
    "ba",
    baCode,
  ],
  byCompanyBAAndType: (
    companyCode: string,
    baCode: string,
    type: "BA" | "Unit",
  ) => [
    ...costCenterQueryKeys.all,
    "company",
    companyCode,
    "ba",
    baCode,
    "type",
    type,
  ],
  details: () => [...costCenterQueryKeys.all, "detail"],
  detail: (id: number) => [...costCenterQueryKeys.details(), id],
};

/**
 * Hook to fetch paginated cost centers
 */
export const useListCostCenters = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<CostCenterResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: costCenterQueryKeys.list(params),
    queryFn: () => costCenterService.listCostCenters(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Cost centers loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load cost centers",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch all active cost centers
 */
export const useGetActiveCostCenters = (
  options?: Omit<
    UseQueryOptions<ApiResponse<CostCenterResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: costCenterQueryKeys.active(),
    queryFn: () => costCenterService.getActiveCostCenters(),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Active cost centers loaded successfully",
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
          "Failed to load active cost centers",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch cost centers by company and business area
 */
export const useGetCostCentersByCompanyAndBA = (
  companyCode: string,
  baCode: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<CostCenterResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: costCenterQueryKeys.byCompanyAndBA(companyCode, baCode),
    queryFn: () =>
      costCenterService.getCostCentersByCompanyAndBA(companyCode, baCode),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Cost centers loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load cost centers",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch cost centers by company, business area, and type
 */
export const useGetCostCentersByCompanyBAAndType = (
  companyCode: string,
  baCode: string,
  type: "BA" | "Unit",
  options?: Omit<
    UseQueryOptions<ApiResponse<CostCenterResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: costCenterQueryKeys.byCompanyBAAndType(companyCode, baCode, type),
    queryFn: () =>
      costCenterService.getCostCentersByCompanyBAAndType(
        companyCode,
        baCode,
        type,
      ),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Cost centers loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load cost centers",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific cost center by ID
 */
export const useGetCostCenterById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<CostCenterResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: costCenterQueryKeys.detail(id),
    queryFn: () => costCenterService.getCostCenterById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Cost center loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load cost center",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
