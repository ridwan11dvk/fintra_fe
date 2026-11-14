import type { ApiResponse } from "@railfinance/core/types";
import { apiClient as axiosInstance } from "@railfinance/core/lib";
import type {
  NavigationMenuGetResponse,
  NavigationMenuItem,
  NavigationMenuReorderRequest,
  NavigationMenuRequest,
} from "./menu-management.types";

const MENU_BASE_URL = "/master/navigation";
const MENU_CATEGORIES = ["USER_MENU", "GUEST_HEADER", "GUEST_FOOTER"] as const;

const getMenuTreeByCategory = async (
  category: (typeof MENU_CATEGORIES)[number],
): Promise<NavigationMenuItem[]> => {
  const response = await axiosInstance.get<
    ApiResponse<NavigationMenuItem[] | null>
  >(MENU_BASE_URL, { params: { category } });
  return response.data.data ?? [];
};

const getAllMenuTrees = async (): Promise<NavigationMenuItem[]> => {
  const trees = await Promise.all(MENU_CATEGORIES.map(getMenuTreeByCategory));
  return trees.flat();
};

const flattenMenuTree = (
  menus: NavigationMenuItem[],
): NavigationMenuItem[] =>
  menus.flatMap((menu) => [menu, ...flattenMenuTree(menu.children ?? [])]);

export const menuManagementService = {
  getMenus: async (): Promise<NavigationMenuItem[]> => {
    return flattenMenuTree(await getAllMenuTrees());
  },

  getMenuTree: async (): Promise<NavigationMenuItem[]> => {
    return getAllMenuTrees();
  },

  getMenu: async (id: number): Promise<NavigationMenuItem> => {
    const response = await axiosInstance.get<NavigationMenuGetResponse>(
      `${MENU_BASE_URL}/${id}`,
    );
    return response.data.data;
  },

  createMenu: async (data: NavigationMenuRequest): Promise<NavigationMenuItem> => {
    const response = await axiosInstance.post<NavigationMenuGetResponse>(
      MENU_BASE_URL,
      data,
    );
    return response.data.data;
  },

  updateMenu: async (id: number, data: NavigationMenuRequest): Promise<NavigationMenuItem> => {
    const response = await axiosInstance.put<NavigationMenuGetResponse>(
      `${MENU_BASE_URL}/${id}`,
      data,
    );
    return response.data.data;
  },

  reorderMenus: async (data: NavigationMenuReorderRequest): Promise<void> => {
    await axiosInstance.post(`${MENU_BASE_URL}/reorder`, data);
  },

  deleteMenu: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${MENU_BASE_URL}/${id}`);
  },
};
