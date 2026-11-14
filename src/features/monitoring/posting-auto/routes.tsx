/**
 * Posting Auto Feature Routes
 */

import { Route } from "react-router";
import { POSTING_AUTO_BASE } from "./data/posting-auto.utils";
import { PostingAutoDetailLazyPage, PostingAutoLazyPage } from "./pages";

export const postingAutoRoutes = (
  <Route>
    <Route path={POSTING_AUTO_BASE} element={<PostingAutoLazyPage />} />
    <Route
      path={`${POSTING_AUTO_BASE}/:reversalFlag/:documentNumber/:reference`}
      element={<PostingAutoDetailLazyPage />}
    />
  </Route>
);
