import type { PartnerTypeResponse } from "@/features/master-data/partner-type/data/partner-type.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { partnerTypeService } from "./partner-type.service";

// Query Keys
export const partnerTypeQueryKeys = {
  all: ["partnerTypes"],
  lists: () => [...partnerTypeQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [
    ...partnerTypeQueryKeys.lists(),
    params,
  ],
  details: () => [...partnerTypeQueryKeys.all, "detail"],
  detail: (id: number) => [...partnerTypeQueryKeys.details(), id],
  subtypes: (parentId: number) => [
    ...partnerTypeQueryKeys.all,
    "subtypes",
    parentId,
  ],
  legalityRoot: (legalityId: number) => [
    ...partnerTypeQueryKeys.all,
    "legality",
    legalityId,
    "root",
  ],
};

/**
 * Hook to fetch paginated partner types
 */
export const useListPartnerTypes = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<PartnerTypeResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: partnerTypeQueryKeys.list(params),
    queryFn: () => partnerTypeService.listPartnerTypes(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Partner types loaded successfully",
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
        axiosError?.response?.data?.message || "Failed to load partner types",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific partner type by ID
 */
export const useGetPartnerTypeById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<PartnerTypeResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: partnerTypeQueryKeys.detail(id),
    queryFn: () => partnerTypeService.getPartnerTypeById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Partner type loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load partner type",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch root partner types by legality
 */
export const useGetRootPartnerTypesByLegality = (
  legalityId: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<PartnerTypeResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: partnerTypeQueryKeys.legalityRoot(legalityId),
    queryFn: () => partnerTypeService.getRootPartnerTypesByLegality(legalityId),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Root partner types loaded successfully",
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
          "Failed to load root partner types",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch sub-types of a partner type
 */
export const useGetPartnerTypeSubtypes = (
  parentId: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<PartnerTypeResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: partnerTypeQueryKeys.subtypes(parentId),
    queryFn: () => partnerTypeService.getPartnerTypeSubtypes(parentId),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Partner type subtypes loaded successfully",
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
          "Failed to load partner type subtypes",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
