/**
 * District Feature Routes
 */

import { Route } from "react-router";
import { DISTRICT_BASE } from "./data/district.utils";
import { DistrictLazyPage } from "./pages";

export const districtRoutes = (
  <Route>
    <Route path={DISTRICT_BASE} element={<DistrictLazyPage />} />
  </Route>
);
