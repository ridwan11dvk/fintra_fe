import type { CompanyTaxResponse } from "@/features/master-data/company-tax/data/company-tax.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { companyTaxService } from "./company-tax.service";

export const companyTaxQueryKeys = {
  all: ["company-taxes"],
  lists: () => [...companyTaxQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [...companyTaxQueryKeys.lists(), params],
  details: () => [...companyTaxQueryKeys.all, "detail"],
  detail: (id: number) => [...companyTaxQueryKeys.details(), id],
};

export const useListCompanyTaxes = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<CompanyTaxResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: companyTaxQueryKeys.list(params),
    queryFn: () => companyTaxService.listCompanyTaxes(params),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message ||
          "Failed to load company tax assignments",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

export const useGetCompanyTaxById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<CompanyTaxResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: companyTaxQueryKeys.detail(id),
    queryFn: () => companyTaxService.getCompanyTaxById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message ||
          "Failed to load company tax assignment",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
