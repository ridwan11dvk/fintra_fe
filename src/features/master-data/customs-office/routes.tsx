/**
 * Customs Office Feature Routes
 */

import { Route } from "react-router";
import { CUSTOMS_OFFICE_BASE } from "./data/customs-office.utils";
import { CustomsOfficeLazyPage } from "./pages";

export const customsOfficeRoutes = (
  <Route>
    <Route path={CUSTOMS_OFFICE_BASE} element={<CustomsOfficeLazyPage />} />
  </Route>
);
