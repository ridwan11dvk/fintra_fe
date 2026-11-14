import type { LookupValueResponse } from "@/features/master-data/lookup-value/data/lookup-value.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { lookupValueService } from "./lookup-value.service";

export const lookupValueQueryKeys = {
  all: ["categories"],
  lists: () => [...lookupValueQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [...lookupValueQueryKeys.lists(), params],
  details: () => [...lookupValueQueryKeys.all, "detail"],
  detail: (id: number) => [...lookupValueQueryKeys.details(), id],
};

export const useListCategories = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<LookupValueResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: lookupValueQueryKeys.list(params),
    queryFn: () => lookupValueService.listCategories(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Categories loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load categories",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

export const useGetLookupValueById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<LookupValueResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: lookupValueQueryKeys.detail(id),
    queryFn: () => lookupValueService.getLookupValueById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Lookup value loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load category",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
