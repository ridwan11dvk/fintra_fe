import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { transactionCategoryQueryKeys } from "./transaction-category.query";
import { transactionCategoryService } from "./transaction-category.service";
import type {
  TransactionCategoryRequest,
  TransactionCategoryResponse,
} from "./transaction-category.types";

/**
 * Hook to create a new transaction category
 */
export const useCreateTransactionCategoryMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<TransactionCategoryResponse>,
      Error,
      TransactionCategoryRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) =>
      transactionCategoryService.createTransactionCategory(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [transactionCategoryQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a transaction category
 */
export const useUpdateTransactionCategoryMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<TransactionCategoryResponse>,
      Error,
      { id: number; data: TransactionCategoryRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) =>
      transactionCategoryService.updateTransactionCategory(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    transactionCategoryQueryKeys.all,
    transactionCategoryQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a transaction category
 */
export const useDeleteTransactionCategoryMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) =>
      transactionCategoryService.deleteTransactionCategory(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    transactionCategoryQueryKeys.lists(),
    transactionCategoryQueryKeys.detail(mutation.variables || 0),
  ]);

  return mutation;
};
