/**
 * Company Feature Routes
 */

import { Route } from "react-router";
import { COMPANY_BASE } from "./data/company.utils";
import {
  CompanyCreateLazyPage,
  CompanyListLazyPage,
  CompanyShowLazyPage,
  CompanyUpdateLazyPage,
} from "./pages";

export const companyRoutes = (
  <Route>
    <Route path={COMPANY_BASE} element={<CompanyListLazyPage />} />
    <Route
      path={`${COMPANY_BASE}/create`}
      element={<CompanyCreateLazyPage />}
    />
    <Route
      path={`${COMPANY_BASE}/:id/edit`}
      element={<CompanyUpdateLazyPage />}
    />
    <Route
      path={`${COMPANY_BASE}/:id/show`}
      element={<CompanyShowLazyPage />}
    />
  </Route>
);
