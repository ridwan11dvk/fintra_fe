/**
 * Transaction Type Feature Routes
 */

import { Route } from "react-router";
import { TRANSACTION_TYPE_BASE } from "./data/transaction-type.utils";
import { TransactionTypeLazyPage } from "./pages";

export const transactionTypeRoutes = (
  <Route>
    <Route path={TRANSACTION_TYPE_BASE} element={<TransactionTypeLazyPage />} />
  </Route>
);
