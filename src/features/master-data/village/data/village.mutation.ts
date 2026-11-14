import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { villageQueryKeys } from "./village.query";
import { villageService } from "./village.service";
import type { VillageRequest, VillageResponse } from "./village.types";

/**
 * Hook to create a new village
 */
export const useCreateVillageMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<VillageResponse>, Error, VillageRequest>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => villageService.createVillage(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [villageQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a village
 */
export const useUpdateVillageMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<VillageResponse>,
      Error,
      { id: number; data: VillageRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) => villageService.updateVillage(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    villageQueryKeys.all,
    villageQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a village
 */
export const useDeleteVillageMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => villageService.deleteVillage(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [villageQueryKeys.all]);

  return mutation;
};
