import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { regencyQueryKeys } from "./regency.query";
import { regencyService } from "./regency.service";
import type { RegencyRequest, RegencyResponse } from "./regency.types";

/**
 * Hook to create a new regency
 */
export const useCreateRegencyMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<RegencyResponse>, Error, RegencyRequest>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => regencyService.createRegency(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [regencyQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a regency
 */
export const useUpdateRegencyMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<RegencyResponse>,
      Error,
      { id: number; data: RegencyRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) => regencyService.updateRegency(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    regencyQueryKeys.all,
    regencyQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a regency
 */
export const useDeleteRegencyMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => regencyService.deleteRegency(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    regencyQueryKeys.lists(),
    regencyQueryKeys.detail(mutation.variables || 0),
  ]);

  return mutation;
};
