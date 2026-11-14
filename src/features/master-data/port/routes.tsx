/**
 * Port Feature Routes
 */

import { Route } from "react-router";
import { PORT_BASE } from "./data/port.utils";
import { PortLazyPage } from "./pages";

export const portRoutes = (
  <Route>
    <Route path={PORT_BASE} element={<PortLazyPage />} />
  </Route>
);
