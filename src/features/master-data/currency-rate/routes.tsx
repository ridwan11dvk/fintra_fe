/**
 * Currency Rate Feature Routes
 */

import { Route } from "react-router";
import { CURRENCY_RATE_BASE } from "./data/currency-rate.utils";
import { CurrencyRateLazyPage } from "./pages";

export const currencyRateRoutes = (
  <Route>
    <Route path={CURRENCY_RATE_BASE} element={<CurrencyRateLazyPage />} />
  </Route>
);
