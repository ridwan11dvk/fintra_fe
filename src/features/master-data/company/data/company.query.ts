import type { CompanyResponse } from "@/features/master-data/company/data/company.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { companyService } from "./company.service";

// Query Keys
export const companyQueryKeys = {
  all: ["companies"],
  lists: () => [...companyQueryKeys.all, "list"],
  list: (
    params?: PaginationParams & { keyword?: string; isActive?: boolean },
  ) => [...companyQueryKeys.lists(), params],
  details: () => [...companyQueryKeys.all, "detail"],
  detail: (id: number) => [...companyQueryKeys.details(), id],
};

/**
 * Hook to fetch paginated companies
 */
export const useListCompanies = (
  params?: PaginationParams & { keyword?: string; isActive?: boolean },
  options?: Omit<
    UseQueryOptions<PagedApiResponse<CompanyResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: companyQueryKeys.list(params),
    queryFn: () => companyService.listCompanies(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        // Only show success toast if not silent
        if (!options?.gcTime) {
          // Optional: only show on manual refetch
        }
      }
    }
  }, [query.isSuccess, query.data, options]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load companies",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific company by ID
 */
export const useGetCompanyById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<CompanyResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: companyQueryKeys.detail(id),
    queryFn: () => companyService.getCompanyById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load company",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch presigned URL for logo
 */
export const useGetLogoPresignedUrl = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<string>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: [companyQueryKeys.detail(id), "logo-url"],
    queryFn: () => companyService.getLogoPresignedUrl(id),
    ...options,
  });

  return query;
};

/**
 * Hook to fetch presigned URL for header document
 */
export const useGetHeaderPresignedUrl = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<string>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: [companyQueryKeys.detail(id), "header-url"],
    queryFn: () => companyService.getHeaderPresignedUrl(id),
    ...options,
  });

  return query;
};

/**
 * Hook to fetch presigned URL for footer document
 */
export const useGetFooterPresignedUrl = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<string>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: [companyQueryKeys.detail(id), "footer-url"],
    queryFn: () => companyService.getFooterPresignedUrl(id),
    ...options,
  });

  return query;
};

/**
 * Hook to fetch presigned URL for company file
 */
export const useGetCompanyFilePresignedUrl = (
  companyId: number,
  fileId: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<string>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: [
      companyQueryKeys.detail(companyId),
      "file",
      fileId,
      "preview-url",
    ],
    queryFn: () => companyService.getCompanyFilePresignedUrl(companyId, fileId),
    ...options,
  });

  return query;
};
