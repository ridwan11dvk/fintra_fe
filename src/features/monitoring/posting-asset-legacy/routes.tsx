/**
 * Posting Asset Legacy Feature Routes
 */

import { Route } from "react-router";
import { POSTING_ASSET_LEGACY_BASE } from "./data/posting-asset-legacy.utils";
import {
  PostingAssetLegacyDetailLazyPage,
  PostingAssetLegacyLazyPage,
} from "./pages";

export const postingAssetLegacyRoutes = (
  <Route>
    <Route
      path={POSTING_ASSET_LEGACY_BASE}
      element={<PostingAssetLegacyLazyPage />}
    />
    <Route
      path={`${POSTING_ASSET_LEGACY_BASE}/:reversalFlag/:documentNumber/:reference`}
      element={<PostingAssetLegacyDetailLazyPage />}
    />
  </Route>
);
