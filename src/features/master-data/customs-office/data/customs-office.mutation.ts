import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { customsOfficeQueryKeys } from "./customs-office.query";
import { customsOfficeService } from "./customs-office.service";
import type {
  CustomsOfficeRequest,
  CustomsOfficeResponse,
} from "./customs-office.types";

/**
 * Hook to create a new customs office
 */
export const useCreateCustomsOfficeMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<CustomsOfficeResponse>,
      Error,
      CustomsOfficeRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => customsOfficeService.createCustomsOffice(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [customsOfficeQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a customs office
 */
export const useUpdateCustomsOfficeMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<CustomsOfficeResponse>,
      Error,
      { id: number; data: CustomsOfficeRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) =>
      customsOfficeService.updateCustomsOffice(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    customsOfficeQueryKeys.all,
    customsOfficeQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a customs office
 */
export const useDeleteCustomsOfficeMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => customsOfficeService.deleteCustomsOffice(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    customsOfficeQueryKeys.lists(),
    customsOfficeQueryKeys.detail(mutation.variables || 0),
  ]);

  return mutation;
};
