import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { cashflowGroupQueryKeys } from "./cashflow-group.query";
import { cashflowGroupService } from "./cashflow-group.service";
import type {
  CashflowGroupRequest,
  CashflowGroupResponse,
} from "./cashflow-group.types";

export const useCreateCashflowGroupMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<CashflowGroupResponse>,
      Error,
      CashflowGroupRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => cashflowGroupService.createCashflowGroup(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [cashflowGroupQueryKeys.all]);

  return mutation;
};

export const useUpdateCashflowGroupMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<CashflowGroupResponse>,
      Error,
      { id: number; data: CashflowGroupRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) =>
      cashflowGroupService.updateCashflowGroup(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    cashflowGroupQueryKeys.all,
    cashflowGroupQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

export const useActivateCashflowGroupMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<CashflowGroupResponse>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => cashflowGroupService.activateCashflowGroup(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [cashflowGroupQueryKeys.all]);

  return mutation;
};

export const useDeactivateCashflowGroupMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<CashflowGroupResponse>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => cashflowGroupService.deactivateCashflowGroup(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [cashflowGroupQueryKeys.all]);

  return mutation;
};

export const useDeleteCashflowGroupMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<null>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => cashflowGroupService.deleteCashflowGroup(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [cashflowGroupQueryKeys.all]);

  return mutation;
};
