import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { houseBankQueryKeys } from "./house-bank.query";
import { houseBankService } from "./house-bank.service";
import type {
  HouseBankImportResponse,
  HouseBankRequest,
  HouseBankResponse,
} from "./house-bank.types";

/**
 * Hook to create a new house bank
 */
export const useCreateHouseBankMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<HouseBankResponse>, Error, HouseBankRequest>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => houseBankService.createHouseBank(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [houseBankQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a house bank
 */
export const useUpdateHouseBankMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<HouseBankResponse>,
      Error,
      { id: number; data: HouseBankRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) => houseBankService.updateHouseBank(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    houseBankQueryKeys.all,
    houseBankQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a house bank
 */
export const useDeleteHouseBankMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => houseBankService.deleteHouseBank(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    houseBankQueryKeys.lists(),
    houseBankQueryKeys.detail(mutation.variables || 0),
  ]);

  return mutation;
};

/**
 * Hook to import house banks from Excel file
 */
export const useImportHouseBanksMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<HouseBankImportResponse>,
      Error,
      { file: File; dryRun?: boolean }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ file, dryRun }) =>
      houseBankService.importHouseBanks(file, dryRun),
    ...options,
  });

  useHandleMutationResponse(mutation, [houseBankQueryKeys.all]);

  return mutation;
};
