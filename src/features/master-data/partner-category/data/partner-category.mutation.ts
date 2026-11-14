import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { partnerCategoryQueryKeys } from "./partner-category.query";
import { partnerCategoryService } from "./partner-category.service";
import type {
  PartnerCategoryRequest,
  PartnerCategoryResponse,
} from "./partner-category.types";

/**
 * Hook to create a new partner category
 */
export const useCreatePartnerCategoryMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerCategoryResponse>,
      Error,
      PartnerCategoryRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => partnerCategoryService.createPartnerCategory(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [partnerCategoryQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a partner category
 */
export const useUpdatePartnerCategoryMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<PartnerCategoryResponse>,
      Error,
      { id: number; data: PartnerCategoryRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) =>
      partnerCategoryService.updatePartnerCategory(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerCategoryQueryKeys.all,
    partnerCategoryQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a partner category
 */
export const useDeletePartnerCategoryMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => partnerCategoryService.deletePartnerCategory(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    partnerCategoryQueryKeys.lists(),
    partnerCategoryQueryKeys.detail(mutation.variables || 0),
  ]);

  return mutation;
};
