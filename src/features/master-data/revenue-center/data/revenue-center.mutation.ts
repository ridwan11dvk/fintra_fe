import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { revenueCenterQueryKeys } from "./revenue-center.query";
import { revenueCenterService } from "./revenue-center.service";
import type {
  RevenueCenterRequest,
  RevenueCenterResponse,
} from "./revenue-center.types";

export const useCreateRevenueCenterMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<RevenueCenterResponse>,
      Error,
      RevenueCenterRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => revenueCenterService.createRevenueCenter(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [revenueCenterQueryKeys.all]);

  return mutation;
};

export const useUpdateRevenueCenterMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<RevenueCenterResponse>,
      Error,
      { id: number; data: RevenueCenterRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) =>
      revenueCenterService.updateRevenueCenter(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    revenueCenterQueryKeys.all,
    revenueCenterQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

export const useDeleteRevenueCenterMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => revenueCenterService.deleteRevenueCenter(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [revenueCenterQueryKeys.all]);

  return mutation;
};

export const useActivateRevenueCenterMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<RevenueCenterResponse>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => revenueCenterService.activateRevenueCenter(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [revenueCenterQueryKeys.all]);

  return mutation;
};

export const useDeactivateRevenueCenterMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<RevenueCenterResponse>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => revenueCenterService.deactivateRevenueCenter(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [revenueCenterQueryKeys.all]);

  return mutation;
};
