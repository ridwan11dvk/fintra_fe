import { ModulePathProvider } from "@railfinance/core";
import { lazy } from "react";
import { Navigate, Route } from "react-router";

/**
 * Tax module routes are provided by the `railfinance_tax_fe` remote
 * (exposes "./TaxRoutes"). The remote route tree uses relative paths and
 * brings its own Suspense fallback + 404 catch-all, so it mounts as a
 * catch-all under /tax/* inside the host's MainLayout.
 *
 * ModulePathProvider scopes the remote under /tax so every module-local
 * URL it produces stays inside the mount point.
 */
const TaxRoutes = lazy(() => import("tax/TaxRoutes"));

export const taxRoutes = (
  <Route path="tax">
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route
      path="*"
      element={
        <ModulePathProvider basePath="/tax">
          <TaxRoutes />
        </ModulePathProvider>
      }
    />
  </Route>
);
