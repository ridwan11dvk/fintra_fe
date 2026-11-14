/**
 * Treasury Dashboard Feature Routes
 */

import { Route } from "react-router";
import { TREASURY_DASHBOARD_BASE } from "./data/treasury-dashboard.utils";
import { TreasuryDashboardLazyPage } from "./pages";

export const treasuryDashboardRoutes = (
  <Route>
    <Route
      path={TREASURY_DASHBOARD_BASE}
      element={<TreasuryDashboardLazyPage />}
    />
  </Route>
);
