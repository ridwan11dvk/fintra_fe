/**
 * Chart of Account Feature Routes
 */

import { Route } from "react-router";
import { CHART_OF_ACCOUNT_BASE } from "./data/chart-of-account.utils";
import {
  ChartOfAccountDetailLazyPage,
  ChartOfAccountFormLazyPage,
  ChartOfAccountLazyPage,
} from "./pages";

export const chartOfAccountRoutes = (
  <Route>
    <Route path={CHART_OF_ACCOUNT_BASE} element={<ChartOfAccountLazyPage />} />
    <Route
      path={`${CHART_OF_ACCOUNT_BASE}/create`}
      element={<ChartOfAccountFormLazyPage />}
    />
    <Route
      path={`${CHART_OF_ACCOUNT_BASE}/:id/edit`}
      element={<ChartOfAccountFormLazyPage />}
    />
    <Route
      path={`${CHART_OF_ACCOUNT_BASE}/:id`}
      element={<ChartOfAccountDetailLazyPage />}
    />
  </Route>
);
