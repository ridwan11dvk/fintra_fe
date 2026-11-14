/**
 * Lookup Value Feature Routes
 */

import { Route } from "react-router";
import { LOOKUP_VALUE_BASE } from "./data/lookup-value.utils";
import { CategoryLazyPage } from "./pages";

export const categoryRoutes = (
  <Route>
    <Route path={LOOKUP_VALUE_BASE} element={<CategoryLazyPage />} />
  </Route>
);