/**
 * Reject Category Feature Routes
 */

import { Route } from "react-router";
import { REJECT_CATEGORY_BASE } from "./data/reject-category.utils";
import { RejectCategoryLazyPage } from "./pages";

export const rejectCategoryRoutes = (
  <Route>
    <Route path={REJECT_CATEGORY_BASE} element={<RejectCategoryLazyPage />} />
  </Route>
);
