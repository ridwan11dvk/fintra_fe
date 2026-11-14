/**
 * Cashflow Group Feature Routes
 */

import { Route } from "react-router";
import { CASHFLOW_GROUP_BASE } from "./data/cashflow-group.utils";
import {
  CashflowGroupCreateLazyPage,
  CashflowGroupEditLazyPage,
  CashflowGroupLazyPage,
  CashflowGroupShowLazyPage,
} from "./pages";

export const cashflowGroupRoutes = (
  <Route>
    <Route path={CASHFLOW_GROUP_BASE} element={<CashflowGroupLazyPage />} />
    <Route
      path={`${CASHFLOW_GROUP_BASE}/create`}
      element={<CashflowGroupCreateLazyPage />}
    />
    <Route
      path={`${CASHFLOW_GROUP_BASE}/:id/edit`}
      element={<CashflowGroupEditLazyPage />}
    />
    <Route
      path={`${CASHFLOW_GROUP_BASE}/:id`}
      element={<CashflowGroupShowLazyPage />}
    />
  </Route>
);
