/**
 * Monitoring Dashboard Feature Routes
 */

import { Route } from "react-router";
import { MonitoringDashboardLazyPage } from "./pages";

export const monitoringDashboardRoutes = (
  <Route>
    <Route path="dashboard" element={<MonitoringDashboardLazyPage />} />
  </Route>
);
