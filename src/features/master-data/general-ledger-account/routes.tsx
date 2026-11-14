/**
 * GL Account Feature Routes
 */

import { Route } from "react-router";
import { GL_ACCOUNT_BASE } from "./data/gl-account.utils";
import { GLAccountLazyPage } from "./pages";

export const glAccountRoutes = (
  <Route>
    <Route path={GL_ACCOUNT_BASE} element={<GLAccountLazyPage />} />
  </Route>
);
