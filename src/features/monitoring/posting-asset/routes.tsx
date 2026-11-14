/**
 * Posting Asset Feature Routes
 */

import { Route } from "react-router";
import { POSTING_ASSET_BASE } from "./data/posting-asset.utils";
import { PostingAssetDetailLazyPage, PostingAssetLazyPage } from "./pages";

export const postingAssetRoutes = (
  <Route>
    <Route path={POSTING_ASSET_BASE} element={<PostingAssetLazyPage />} />
    <Route
      path={`${POSTING_ASSET_BASE}/:reversalFlag/:documentNumber/:reference`}
      element={<PostingAssetDetailLazyPage />}
    />
  </Route>
);
