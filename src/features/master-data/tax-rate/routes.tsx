/**
 * Tax Rate Feature Routes
 */

import { Route } from "react-router";
import { TAX_RATE_BASE } from "./data/tax-rate.utils";
import { TaxRateLazyPage } from "./pages";

export const taxRateRoutes = (
  <Route>
    <Route path={TAX_RATE_BASE} element={<TaxRateLazyPage />} />
  </Route>
);
