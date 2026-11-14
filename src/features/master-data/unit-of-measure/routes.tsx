/**
 * Unit of Measure Feature Routes
 */

import { Route } from "react-router";
import { UOM_BASE } from "./data/uom.utils";
import { UomLazyPage } from "./pages";

export const uomRoutes = (
  <Route>
    <Route path={UOM_BASE} element={<UomLazyPage />} />
  </Route>
);
