/**
 * Digital Vault Feature Routes
 * Lazy-loaded route definitions for Digital Vault module
 */

import { DIGITAL_VAULT_BASE } from "@/features/treasury";
import { Route } from "react-router";
import { ClosureDetailLazyPage, StationListLazyPage } from "./pages";

export const digitalVaultRoutes = (
  <Route>
    <Route path={DIGITAL_VAULT_BASE} element={<StationListLazyPage />} />
    <Route
      path={DIGITAL_VAULT_BASE + "/:stationName/closures"}
      element={<ClosureDetailLazyPage />}
    />
  </Route>
);
