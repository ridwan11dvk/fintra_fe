/**
 * Payable Dashboard Feature Routes
 */

import { Route } from "react-router";
import { PAYABLE_DASHBOARD_BASE } from "./data/payable-dashboard.utils";
import { PayableDashboardLazyPage } from "./pages";

export const payableDashboardRoutes = (
  <Route>
    <Route
      path={PAYABLE_DASHBOARD_BASE}
      element={<PayableDashboardLazyPage />}
    />
  </Route>
);
