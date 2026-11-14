import type { PartnerDocRefResponse } from "@/features/master-data/partner-doc-ref/data/partner-doc-ref.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { partnerDocRefService } from "./partner-doc-ref.service";

// Query Keys
export const partnerDocRefQueryKeys = {
  all: ["partnerDocRefs"],
  lists: () => [...partnerDocRefQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [
    ...partnerDocRefQueryKeys.lists(),
    params,
  ],
  details: () => [...partnerDocRefQueryKeys.all, "detail"],
  detail: (id: number) => [...partnerDocRefQueryKeys.details(), id],
  byCountry: (countryId: number) => [
    ...partnerDocRefQueryKeys.all,
    "byCountry",
    countryId,
  ],
  byCountryAndCompany: (countryId: number, companyCode: string) => [
    ...partnerDocRefQueryKeys.all,
    "byCountryAndCompany",
    countryId,
    companyCode,
  ],
};

/**
 * Hook to fetch paginated partner document references
 */
export const useListPartnerDocRefs = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<PartnerDocRefResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: partnerDocRefQueryKeys.list(params),
    queryFn: () => partnerDocRefService.listPartnerDocRefs(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Partner document references loaded",
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
          "Failed to load partner document references",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch partner document reference by ID
 */
export const useGetPartnerDocRef = (
  id?: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<PartnerDocRefResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: id ? partnerDocRefQueryKeys.detail(id) : [],
    queryFn: () => {
      if (!id) throw new Error("ID is required");
      return partnerDocRefService.getPartnerDocRefById(id);
    },
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
          "Failed to load partner document reference",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch partner document references by country
 */
export const useGetPartnerDocRefByCountry = (
  countryId?: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<PartnerDocRefResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: countryId ? partnerDocRefQueryKeys.byCountry(countryId) : [],
    queryFn: () => {
      if (!countryId) throw new Error("Country ID is required");
      return partnerDocRefService.getByCountry(countryId);
    },
    enabled: !!countryId,
    ...options,
  });

  return query;
};

/**
 * Hook to fetch partner document references by country and company
 */
export const useGetPartnerDocRefByCountryAndCompany = (
  countryId?: number,
  companyCode?: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<PartnerDocRefResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey:
      countryId && companyCode
        ? partnerDocRefQueryKeys.byCountryAndCompany(countryId, companyCode)
        : [],
    queryFn: () => {
      if (!countryId || !companyCode) {
        throw new Error("Country ID and company code are required");
      }
      return partnerDocRefService.getByCountryAndCompany(
        countryId,
        companyCode,
      );
    },
    enabled: !!countryId && !!companyCode,
    ...options,
  });

  return query;
};

/**
 * Hook to fetch filtered partner document references (public)
 */
export const useGetFilteredPartnerDocRefs = (
  filters?: {
    companyCode?: string;
    countryId?: number;
    partnerCategoryId?: number;
    partnerTypeId?: number;
    partnerSubTypeId?: number;
  },
  options?: Omit<
    UseQueryOptions<ApiResponse<PartnerDocRefResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: [...partnerDocRefQueryKeys.all, "filtered", filters],
    queryFn: () => partnerDocRefService.getFilteredPartnerDocRefs(filters),
    ...options,
  });

  return query;
};
