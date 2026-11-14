import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { lookupValueQueryKeys } from "./lookup-value.query";
import { lookupValueService } from "./lookup-value.service";
import type { CategoryRequest, LookupValueResponse } from "./lookup-value.types";

export const useCreateCategoryMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<LookupValueResponse>, Error, CategoryRequest>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => lookupValueService.createCategory(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [lookupValueQueryKeys.all]);

  return mutation;
};

export const useUpdateCategoryMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<LookupValueResponse>,
      Error,
      { id: number; data: CategoryRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) => lookupValueService.updateCategory(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    lookupValueQueryKeys.all,
    lookupValueQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

export const useDeleteCategoryMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => lookupValueService.deleteCategory(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [lookupValueQueryKeys.all]);

  return mutation;
};
