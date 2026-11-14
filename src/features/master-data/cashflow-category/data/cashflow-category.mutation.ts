import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { cashflowCategoryQueryKeys } from "./cashflow-category.query";
import { cashflowCategoryService } from "./cashflow-category.service";
import type {
  CashflowCategoryRequest,
  CashflowCategoryResponse,
} from "./cashflow-category.types";

export const useCreateCashflowCategoryMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<CashflowCategoryResponse>,
      Error,
      CashflowCategoryRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => cashflowCategoryService.createCashflowCategory(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [cashflowCategoryQueryKeys.all]);

  return mutation;
};

export const useUpdateCashflowCategoryMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<CashflowCategoryResponse>,
      Error,
      { id: number; data: CashflowCategoryRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) =>
      cashflowCategoryService.updateCashflowCategory(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    cashflowCategoryQueryKeys.all,
    cashflowCategoryQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

export const useActivateCashflowCategoryMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<CashflowCategoryResponse>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => cashflowCategoryService.activateCashflowCategory(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [cashflowCategoryQueryKeys.all]);

  return mutation;
};

export const useDeactivateCashflowCategoryMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<CashflowCategoryResponse>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => cashflowCategoryService.deactivateCashflowCategory(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [cashflowCategoryQueryKeys.all]);

  return mutation;
};
