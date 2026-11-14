import type { GeneralLedgerAccountResponse } from "@/features/master-data/general-ledger-account/data/gl-account.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { glAccountService } from "./gl-account.service";

// Query Keys
export const glAccountQueryKeys = {
  all: ["gl-accounts"],
  lists: () => [...glAccountQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [...glAccountQueryKeys.lists(), params],
  details: () => [...glAccountQueryKeys.all, "detail"],
  detail: (id: number) => [...glAccountQueryKeys.details(), id],
  byCompany: (companyCode: string) => [
    ...glAccountQueryKeys.all,
    "company",
    companyCode,
  ],
  byBA: (baCode: string) => [...glAccountQueryKeys.all, "ba", baCode],
};

/**
 * Hook to fetch paginated GL accounts
 */
export const useListGLAccounts = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<GeneralLedgerAccountResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: glAccountQueryKeys.list(params),
    queryFn: () => glAccountService.listGLAccounts(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "GL accounts loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load GL accounts",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific GL account by ID
 */
export const useGetGLAccountById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<GeneralLedgerAccountResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: glAccountQueryKeys.detail(id),
    queryFn: () => glAccountService.getGLAccountById(id),
    ...options,
  });

  return query;
};

/**
 * Hook to fetch GL accounts by company code
 */
export const useGetGLAccountsByCompanyCode = (
  companyCode: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<GeneralLedgerAccountResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: glAccountQueryKeys.byCompany(companyCode),
    queryFn: () => glAccountService.getGLAccountsByCompanyCode(companyCode),
    ...options,
  });

  return query;
};

/**
 * Hook to fetch GL accounts by business area code
 */
export const useGetGLAccountsByBACode = (
  baCode: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<GeneralLedgerAccountResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: glAccountQueryKeys.byBA(baCode),
    queryFn: () => glAccountService.getGLAccountsByBACode(baCode),
    ...options,
  });

  return query;
};
