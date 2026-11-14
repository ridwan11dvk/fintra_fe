import type { MenuCategory, MenuType } from "@railfinance/core/types";

export interface NavigationMenuItem {
  id: number;
  code: string;
  title: string;
  titleEn?: string | null;
  url: string;
  icon?: string | null;
  type: MenuType;
  category: MenuCategory;
  sortOrder: number;
  openInNewTab: boolean;
  badge?: string | null;
  parentId?: number | null;
  featureId?: number | null;
  moduleId?: number | null;
  moduleName?: string | null;
  featureName?: string | null;
  children?: NavigationMenuItem[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface NavigationMenuTreeResponse {
  data: NavigationMenuItem[] | null;
}

export interface NavigationMenuGetResponse {
  data: NavigationMenuItem;
}

export interface NavigationMenuRequest {
  code: string;
  title: string;
  titleEn?: string | null;
  url: string;
  icon?: string | null;
  type: MenuType;
  category: MenuCategory;
  sortOrder: number;
  openInNewTab: boolean;
  badge?: string | null;
  parentId?: number | null;
  featureId?: number | null;
  moduleId?: number | null;
}

export interface NavigationMenuReorderItem {
  id: number;
  parentId?: number | null;
  sortOrder: number;
}

export interface NavigationMenuReorderRequest {
  items: NavigationMenuReorderItem[];
}

export type NavigationMenuFormData = NavigationMenuRequest;
