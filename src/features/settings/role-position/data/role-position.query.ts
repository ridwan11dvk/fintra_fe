import type { PaginationParams } from "@railfinance/core/types";
import { useQuery } from "@tanstack/react-query";
import { rolePositionService } from "./role-position.service";

/**
 * Query key factory for position-role queries
 */
export const rolePositionQueryKeys = {
  all: ["positionRoles"],
  lists: () => [...rolePositionQueryKeys.all, "list"],
  list: (params: PaginationParams & { search?: string }) => [
    ...rolePositionQueryKeys.lists(),
    params,
  ],
  details: () => [...rolePositionQueryKeys.all, "detail"],
  detail: (id: number) => [...rolePositionQueryKeys.details(), id],
  detailByPosition: (jobPositionId: number) => [
    ...rolePositionQueryKeys.details(),
    "position",
    jobPositionId,
  ],
  // Reverse perspective keys (one role → many positions)
  roleGroupedLists: () => [...rolePositionQueryKeys.all, "roleGroupedList"],
  roleGroupedList: (params: PaginationParams & { search?: string }) => [
    ...rolePositionQueryKeys.roleGroupedLists(),
    params,
  ],
  detailByRole: (roleId: number) => [
    ...rolePositionQueryKeys.details(),
    "role",
    roleId,
  ],
};

/**
 * Hook to get all position-role assignments with pagination
 */
export const useRolePositions = (
  params: PaginationParams & { search?: string },
) => {
  return useQuery({
    queryKey: rolePositionQueryKeys.list(params),
    queryFn: () => rolePositionService.getRolePositions(params),
  });
};

/**
 * Hook to get position-role detail by assignment ID
 */
export const useRolePosition = (id: number) => {
  return useQuery({
    queryKey: rolePositionQueryKeys.detail(id),
    queryFn: () => rolePositionService.getRolePositionById(id),
    enabled: !!id,
  });
};

/**
 * Hook to get position-role detail by position ID
 */
export const useRolePositionByPositionId = (jobPositionId: number) => {
  return useQuery({
    queryKey: rolePositionQueryKeys.detailByPosition(jobPositionId),
    queryFn: () =>
      rolePositionService.getRolePositionByPositionId(jobPositionId),
    enabled: !!jobPositionId,
  });
};

// ===========================================================================
// Hooks for reverse perspective (one role → many positions)
// ===========================================================================

/**
 * Hook to get all role-position assignments grouped by role with pagination
 */
export const useRoleGroupedPositions = (
  params: PaginationParams & { search?: string },
) => {
  return useQuery({
    queryKey: rolePositionQueryKeys.roleGroupedList(params),
    queryFn: () => rolePositionService.getRolePositionsGroupedByRole(params),
  });
};

/**
 * Hook to get role-position detail by role ID
 */
export const useRolePositionDetailByRole = (roleId: number) => {
  return useQuery({
    queryKey: rolePositionQueryKeys.detailByRole(roleId),
    queryFn: () => rolePositionService.getPositionRoleDetailByRole(roleId),
    enabled: !!roleId,
  });
};
