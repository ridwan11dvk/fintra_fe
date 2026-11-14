/**
 * House Bank Feature Routes
 */

import { Route } from "react-router";
import { HOUSE_BANK_BASE } from "./data/house-bank.utils";
import { HouseBankLazyPage } from "./pages";

export const houseBankRoutes = (
  <Route>
    <Route path={HOUSE_BANK_BASE} element={<HouseBankLazyPage />} />
  </Route>
);
