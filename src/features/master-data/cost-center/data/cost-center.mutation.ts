import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { costCenterQueryKeys } from "./cost-center.query";
import { costCenterService } from "./cost-center.service";
import type {
  CostCenterRequest,
  CostCenterResponse,
} from "./cost-center.types";

/**
 * Hook to create a new cost center
 */
export const useCreateCostCenterMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<CostCenterResponse>,
      Error,
      CostCenterRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => costCenterService.createCostCenter(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [costCenterQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a cost center
 */
export const useUpdateCostCenterMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<CostCenterResponse>,
      Error,
      { id: number; data: CostCenterRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) => costCenterService.updateCostCenter(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    costCenterQueryKeys.all,
    costCenterQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a cost center
 */
export const useDeleteCostCenterMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => costCenterService.deleteCostCenter(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [costCenterQueryKeys.all]);

  return mutation;
};
