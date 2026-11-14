/**
 * Business Unit Feature Routes
 */

import { Route } from "react-router";
import { BUSINESS_UNIT_BASE } from "./data/business-unit.utils";
import {
  BusinessUnitDetailLazyPage,
  BusinessUnitFormLazyPage,
  BusinessUnitLazyPage,
} from "./pages";

export const businessUnitRoutes = (
  <Route>
    <Route path={BUSINESS_UNIT_BASE} element={<BusinessUnitLazyPage />} />
    <Route
      path={`${BUSINESS_UNIT_BASE}/create`}
      element={<BusinessUnitFormLazyPage />}
    />
    <Route
      path={`${BUSINESS_UNIT_BASE}/:id/edit`}
      element={<BusinessUnitFormLazyPage />}
    />
    <Route
      path={`${BUSINESS_UNIT_BASE}/:id`}
      element={<BusinessUnitDetailLazyPage />}
    />
  </Route>
);
