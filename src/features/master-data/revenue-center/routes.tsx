/**
 * Revenue Center Feature Routes
 */

import { Route } from "react-router";
import { REVENUE_CENTER_BASE } from "./data/revenue-center.utils";
import {
  RevenueCenterCreateLazyPage,
  RevenueCenterEditLazyPage,
  RevenueCenterLazyPage,
  RevenueCenterShowLazyPage,
} from "./pages";

export const revenueCenterRoutes = (
  <Route>
    <Route path={REVENUE_CENTER_BASE} element={<RevenueCenterLazyPage />} />
    <Route
      path={`${REVENUE_CENTER_BASE}/create`}
      element={<RevenueCenterCreateLazyPage />}
    />
    <Route
      path={`${REVENUE_CENTER_BASE}/:id/edit`}
      element={<RevenueCenterEditLazyPage />}
    />
    <Route
      path={`${REVENUE_CENTER_BASE}/:id`}
      element={<RevenueCenterShowLazyPage />}
    />
  </Route>
);
