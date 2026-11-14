import { Route } from "react-router";
import { lazy } from "react";

const MenuManagementLazyPage = lazy(() =>
  import("./pages/menu-management.page").then((module) => ({
    default: module.MenuManagementPage,
  })),
);

export const menuManagementRoutes = (
  <Route>
    <Route path="menu-management" element={<MenuManagementLazyPage />} />
  </Route>
);
