import type { ApiResponse } from "@railfinance/core";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { businessUnitService } from "./business-unit.service";
import type {
  BusinessUnitRequest,
  BusinessUnitResponse,
} from "./business-unit.types";

/**
 * Hook to create a new business unit
 */
export const useCreateBusinessUnitMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<BusinessUnitResponse>,
      Error,
      BusinessUnitRequest
    >,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: (data) => businessUnitService.createBusinessUnit(data),
    ...options,
  });
};

/**
 * Hook to update an existing business unit
 */
export const useUpdateBusinessUnitMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<BusinessUnitResponse>,
      Error,
      { id: string | number; data: BusinessUnitRequest }
    >,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: ({ id, data }) =>
      businessUnitService.updateBusinessUnit(id, data),
    ...options,
  });
};

/**
 * Hook to delete a business unit
 */
export const useDeleteBusinessUnitMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, string | number>,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: (id) => businessUnitService.deleteBusinessUnit(id),
    ...options,
  });
};
