import type { ApiResponse } from "@railfinance/core/types";
import { useHandleMutationResponse } from "@railfinance/core/lib";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { userQueryKeys } from "./user.query";
import { userService } from "./user.service";
import type {
  AdminChangePasswordRequest,
  BulkRKIPDateLimitRequest,
  ExternalUserRequest,
  ExternalUserResponse,
  InternalUserDirectCreateRequest,
  InternalUserDirectUpdateRequest,
  InternalUserEsaCreateRequest,
  InternalUserEsaUpdateRequest,
  InternalUserResponse,
  RkipDateLimitRequest,
} from "./user.types";

// Internal User Mutations - ESA-based

/**
 * Hook to create an internal user from ESA (NIPP lookup)
 */
export const useCreateInternalUserFromEsaMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<InternalUserResponse>,
      Error,
      InternalUserEsaCreateRequest
    >,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: (data) => userService.createInternalUserFromEsa(data),
    ...options,
  });
};

/**
 * Hook to create an internal user with direct input (no ESA validation)
 */
export const useCreateInternalUserDirectMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<InternalUserResponse>,
      Error,
      InternalUserDirectCreateRequest
    >,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: (data) => userService.createInternalUserDirect(data),
    ...options,
  });
};

/**
 * Hook to update an internal user's roles from ESA
 */
export const useUpdateInternalUserRolesFromEsaMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<InternalUserResponse>,
      Error,
      { id: number; data: InternalUserEsaUpdateRequest }
    >,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: ({ id, data }) =>
      userService.updateInternalUserRolesFromEsa(id, data),
    ...options,
  });
};

/**
 * Hook to update an internal user with direct input (PATCH semantics)
 */
export const usePatchInternalUserMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<InternalUserResponse>,
      Error,
      { id: number; data: InternalUserDirectUpdateRequest }
    >,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: ({ id, data }) => userService.patchInternalUser(id, data),
    ...options,
  });
};

/**
 * Hook to delete an internal user
 */
export const useDeleteInternalUserMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: (id) => userService.deleteInternalUser(id),
    ...options,
  });
};

/**
 * Hook to update internal user's RKIP date limit
 */
export const useUpdateInternalUserRkipDateLimitMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<InternalUserResponse>,
      Error,
      { id: number; dateLimit: string }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, dateLimit }) =>
      userService.updateInternalUserRkipDateLimit(id, dateLimit),
    ...options,
  });

  useHandleMutationResponse(mutation, [userQueryKeys.internal()]);
  return mutation;
};

/**
 * Hook to bulk update RKIP date limit by role IDs
 */
export const useBulkUpdateInternalUserRkipDateLimitMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<number>, Error, BulkRKIPDateLimitRequest>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => userService.updateInternalUserRkipDateLimitBulk(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [userQueryKeys.internal()]);
  return mutation;
};

/**
 * Hook to update RKIP date limit for all internal users
 */
export const useUpdateAllInternalUsersRkipDateLimitMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<number>,
      Error,
      RkipDateLimitRequest & { moduleId?: number }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ moduleId, ...data }) =>
      userService.updateInternalUserRkipDateLimitAll(data, moduleId),
    ...options,
  });

  useHandleMutationResponse(mutation, [userQueryKeys.internal()]);
  return mutation;
};

/**
 * Hook to delete a role assignment from an internal user
 */
export const useDeleteInternalUserRoleMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<string>,
      Error,
      { id: number; roleId: number }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, roleId }) =>
      userService.deleteInternalUserRole(id, roleId),
    ...options,
  });

  useHandleMutationResponse(mutation, [userQueryKeys.internal()]);
  return mutation;
};

/**
 * Hook to delete internal user's RKIP date limit
 */
export const useDeleteInternalUserRkipDateLimitMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<InternalUserResponse>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => userService.deleteInternalUserRkipDateLimit(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [userQueryKeys.internal()]);
  return mutation;
};

/**
 * Hook to get internal user by NIPP from ESA
 */
export const useGetInternalUserByNippMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<InternalUserResponse>, Error, string>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (nipp) => userService.getInternalUserByNipp(nipp),
    ...options,
  });

  useHandleMutationResponse(mutation, [userQueryKeys.internal()]);
  return mutation;
};

// External User Mutations

/**
 * Hook to create a new external user
 */
export const useCreateExternalUserMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<ExternalUserResponse>,
      Error,
      ExternalUserRequest
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (data) => userService.createExternalUser(data),
    ...options,
  });

  useHandleMutationResponse(mutation, [userQueryKeys.external()]);
  return mutation;
};

/**
 * Hook to update an external user
 */
export const useUpdateExternalUserMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<ExternalUserResponse>,
      Error,
      { id: number; data: ExternalUserRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) => userService.updateExternalUser(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [userQueryKeys.external()]);
  return mutation;
};

/**
 * Hook to delete an external user
 */
export const useDeleteExternalUserMutation = (
  options?: Omit<
    UseMutationOptions<ApiResponse<string>, Error, number>,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: (id) => userService.deleteExternalUser(id),
    ...options,
  });

  useHandleMutationResponse(mutation, [userQueryKeys.external()]);
  return mutation;
};

/**
 * Hook to change an internal user's password (admin operation)
 */
export const useChangeInternalUserPasswordMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<null>,
      Error,
      { id: number; data: AdminChangePasswordRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) =>
      userService.changeInternalUserPassword(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [userQueryKeys.internal()]);
  return mutation;
};

/**
 * Hook to change an external user's password (admin operation)
 */
export const useChangeExternalUserPasswordMutation = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<null>,
      Error,
      { id: number; data: AdminChangePasswordRequest }
    >,
    "mutationFn"
  >,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, data }) =>
      userService.changeExternalUserPassword(id, data),
    ...options,
  });

  useHandleMutationResponse(mutation, [userQueryKeys.external()]);
  return mutation;
};
