/**
 * Taxable Item Feature Routes
 */

import { Route } from "react-router";
import { TAXABLE_ITEM_BASE } from "./data/taxable-item.utils";
import { TaxableItemLazyPage } from "./pages";

export const taxableItemRoutes = (
  <Route>
    <Route path={TAXABLE_ITEM_BASE} element={<TaxableItemLazyPage />} />
  </Route>
);
