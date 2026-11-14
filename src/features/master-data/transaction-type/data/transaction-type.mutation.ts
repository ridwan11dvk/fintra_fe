import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { transactionTypeQueryKeys } from "./transaction-type.query";
import { transactionTypeService } from "./transaction-type.service";
import type {
  TransactionTypeRequest,
  TransactionTypeResponse,
} from "./transaction-type.types";

/**
 * Hook to create a new transaction type
 */
export const useCreateTransactionTypeMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<TransactionTypeResponse>,
      Error,
      TransactionTypeRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => transactionTypeService.createTransactionType(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [transactionTypeQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a transaction type
 */
export const useUpdateTransactionTypeMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<TransactionTypeResponse>,
      Error,
      { id: number; data: TransactionTypeRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) =>
      transactionTypeService.updateTransactionType(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    transactionTypeQueryKeys.all,
    transactionTypeQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a transaction type
 */
export const useDeleteTransactionTypeMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => transactionTypeService.deleteTransactionType(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    transactionTypeQueryKeys.lists(),
    transactionTypeQueryKeys.detail(mutation.variables || 0),
  ]);

  return mutation;
};
