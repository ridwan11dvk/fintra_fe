/**
 * Reporting Dashboard Feature Routes
 */

import { Route } from "react-router";
import { REPORTING_DASHBOARD_BASE } from "./data/reporting-dashboard.utils";
import { ReportingDashboardLazyPage } from "./pages";

export const reportingDashboardRoutes = (
  <Route>
    <Route
      path={REPORTING_DASHBOARD_BASE}
      element={<ReportingDashboardLazyPage />}
    />
  </Route>
);
