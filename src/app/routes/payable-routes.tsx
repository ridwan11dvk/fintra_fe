import { ModulePathProvider } from "@railfinance/core";
import { lazy } from "react";
import { Navigate, Route } from "react-router";

/**
 * Payable module routes are provided by the `railfinance_payable_fe` remote
 * (exposes "./PayableRoutes"). The remote route tree uses relative paths and
 * brings its own Suspense fallback + 404 catch-all, so it mounts as a
 * catch-all under /payable/* inside the host's MainLayout.
 *
 * ModulePathProvider scopes the remote under /payable so every module-local
 * URL it produces stays inside the mount point.
 */
const PayableRoutes = lazy(() => import("payable/PayableRoutes"));

export const payableRoutes = (
  <Route path="payable">
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route
      path="*"
      element={
        <ModulePathProvider basePath="/payable">
          <PayableRoutes />
        </ModulePathProvider>
      }
    />
  </Route>
);
