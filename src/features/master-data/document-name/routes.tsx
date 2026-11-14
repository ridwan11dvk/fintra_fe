/**
 * Document Name Feature Routes
 */

import { Route } from "react-router";
import { DOCUMENT_NAME_BASE } from "./data/document-name.utils";
import { DocumentNameLazyPage } from "./pages";

export const documentNameRoutes = (
  <Route>
    <Route path={DOCUMENT_NAME_BASE} element={<DocumentNameLazyPage />} />
  </Route>
);
