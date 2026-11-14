/**
 * Work Catalog Feature Routes
 */

import { Route } from "react-router";
import { WORK_CATALOG_BASE } from "./data/work-catalog.utils";
import {
  WorkCatalogCreateLazyPage,
  WorkCatalogEditLazyPage,
  WorkCatalogLazyPage,
  WorkCatalogShowLazyPage,
} from "./pages";

export const workCatalogRoutes = (
  <Route>
    <Route path={WORK_CATALOG_BASE} element={<WorkCatalogLazyPage />} />
    <Route
      path={`${WORK_CATALOG_BASE}/create`}
      element={<WorkCatalogCreateLazyPage />}
    />
    <Route
      path={`${WORK_CATALOG_BASE}/:id/edit`}
      element={<WorkCatalogEditLazyPage />}
    />
    <Route
      path={`${WORK_CATALOG_BASE}/:id`}
      element={<WorkCatalogShowLazyPage />}
    />
  </Route>
);
