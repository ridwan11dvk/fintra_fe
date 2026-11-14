import type { PaginationParams } from "@railfinance/core/types";
import { useQuery } from "@tanstack/react-query";
import { roleService } from "./role.service";

/**
 * Query key factory for role-related queries
 */
export const roleQueryKeys = {
  all: ["roles"],
  allPermissions: ["permissions"],
  groupedPermissions: (params: {
    moduleId?: number;
    featureId?: number;
  }) => [...roleQueryKeys.allPermissions, "grouped", params],
  permissionsList: (
    params: PaginationParams & {
      search?: string;
      featureId?: number;
      moduleId?: number;
      moduleIds?: number[];
    },
  ) => [...roleQueryKeys.allPermissions, "list", params],
  lists: () => [...roleQueryKeys.all, "list"],
  list: (params: PaginationParams) => [...roleQueryKeys.lists(), params],
  listFiltered: (params?: { moduleIds?: number[]; roleId?: number }) => [
    ...roleQueryKeys.all,
    "list",
    "filtered",
    params,
  ],
  details: () => [...roleQueryKeys.all, "detail"],
  detail: (id: number) => [...roleQueryKeys.details(), id],
  detailByName: (name: string) => [...roleQueryKeys.details(), "name", name],
  fullDetail: (id: number) => [...roleQueryKeys.details(), "full", id],
  permissions: (id: number) => [...roleQueryKeys.all, "permissions", id],
};

/**
 * Hook to get all roles with pagination
 */
export const useRoles = (params: PaginationParams) => {
  return useQuery({
    queryKey: roleQueryKeys.list(params),
    queryFn: () => roleService.getRoles(params),
  });
};

/**
 * Hook to get filtered roles for dropdowns.
 * Provide either moduleIds or roleId, not both.
 */
export const useFilteredRoles = (params?: {
  moduleIds?: number[];
  roleId?: number;
}) => {
  return useQuery({
    queryKey: roleQueryKeys.listFiltered(params),
    queryFn: () => roleService.getFilteredRoles(params),
  });
};

/**
 * Hook to get roles by module IDs
 */
/**
 * Hook to get all permissions with pagination
 */
export const usePermissions = (
  params: PaginationParams & {
    search?: string;
    featureId?: number;
    moduleId?: number;
    moduleIds?: number[];
  },
  enabled?: boolean,
) => {
  return useQuery({
    queryKey: roleQueryKeys.permissionsList(params),
    queryFn: () => roleService.getPermissions(params),
    enabled,
  });
};

/**
 * Hook to get permissions grouped by feature
 */
export const useGroupedPermissions = (
  params: {
    moduleId?: number;
    featureId?: number;
  },
  enabled?: boolean,
) => {
  return useQuery({
    queryKey: roleQueryKeys.groupedPermissions(params),
    queryFn: () => roleService.getGroupedPermissions(params),
    enabled,
  });
};

/**
 * Hook to get role by ID
 */
export const useRole = (id: number) => {
  return useQuery({
    queryKey: roleQueryKeys.detail(id),
    queryFn: () => roleService.getRoleById(id),
    enabled: !!id,
  });
};

/**
 * Hook to get full role detail with company, business areas, and module-grouped permissions
 */
export const useRoleFullDetail = (id: number) => {
  return useQuery({
    queryKey: roleQueryKeys.fullDetail(id),
    queryFn: () => roleService.getRoleFullDetail(id),
    enabled: !!id,
  });
};

/**
 * Hook to get role by name
 */
export const useRoleByName = (name: string) => {
  return useQuery({
    queryKey: roleQueryKeys.detailByName(name),
    queryFn: () => roleService.getRoleByName(name),
    enabled: !!name,
  });
};

/**
 * Hook to get permissions for a role
 */
export const useRolePermissions = (id: number) => {
  return useQuery({
    queryKey: roleQueryKeys.permissions(id),
    queryFn: () => roleService.getRolePermissions(id),
    enabled: !!id,
  });
};
