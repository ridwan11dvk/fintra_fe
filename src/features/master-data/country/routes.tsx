/**
 * Country Feature Routes
 */

import { Route } from "react-router";
import { COUNTRY_BASE } from "./data/country.utils";
import { CountryLazyPage } from "./pages";

export const countryRoutes = (
  <Route>
    <Route path={COUNTRY_BASE} element={<CountryLazyPage />} />
  </Route>
);
