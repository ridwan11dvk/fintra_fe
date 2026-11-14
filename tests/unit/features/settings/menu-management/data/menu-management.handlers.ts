import type { ApiResponse } from "@railfinance/core/types";
import { http, HttpResponse } from "msw";
import type { NavigationMenuItem } from "@/features/settings/menu-management/data/menu-management.types";

const BASE = "http://localhost:3000";
const MENU_BASE_URL = `${BASE}/master/navigation`;

export const mockMenuItem: NavigationMenuItem = {
  id: 1,
  code: "DASHBOARD",
  title: "Dashboard",
  titleEn: "Dashboard",
  url: "/dashboard",
  icon: "LayoutDashboard",
  type: "MENU",
  category: "USER_MENU",
  sortOrder: 1,
  openInNewTab: false,
  badge: null,
  parentId: null,
  featureId: 10,
  moduleId: 5,
  moduleName: "Core",
  featureName: "Dashboard",
  children: [
    {
      id: 2,
      code: "DASHBOARD_OVERVIEW",
      title: "Overview",
      titleEn: "Overview",
      url: "/dashboard/overview",
      icon: null,
      type: "SUBMENU",
      category: "USER_MENU",
      sortOrder: 1,
      openInNewTab: false,
      badge: null,
      parentId: 1,
      featureId: null,
      moduleId: null,
      children: [],
    },
  ],
};

export const mockGuestHeaderMenu: NavigationMenuItem = {
  id: 3,
  code: "GUEST_HOME",
  title: "Home",
  titleEn: "Home",
  url: "/",
  icon: null,
  type: "MENU",
  category: "GUEST_HEADER",
  sortOrder: 1,
  openInNewTab: false,
  badge: null,
  parentId: null,
  featureId: null,
  moduleId: null,
  children: [],
};

const successResponse = <T>(data: T, message = "Success"): ApiResponse<T> => ({
  status: "SUCCESS",
  message,
  data,
});

export const menuManagementHandlers = [
  http.get(MENU_BASE_URL, ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    if (category === "USER_MENU") {
      return HttpResponse.json(successResponse([mockMenuItem]));
    }
    if (category === "GUEST_HEADER") {
      return HttpResponse.json(successResponse([mockGuestHeaderMenu]));
    }
    if (category === "GUEST_FOOTER") {
      return HttpResponse.json(successResponse([]));
    }

    return HttpResponse.json(successResponse([]));
  }),

  http.get(`${MENU_BASE_URL}/:id`, ({ params }) => {
    const id = Number(params.id);
    if (id === 1) {
      return HttpResponse.json(successResponse(mockMenuItem));
    }
    if (id === 3) {
      return HttpResponse.json(successResponse(mockGuestHeaderMenu));
    }
    return HttpResponse.json(successResponse(mockMenuItem));
  }),

  http.post(MENU_BASE_URL, () =>
    HttpResponse.json(successResponse(mockMenuItem, "Menu created"), {
      status: 201,
    }),
  ),

  http.put(`${MENU_BASE_URL}/:id`, () =>
    HttpResponse.json(successResponse(mockMenuItem, "Menu updated")),
  ),

  http.post(`${MENU_BASE_URL}/reorder`, () =>
    HttpResponse.json(successResponse(null, "Menu reordered")),
  ),

  http.delete(`${MENU_BASE_URL}/:id`, () =>
    HttpResponse.json(successResponse(null, "Menu deleted")),
  ),
];
