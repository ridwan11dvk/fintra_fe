import type { WorkCatalogResponse } from "@/features/master-data/work-catalog/data/work-catalog.types";
import type {
  ApiResponse,
  PagedApiResponse,
  PaginationParams,
} from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { workCatalogService } from "./work-catalog.service";

export const workCatalogQueryKeys = {
  all: ["workCatalogs"],
  lists: () => [...workCatalogQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [
    ...workCatalogQueryKeys.lists(),
    params,
  ],
  active: () => [...workCatalogQueryKeys.all, "active"],
  byCompanyAndBA: (companyCode: string, baCode: string) => [
    ...workCatalogQueryKeys.all,
    "company",
    companyCode,
    "ba",
    baCode,
  ],
  details: () => [...workCatalogQueryKeys.all, "detail"],
  detail: (id: number) => [...workCatalogQueryKeys.details(), id],
};

export const useListWorkCatalogs = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<WorkCatalogResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: workCatalogQueryKeys.list(params),
    queryFn: () => workCatalogService.listWorkCatalogs(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Work catalogs loaded successfully",
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
        axiosError?.response?.data?.message || "Failed to load work catalogs",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

export const useGetActiveWorkCatalogs = (
  options?: Omit<
    UseQueryOptions<ApiResponse<WorkCatalogResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: workCatalogQueryKeys.active(),
    queryFn: () => workCatalogService.getActiveWorkCatalogs(),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message ||
          "Failed to load active work catalogs",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

export const useGetWorkCatalogsByCompanyAndBA = (
  companyCode: string,
  baCode: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<WorkCatalogResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: workCatalogQueryKeys.byCompanyAndBA(companyCode, baCode),
    queryFn: () =>
      workCatalogService.getWorkCatalogsByCompanyAndBA(
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
        axiosError?.response?.data?.message || "Failed to load work catalogs",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

export const useGetWorkCatalogById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<WorkCatalogResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: workCatalogQueryKeys.detail(id),
    queryFn: () => workCatalogService.getWorkCatalogById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load work catalog",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
