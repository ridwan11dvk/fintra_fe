import type { CashflowGroupResponse } from "@/features/master-data/cashflow-group/data/cashflow-group.types";
import type {
  ApiResponse,
  PagedApiResponse,
  PaginationParams,
} from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { cashflowGroupService } from "./cashflow-group.service";

export const cashflowGroupQueryKeys = {
  all: ["cashflowGroups"],
  lists: () => [...cashflowGroupQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [
    ...cashflowGroupQueryKeys.lists(),
    params,
  ],
  details: () => [...cashflowGroupQueryKeys.all, "detail"],
  detail: (id: number) => [...cashflowGroupQueryKeys.details(), id],
};

export const useListCashflowGroups = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<CashflowGroupResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: cashflowGroupQueryKeys.list(params),
    queryFn: () => cashflowGroupService.listCashflowGroups(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Cashflow groups loaded successfully",
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
          query.error.message ||
          "Failed to load cashflow groups",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

export const useGetCashflowGroupById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<CashflowGroupResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: cashflowGroupQueryKeys.detail(id),
    queryFn: () => cashflowGroupService.getCashflowGroupById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message ||
          query.error.message ||
          "Failed to load cashflow group",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
