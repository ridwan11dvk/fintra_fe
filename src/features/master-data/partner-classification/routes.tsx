/**
 * Partner Classification Feature Routes
 */

import { Route } from "react-router";
import { PARTNER_CLASSIFICATION_BASE } from "./data/partner-classification.utils";
import { PartnerClassificationLazyPage } from "./pages";

export const partnerClassificationRoutes = (
  <Route>
    <Route
      path={PARTNER_CLASSIFICATION_BASE}
      element={<PartnerClassificationLazyPage />}
    />
  </Route>
);
