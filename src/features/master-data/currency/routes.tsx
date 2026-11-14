/**
 * Currency Feature Routes
 */

import { Route } from "react-router";
import { CURRENCY_BASE } from "./data/currency.utils";
import { CurrencyLazyPage } from "./pages";

export const currencyRoutes = (
  <Route>
    <Route path={CURRENCY_BASE} element={<CurrencyLazyPage />} />
  </Route>
);
