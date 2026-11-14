/**
 * FAQ Feature Routes
 */

import { Route } from "react-router";
import { FAQ_BASE } from "./data/faq.utils";
import { FaqLazyPage } from "./pages";

export const faqRoutes = (
  <Route>
    <Route path={FAQ_BASE} element={<FaqLazyPage />} />
  </Route>
);