/**
 * Posting Auto Legacy Feature Routes
 */

import { Route } from "react-router";
import { POSTING_AUTO_LEGACY_BASE } from "./data/posting-auto-legacy.utils";
import {
  PostingAutoLegacyDetailLazyPage,
  PostingAutoLegacyLazyPage,
} from "./pages";

export const postingAutoLegacyRoutes = (
  <Route>
    <Route
      path={POSTING_AUTO_LEGACY_BASE}
      element={<PostingAutoLegacyLazyPage />}
    />
    <Route
      path={`${POSTING_AUTO_LEGACY_BASE}/:reversalFlag/:documentNumber/:reference`}
      element={<PostingAutoLegacyDetailLazyPage />}
    />
  </Route>
);
