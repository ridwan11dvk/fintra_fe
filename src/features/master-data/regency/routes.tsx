/**
 * Regency Feature Routes
 */

import { Route } from "react-router";
import { REGENCY_BASE } from "./data/regency.utils";
import { RegencyLazyPage } from "./pages";

export const regencyRoutes = (
  <Route>
    <Route path={REGENCY_BASE} element={<RegencyLazyPage />} />
  </Route>
);
