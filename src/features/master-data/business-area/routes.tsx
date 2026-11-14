/**
 * Business Area Feature Routes
 */

import { Route } from "react-router";
import { BUSINESS_AREA_BASE } from "./data/business-area.utils";
import { BusinessAreaLazyPage } from "./pages";

export const businessAreaRoutes = (
  <Route>
    <Route path={BUSINESS_AREA_BASE} element={<BusinessAreaLazyPage />} />
  </Route>
);
