import { getErrorMessage, toast } from "@railfinance/core/lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rolePositionQueryKeys } from "./role-position.query";
import { rolePositionService } from "./role-position.service";
import type {
  RolePositionByRoleRequest,
  RolePositionRequest,
} from "./role-position.types";

/**
 * Mutation hook for assigning roles to a position
 */
export const useCreatePositionRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RolePositionRequest) =>
      rolePositionService.createPositionRole(data),
    onSuccess: (data) => {
      toast.success(data.message || "Roles assigned successfully");
      queryClient.invalidateQueries({
        queryKey: rolePositionQueryKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: rolePositionQueryKeys.lists(),
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || "Failed to assign roles");
    },
  });
};

/**
 * Mutation hook for updating roles for a position
 */
export const useUpdatePositionRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobPositionId,
      data,
    }: {
      jobPositionId: number;
      data: RolePositionRequest;
    }) => rolePositionService.updatePositionRole(jobPositionId, data),
    onSuccess: (data) => {
      toast.success(data.message || "Roles updated successfully");
      queryClient.invalidateQueries({
        queryKey: rolePositionQueryKeys.all,
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || "Failed to update roles");
    },
  });
};

/**
 * Mutation hook for deleting a position-role assignment
 */
export const useDeleteRolePosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => rolePositionService.deleteRolePosition(id),
    onSuccess: (data) => {
      toast.success(data.message || "Position role deleted successfully");
      queryClient.invalidateQueries({
        queryKey: rolePositionQueryKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: rolePositionQueryKeys.lists(),
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || "Failed to delete position role");
    },
  });
};

/**
 * Mutation hook for deleting all roles from a position
 */
export const useDeleteAllRolesFromPosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobPositionId: number) =>
      rolePositionService.deleteAllRolesFromPosition(jobPositionId),
    onSuccess: (data) => {
      toast.success(data.message || "All roles removed from position");
      queryClient.invalidateQueries({
        queryKey: rolePositionQueryKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: rolePositionQueryKeys.lists(),
      });
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error) || "Failed to remove roles from position",
      );
    },
  });
};

// ===========================================================================
// Mutation hooks for reverse perspective (one role → many positions)
// ===========================================================================

/**
 * Mutation hook for assigning job positions to a role
 */
export const useAssignPositionsToRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RolePositionByRoleRequest) =>
      rolePositionService.assignPositionsToRole(data),
    onSuccess: (data) => {
      toast.success(data.message || "Positions assigned to role successfully");
      queryClient.invalidateQueries({
        queryKey: rolePositionQueryKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: rolePositionQueryKeys.roleGroupedLists(),
      });
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error) || "Failed to assign positions to role",
      );
    },
  });
};

/**
 * Mutation hook for updating job positions for a role
 */
export const useUpdatePositionsForRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roleId,
      data,
    }: {
      roleId: number;
      data: RolePositionByRoleRequest;
    }) => rolePositionService.updatePositionsForRole(roleId, data),
    onSuccess: (data) => {
      toast.success(data.message || "Positions updated for role successfully");

      queryClient.invalidateQueries({
        queryKey: rolePositionQueryKeys.all,
      });
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error) || "Failed to update positions for role",
      );
    },
  });
};

/**
 * Mutation hook for deleting all job positions from a role
 */
export const useDeleteAllPositionsFromRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleId: number) =>
      rolePositionService.deleteAllPositionsFromRole(roleId),
    onSuccess: (data) => {
      toast.success(data.message || "All positions removed from role");
      queryClient.invalidateQueries({
        queryKey: rolePositionQueryKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: rolePositionQueryKeys.roleGroupedLists(),
      });
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error) || "Failed to remove positions from role",
      );
    },
  });
};
