import type { ApiResponse } from "@railfinance/core/types";
import type { RejectCategoryResponse } from "@railfinance/core/masterdata";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { rejectCategoryQueryKeys } from "./reject-category.query";
import { rejectCategoryService } from "./reject-category.service";
import type { RejectCategoryRequest } from "./reject-category.types";

export const useCreateRejectCategoryMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<RejectCategoryResponse>,
      Error,
      RejectCategoryRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => rejectCategoryService.createRejectCategory(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [rejectCategoryQueryKeys.all]);

  return mutation;
};

export const useUpdateRejectCategoryMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<RejectCategoryResponse>,
      Error,
      { id: number; data: RejectCategoryRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) =>
      rejectCategoryService.updateRejectCategory(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    rejectCategoryQueryKeys.all,
    rejectCategoryQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

export const useDeleteRejectCategoryMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => rejectCategoryService.deleteRejectCategory(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [rejectCategoryQueryKeys.all]);

  return mutation;
};
