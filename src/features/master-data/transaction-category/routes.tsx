/**
 * Transaction Category Feature Routes
 */

import { Route } from "react-router";
import { TRANSACTION_CATEGORY_BASE } from "./data/transaction-category.utils";
import { TransactionCategoryLazyPage } from "./pages";

export const transactionCategoryRoutes = (
  <Route>
    <Route
      path={TRANSACTION_CATEGORY_BASE}
      element={<TransactionCategoryLazyPage />}
    />
  </Route>
);
