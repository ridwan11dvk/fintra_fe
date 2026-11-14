/**
 * Province Feature Routes
 */

import { Route } from "react-router";
import { PROVINCE_BASE } from "./data/province.utils";
import { ProvinceLazyPage } from "./pages";

export const provinceRoutes = (
  <Route>
    <Route path={PROVINCE_BASE} element={<ProvinceLazyPage />} />
  </Route>
);
