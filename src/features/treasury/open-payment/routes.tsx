/**
 * Deposit (Open Payment) Feature Routes
 */

import { Route } from "react-router";
import { DEPOSIT_BASE } from "./data/deposit.utils";
import { DepositLazyPage } from "./pages";

export const depositRoutes = (
  <Route path={DEPOSIT_BASE} element={<DepositLazyPage />} />
);
