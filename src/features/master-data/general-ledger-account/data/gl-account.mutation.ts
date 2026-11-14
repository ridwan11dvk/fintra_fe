import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { glAccountQueryKeys } from "./gl-account.query";
import { glAccountService } from "./gl-account.service";
import type {
  GLAccountRequest,
  GeneralLedgerAccountResponse,
} from "./gl-account.types";

/**
 * Hook to create a new GL account
 */
export const useCreateGLAccountMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<GeneralLedgerAccountResponse>,
      Error,
      GLAccountRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => glAccountService.createGLAccount(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [glAccountQueryKeys.all]);

  return mutation;
};

/**
 * Hook to update a GL account
 */
export const useUpdateGLAccountMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<GeneralLedgerAccountResponse>,
      Error,
      { id: number; data: GLAccountRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) => glAccountService.updateGLAccount(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    glAccountQueryKeys.all,
    glAccountQueryKeys.detail(mutation.variables?.id || 0),
  ]);

  return mutation;
};

/**
 * Hook to delete a GL account
 */
export const useDeleteGLAccountMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => glAccountService.deleteGLAccount(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [
    glAccountQueryKeys.lists(),
    glAccountQueryKeys.detail(mutation.variables || 0),
  ]);

  return mutation;
};
