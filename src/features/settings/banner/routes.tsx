/**
 * Banner Feature Routes
 */

import { Route } from "react-router";
import { BANNER_BASE } from "./data/banner.utils";
import { BannerLazyPage } from "./pages";

export const bannerRoutes = (
  <Route>
    <Route path={BANNER_BASE} element={<BannerLazyPage />} />
  </Route>
);
