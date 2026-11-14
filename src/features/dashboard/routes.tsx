/**
 * Dashboard Feature Routes
 */

import { Route } from "react-router";
import { DASHBOARD_BASE } from "./data/dashboard.utils";
import { DashboardLazyPage } from "./pages";

export const dashboardRoutes = (
  <Route>
    <Route path={DASHBOARD_BASE} element={<DashboardLazyPage />} />
  </Route>
);
