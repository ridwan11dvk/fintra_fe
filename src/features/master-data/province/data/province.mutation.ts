import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { provinceQueryKeys } from "./province.query";
import { provinceService } from "./province.service";
import type { ProvinceRequest, ProvinceResponse } from "./province.types";

/**
 * Hook to create a new province
 */
export const useCreateProvinceMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<ProvinceResponse>, Error, ProvinceRequest>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => provinceService.createProvince(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [provinceQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a province
 */
export const useUpdateProvinceMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<ProvinceResponse>,
      Error,
      { id: number; data: ProvinceRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) => provinceService.updateProvince(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    provinceQueryKeys.all,
    provinceQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a province
 */
export const useDeleteProvinceMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => provinceService.deleteProvince(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [provinceQueryKeys.all]);

  return mutation;
};
