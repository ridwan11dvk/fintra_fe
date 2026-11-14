/**
 * Partner Document Reference Feature Routes
 */

import { Route } from "react-router";
import { PARTNER_DOC_REF_BASE } from "./data/partner-doc-ref.utils";
import { PartnerDocRefListLazyPage } from "./pages";

export const partnerDocRefRoutes = (
  <Route>
    <Route
      path={PARTNER_DOC_REF_BASE}
      element={<PartnerDocRefListLazyPage />}
    />
  </Route>
);
