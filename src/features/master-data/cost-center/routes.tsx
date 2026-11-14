/**
 * Cost Center Feature Routes
 */

import { Route } from "react-router";
import { COST_CENTER_BASE } from "./data/cost-center.utils";
import { CostCenterLazyPage } from "./pages";

export const costCenterRoutes = (
  <Route>
    <Route path={COST_CENTER_BASE} element={<CostCenterLazyPage />} />
  </Route>
);
