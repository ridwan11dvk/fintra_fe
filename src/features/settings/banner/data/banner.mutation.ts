import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { bannerQueryKeys } from "./banner.query";
import { bannerService } from "./banner.service";
import type { BannerRequest, BannerResponse } from "./banner.types";

/**
 * Hook to create a new banner
 */
export const useCreateBannerMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<BannerResponse>,
      Error,
      { data: BannerRequest; image?: File | null }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ data, image }) => bannerService.createBanner(data, image),
    ...options,
  });

  useHandleMutationResponse(mutation, [bannerQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a banner
 */
export const useUpdateBannerMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<BannerResponse>,
      Error,
      {
        id: number;
        data: BannerRequest;
        image?: File | null;
        removeImage?: boolean;
      }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data, image, removeImage }) =>
      bannerService.updateBanner(id, data, image, removeImage),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    bannerQueryKeys.all,
    bannerQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a banner
 */
export const useDeleteBannerMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => bannerService.deleteBanner(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    bannerQueryKeys.lists(),
    bannerQueryKeys.detail(mutation.variables || 0),
  ]);

  return mutation;
};
