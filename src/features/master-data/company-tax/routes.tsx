/**
 * Company Tax Feature Routes
 */

import { Route } from "react-router";
import { COMPANY_TAX_BASE } from "./data/company-tax.utils";
import { CompanyTaxLazyPage } from "./pages";

export const companyTaxRoutes = (
  <Route>
    <Route path={COMPANY_TAX_BASE} element={<CompanyTaxLazyPage />} />
  </Route>
);
