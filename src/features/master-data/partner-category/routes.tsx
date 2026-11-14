/**
 * Partner Category Feature Routes
 */

import { Route } from "react-router";
import { PARTNER_CATEGORY_BASE } from "./data/partner-category.utils";
import { PartnerCategoryLazyPage } from "./pages";

export const partnerCategoryRoutes = (
  <Route>
    <Route path={PARTNER_CATEGORY_BASE} element={<PartnerCategoryLazyPage />} />
  </Route>
);
