import type { BankResponse } from "@/features/master-data/bank/data/bank.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { bankService } from "./bank.service";

// Query Keys
export const bankQueryKeys = {
  all: ["banks"],
  lists: () => [...bankQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [...bankQueryKeys.lists(), params],
  details: () => [...bankQueryKeys.all, "detail"],
  detail: (id: number) => [...bankQueryKeys.details(), id],
  export: () => [...bankQueryKeys.all, "export"],
  template: () => [...bankQueryKeys.all, "template"],
};

/**
 * Hook to fetch paginated banks
 */
export const useListBanks = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<BankResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: bankQueryKeys.list(params),
    queryFn: () => bankService.listBanks(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Banks loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load banks",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific bank by ID
 */
export const useGetBankById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<BankResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: bankQueryKeys.detail(id),
    queryFn: () => bankService.getBankById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Bank loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(axiosError?.response?.data?.message || "Failed to load bank");
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to export banks to Excel
 */
export const useExportBanks = (
  search?: string,
  options?: Omit<UseQueryOptions<Blob, Error>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: bankQueryKeys.export(),
    queryFn: () => bankService.exportBanks(search),
    ...options,
  });
};

/**
 * Hook to download bank import template
 */
export const useDownloadImportTemplate = (
  options?: Omit<UseQueryOptions<Blob, Error>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: bankQueryKeys.template(),
    queryFn: () => bankService.downloadImportTemplate(),
    ...options,
  });
};
