import type { PortResponse } from "@/features/master-data/port/data/port.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { portService } from "./port.service";

// Query Keys
export const portQueryKeys = {
  all: ["ports"],
  lists: () => [...portQueryKeys.all, "list"],
  list: (params?: PaginationParams) => [...portQueryKeys.lists(), params],
  listByCustomsOffice: (customsOfficeId: number, params?: PaginationParams) => [
    ...portQueryKeys.all,
    "listByCustomsOffice",
    customsOfficeId,
    params,
  ],
  details: () => [...portQueryKeys.all, "detail"],
  detail: (id: number) => [...portQueryKeys.details(), id],
};

/**
 * Hook to fetch ports by customs office without pagination (Alt)
 * Digunakan untuk dropdown yang dependen pada pilihan KPPBC.
 */
export const useListPortsAlt = (
  customsOfficeId?: number,
  params?: { search?: string },
  options?: Omit<
    UseQueryOptions<ApiResponse<PortResponse[]>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    // Menambahkan 'alt' agar query key unik
    queryKey: [...portQueryKeys.all, "alt", customsOfficeId, params],
    queryFn: () => portService.listPortsAlt(customsOfficeId!, params),
    // Query hanya akan jalan jika customsOfficeId tersedia (truthy)
    enabled: !!customsOfficeId,
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load ports",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch paginated ports
 */
export const useListPorts = (
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<PortResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: portQueryKeys.list(params),
    queryFn: () => portService.listPorts(params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Ports loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load ports",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch paginated ports by customs office
 */
export const useListPortsByCustomsOffice = (
  customsOfficeId: number,
  params?: PaginationParams,
  options?: Omit<
    UseQueryOptions<PagedApiResponse<PortResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: portQueryKeys.listByCustomsOffice(customsOfficeId, params),
    queryFn: () =>
      portService.listPortsByCustomsOffice(customsOfficeId, params),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Ports loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load ports",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific port by ID
 */
export const useGetPortById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<PortResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: portQueryKeys.detail(id),
    queryFn: () => portService.getPortById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (query.data.status === "SUCCESS") {
        toast.success(query.data.message || "Port loaded successfully");
      }
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(axiosError?.response?.data?.message || "Failed to load port");
    }
  }, [query.isError, query.error]);

  return query;
};
