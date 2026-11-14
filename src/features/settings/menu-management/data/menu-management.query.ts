import { toast } from "@railfinance/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { menuManagementService } from "./menu-management.service";
import type {
  NavigationMenuReorderRequest,
  NavigationMenuRequest,
} from "./menu-management.types";

export const menuManagementQueryKeys = {
  all: ["menu-management"] as const,
  menus: () => [...menuManagementQueryKeys.all, "menus"] as const,
  menuTree: () => [...menuManagementQueryKeys.all, "tree"] as const,
  menu: (id: number) => [...menuManagementQueryKeys.all, "menu", id] as const,
};

export const useMenuTree = () => {
  return useQuery({
    queryKey: menuManagementQueryKeys.menuTree(),
    queryFn: () => menuManagementService.getMenuTree(),
  });
};

export const useMenus = () => {
  return useQuery({
    queryKey: menuManagementQueryKeys.menus(),
    queryFn: () => menuManagementService.getMenus(),
  });
};

export const useMenu = (id: number, enabled = true) => {
  return useQuery({
    queryKey: menuManagementQueryKeys.menu(id),
    queryFn: () => menuManagementService.getMenu(id),
    enabled: !!id && enabled,
  });
};

export const useCreateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NavigationMenuRequest) =>
      menuManagementService.createMenu(data),
    onSuccess: () => {
      toast.success("Menu created successfully");
      void queryClient.invalidateQueries({
        queryKey: menuManagementQueryKeys.menuTree(),
      });
      void queryClient.invalidateQueries({
        queryKey: menuManagementQueryKeys.menus(),
      });
    },
    onError: () => {
      toast.error("Failed to create menu");
    },
  });
};

export const useUpdateMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: NavigationMenuRequest }) =>
      menuManagementService.updateMenu(id, data),
    onSuccess: () => {
      toast.success("Menu updated successfully");
      void queryClient.invalidateQueries({
        queryKey: menuManagementQueryKeys.menuTree(),
      });
      void queryClient.invalidateQueries({
        queryKey: menuManagementQueryKeys.menus(),
      });
    },
    onError: () => {
      toast.error("Failed to update menu");
    },
  });
};

export const useReorderMenus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NavigationMenuReorderRequest) =>
      menuManagementService.reorderMenus(data),
    onSuccess: () => {
      toast.success("Menu order updated successfully");
      void queryClient.invalidateQueries({
        queryKey: menuManagementQueryKeys.menuTree(),
      });
      void queryClient.invalidateQueries({
        queryKey: menuManagementQueryKeys.menus(),
      });
    },
    onError: () => {
      toast.error("Failed to reorder menus");
    },
  });
};

export const useDeleteMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => menuManagementService.deleteMenu(id),
    onSuccess: () => {
      toast.success("Menu deleted successfully");
      void queryClient.invalidateQueries({
        queryKey: menuManagementQueryKeys.menuTree(),
      });
      void queryClient.invalidateQueries({
        queryKey: menuManagementQueryKeys.menus(),
      });
    },
    onError: () => {
      toast.error("Failed to delete menu");
    },
  });
};
