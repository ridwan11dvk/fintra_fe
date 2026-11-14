import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { districtQueryKeys } from "./district.query";
import { districtService } from "./district.service";
import type { DistrictRequest, DistrictResponse } from "./district.types";

/**
 * Hook to create a new district
 */
export const useCreateDistrictMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<DistrictResponse>, Error, DistrictRequest>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => districtService.createDistrict(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [districtQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a district
 */
export const useUpdateDistrictMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<DistrictResponse>,
      Error,
      { id: number; data: DistrictRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) => districtService.updateDistrict(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    districtQueryKeys.all,
    districtQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a district
 */
export const useDeleteDistrictMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => districtService.deleteDistrict(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [districtQueryKeys.all]);

  return mutation;
};
