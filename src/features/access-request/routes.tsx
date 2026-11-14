/**
 * Access Request Feature - Routes
 */

import { Route } from "react-router";
import { ACCESS_REQUEST_BASE } from "./data/access-request.utils";
import { AccessRequestListLazyPage } from "./pages";

export const accessRequestRoutes = (
  <Route>
    <Route path={ACCESS_REQUEST_BASE} element={<AccessRequestListLazyPage />} />
  </Route>
);
