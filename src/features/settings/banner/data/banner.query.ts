import type { BannerResponse } from "@/features/settings/banner/data/banner.types";
import type { ApiResponse, PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { toast } from "@railfinance/core/lib";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { bannerService } from "./banner.service";

// Query Keys
export const bannerQueryKeys = {
  all: ["banners"],
  lists: () => [...bannerQueryKeys.all, "list"],
  list: (params?: PaginationParams & { target?: string }) => [
    ...bannerQueryKeys.lists(),
    params,
  ],
  details: () => [...bannerQueryKeys.all, "detail"],
  detail: (id: number) => [...bannerQueryKeys.details(), id],
};

/**
 * Hook to fetch paginated banners
 */
export const useListBanners = (
  params?: PaginationParams & { target?: string },
  options?: Omit<
    UseQueryOptions<PagedApiResponse<BannerResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: bannerQueryKeys.list(params),
    queryFn: () => bannerService.listBanners(params),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load banners",
      );
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to fetch a specific banner by ID
 */
export const useGetBannerById = (
  id: number,
  options?: Omit<
    UseQueryOptions<ApiResponse<BannerResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  const query = useQuery({
    queryKey: bannerQueryKeys.detail(id),
    queryFn: () => bannerService.getBannerById(id),
    ...options,
  });

  useEffect(() => {
    if (query.isError) {
      const axiosError = query.error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError?.response?.data?.message || "Failed to load banner",
      );
    }
  }, [query.isError, query.error]);

  return query;
};
