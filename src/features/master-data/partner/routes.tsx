/**
 * Partner Feature Routes
 */

import { Route } from "react-router";
import { PARTNER_BASE } from "./data/partner.utils";
import {
  PartnerCreateLazyPage,
  PartnerListLazyPage,
  PartnerShowLazyPage,
  PartnerUpdateLazyPage,
} from "./pages";

export const partnerRoutes = (
  <Route>
    <Route path={PARTNER_BASE} element={<PartnerListLazyPage />} />
    <Route
      path={`${PARTNER_BASE}/create`}
      element={<PartnerCreateLazyPage />}
    />
    <Route
      path={`${PARTNER_BASE}/:id/edit`}
      element={<PartnerUpdateLazyPage />}
    />
    <Route
      path={`${PARTNER_BASE}/:id/show`}
      element={<PartnerShowLazyPage />}
    />
  </Route>
);
