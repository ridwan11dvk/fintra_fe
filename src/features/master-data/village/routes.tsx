/**
 * Village Feature Routes
 */

import { Route } from "react-router";
import { VILLAGE_BASE } from "./data/village.utils";
import { VillageLazyPage } from "./pages";

export const villageRoutes = (
  <Route>
    <Route path={VILLAGE_BASE} element={<VillageLazyPage />} />
  </Route>
);
