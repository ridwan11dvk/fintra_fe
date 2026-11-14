import type {
  ExternalUserResponse,
  InternalUserResponse,
} from "@/features/settings";
import { toast } from "@railfinance/core/lib";
import type {
  ApiResponse,
  PagedApiResponse,
  PaginationParams,
} from "@railfinance/core/types";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { userService } from "./user.service";

// Query Keys
export const userQueryKeys = {
  all: ["users"],
  internal: () => [...userQueryKeys.all, "internal"],
  internalDetail: (id: number) => [...userQueryKeys.internal(), id],
  internalByNipp: (nipp: string) => [...userQueryKeys.internal(), "esa", nipp],
  internalList: (params?: PaginationParams) => [
    ...userQueryKeys.internal(),
    "list",
    params,
  ],
  external: () => [...userQueryKeys.all, "external"],
  externalDetail: (id: number) => [...userQueryKeys.external(), id],
  externalList: (params?: PaginationParams) => [
    ...userQueryKeys.external(),
    "list",
    params,
  ],
};

// Internal User Queries

/**
 * Hook to fetch a specific internal user by ID
 */
export const useGetInternalUser = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<InternalUserResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: userQueryKeys.internalDetail(id),
    queryFn: () => userService.getInternalUser(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Internal user loaded successfully",
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
        axiosError?.response?.data?.message || "Failed to load internal user",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch internal user by NIPP from ESA
 */
export const useGetInternalUserByNipp = (
  nipp: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<InternalUserResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: userQueryKeys.internalByNipp(nipp),
    queryFn: () => userService.getInternalUserByNipp(nipp),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Internal user loaded successfully",
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
        axiosError?.response?.data?.message || "Failed to load internal user",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch paginated internal users
 */
export const useListInternalUsers = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<InternalUserResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: userQueryKeys.internalList(params),
    queryFn: () => userService.listInternalUsers(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "Internal users loaded successfully",
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
        axiosError?.response?.data?.message || "Failed to load internal users",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

// External User Queries

/**
 * Hook to fetch a specific external user by ID
 */
export const useGetExternalUser = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<ExternalUserResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: userQueryKeys.externalDetail(id),
    queryFn: () => userService.getExternalUser(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "External user loaded successfully",
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
        axiosError?.response?.data?.message || "Failed to load external user",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch paginated external users
 */
export const useListExternalUsers = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<ExternalUserResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: userQueryKeys.externalList(params),
    queryFn: () => userService.listExternalUsers(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(
          query.data.message || "External users loaded successfully",
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
        axiosError?.response?.data?.message || "Failed to load external users",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
