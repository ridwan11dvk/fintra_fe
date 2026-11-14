import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { bankQueryKeys } from "./bank.query";
import { bankService } from "./bank.service";
import type {
  BankImportResponse,
  BankRequest,
  BankResponse,
} from "./bank.types";

/**
 * Hook to create a new bank
 */
export const useCreateBankMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<BankResponse>, Error, BankRequest>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => bankService.createBank(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [bankQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a bank
 */
export const useUpdateBankMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<BankResponse>,
      Error,
      { id: number; data: BankRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) => bankService.updateBank(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    bankQueryKeys.all,
    bankQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a bank
 */
export const useDeleteBankMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => bankService.deleteBank(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    bankQueryKeys.lists(),
    bankQueryKeys.detail(mutation.variables || 0),
  ]);

  return mutation;
};

/**
 * Hook to import banks from Excel file
 */
export const useImportBanksMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<BankImportResponse>,
      Error,
      { file: File; dryRun?: boolean }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ file, dryRun }) => bankService.importBanks(file, dryRun),
    ...options,
  });

  useHandleMutationResponse(mutation, [bankQueryKeys.all]);

  return mutation;
};
