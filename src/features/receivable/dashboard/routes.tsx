/**
 * Receivable Dashboard Feature Routes
 */

import { Route } from "react-router";
import { RECEIVABLE_DASHBOARD_BASE } from "./data/receivable-dashboard.utils";
import { ReceivableDashboardLazyPage } from "./pages";

export const receivableDashboardRoutes = (
  <Route>
    <Route
      path={RECEIVABLE_DASHBOARD_BASE}
      element={<ReceivableDashboardLazyPage />}
    />
  </Route>
);
