import { Route } from "react-router";
import { PROFIT_CENTER_BASE } from "./data/profit-center.utils";
import {
  ProfitCenterCreateLazyPage,
  ProfitCenterDetailLazyPage,
  ProfitCenterEditLazyPage,
  ProfitCenterListLazyPage,
} from "./pages";

export const profitCenterRoutes = (
  <Route>
    <Route path={PROFIT_CENTER_BASE} element={<ProfitCenterListLazyPage />} />
    <Route path={`${PROFIT_CENTER_BASE}/create`} element={<ProfitCenterCreateLazyPage />} />
    <Route path={`${PROFIT_CENTER_BASE}/:profitCenterId`} element={<ProfitCenterDetailLazyPage />} />
    <Route path={`${PROFIT_CENTER_BASE}/:profitCenterId/edit`} element={<ProfitCenterEditLazyPage />} />
  </Route>
);
