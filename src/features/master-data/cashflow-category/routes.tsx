/**
 * Cashflow Category Feature Routes
 */

import { Route } from "react-router";
import { CASHFLOW_CATEGORY_BASE } from "./data/cashflow-category.utils";
import {
  CashflowCategoryCreateLazyPage,
  CashflowCategoryEditLazyPage,
  CashflowCategoryLazyPage,
  CashflowCategoryShowLazyPage,
} from "./pages";

export const cashflowCategoryRoutes = (
  <Route>
    <Route
      path={CASHFLOW_CATEGORY_BASE}
      element={<CashflowCategoryLazyPage />}
    />
    <Route
      path={`${CASHFLOW_CATEGORY_BASE}/create`}
      element={<CashflowCategoryCreateLazyPage />}
    />
    <Route
      path={`${CASHFLOW_CATEGORY_BASE}/:id/edit`}
      element={<CashflowCategoryEditLazyPage />}
    />
    <Route
      path={`${CASHFLOW_CATEGORY_BASE}/:id`}
      element={<CashflowCategoryShowLazyPage />}
    />
  </Route>
);
