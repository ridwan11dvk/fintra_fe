import { getErrorMessage, toast } from "@railfinance/core/lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roleQueryKeys } from "./role.query";
import { roleService } from "./role.service";
import type { RolePermissionRequest, RoleRequest } from "./role.types";

/**
 * Mutation hook for creating a role
 */
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (role: RoleRequest) => roleService.createRole(role),
    onSuccess: (data) => {
      toast.success(data.message || "Role created successfully");
      queryClient.invalidateQueries({
        queryKey: roleQueryKeys.lists(),
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || "Failed to create role");
    },
  });
};

/**
 * Mutation hook for updating a role
 */
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: RoleRequest }) =>
      roleService.updateRole(id, role),
    onSuccess: (data) => {
      toast.success(data.message || "Role updated successfully");
      queryClient.invalidateQueries({
        queryKey: roleQueryKeys.all,
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || "Failed to update role");
    },
  });
};

/**
 * Mutation hook for deleting a role
 */
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => roleService.deleteRole(id),
    onSuccess: (data) => {
      toast.success(data.message || "Role deleted successfully");
      queryClient.invalidateQueries({
        queryKey: roleQueryKeys.lists(),
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || "Failed to delete role");
    },
  });
};

/**
 * Mutation hook for assigning permissions to a role
 */
export const useAssignPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      permissions,
    }: {
      id: number;
      permissions: RolePermissionRequest;
    }) => roleService.assignPermissions(id, permissions),
    onSuccess: (data, variables) => {
      toast.success(data.message || "Permissions assigned successfully");
      queryClient.invalidateQueries({
        queryKey: roleQueryKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: roleQueryKeys.detail(variables.id),
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || "Failed to assign permissions");
    },
  });
};

/**
 * Mutation hook for removing permissions from a role
 */
export const useRemovePermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      permissions,
    }: {
      id: number;
      permissions: RolePermissionRequest;
    }) => roleService.removePermissions(id, permissions),
    onSuccess: (data, variables) => {
      toast.success(data.message || "Permissions removed successfully");
      queryClient.invalidateQueries({
        queryKey: roleQueryKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: roleQueryKeys.detail(variables.id),
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || "Failed to remove permissions");
    },
  });
};
