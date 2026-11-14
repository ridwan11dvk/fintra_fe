/**
 * Bank Feature Routes
 */

import { Route } from "react-router";
import { BANK_BASE } from "./data/bank.utils";
import { BankLazyPage } from "./pages";

export const bankRoutes = (
  <Route>
    <Route path={BANK_BASE} element={<BankLazyPage />} />
  </Route>
);
