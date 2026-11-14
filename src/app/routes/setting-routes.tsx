import { accessRequestRoutes } from "@/features/access-request";
import { bannerRoutes } from "@/features/settings/banner";
import { faqRoutes } from "@/features/settings/faq";
import { m2mClientRoutes } from "@/features/settings/m2m-client";
import { menuManagementRoutes } from "@/features/settings/menu-management";
import { rolePositionRoutes } from "@/features/settings/role-position";
import { roleRoutes } from "@/features/settings/role";
import { setupConfigurationRoutes } from "@/features/settings/setup-configuration";
import { usersRoutes } from "@/features/settings/users";
import { lazy } from "react";
import { Navigate, Route } from "react-router";

const UnderConstructionPage = lazy(() =>
  import("@/features/errors").then((module) => ({
    default: module.UnderConstructionPage,
  })),
);

export const settingRoutes = (
  <Route path="setting">
    <Route index element={<Navigate to="setup-configuration" replace />} />

    {setupConfigurationRoutes}

    {usersRoutes}

    {accessRequestRoutes}

    <Route path="approval" element={<UnderConstructionPage />} />
    {roleRoutes}
    {rolePositionRoutes}
    {m2mClientRoutes}
    {menuManagementRoutes}
    {bannerRoutes}
    {faqRoutes}
  </Route>
);
