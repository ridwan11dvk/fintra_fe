import { Route } from "react-router";
import { CONTENT_BASE } from "./data/content.utils";
import { ContentCreateLazyPage, ContentDetailLazyPage, ContentEditLazyPage, ContentListLazyPage, ContentPreviewLazyPage } from "./pages";

export const contentRoutes = <Route>
  <Route path={CONTENT_BASE} element={<ContentListLazyPage />} />
  <Route path={`${CONTENT_BASE}/create`} element={<ContentCreateLazyPage />} />
  <Route path={`${CONTENT_BASE}/preview`} element={<ContentPreviewLazyPage />} />
  <Route path={`${CONTENT_BASE}/:id`} element={<ContentDetailLazyPage />} />
  <Route path={`${CONTENT_BASE}/:id/edit`} element={<ContentEditLazyPage />} />
</Route>;
