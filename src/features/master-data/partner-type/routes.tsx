/**
 * Partner Type Feature Routes
 */

import { Route } from "react-router";
import { PARTNER_TYPE_BASE } from "./data/partner-type.utils";
import { PartnerTypeLazyPage } from "./pages";

export const partnerTypeRoutes = (
  <Route>
    <Route path={PARTNER_TYPE_BASE} element={<PartnerTypeLazyPage />} />
  </Route>
);
