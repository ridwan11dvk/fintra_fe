import { Route } from "react-router";
import { KBLI_BASE } from "./data/kbli.utils";
import { KbliCreateLazyPage, KbliDetailLazyPage, KbliEditLazyPage, KbliListLazyPage } from "./pages";

export const kbliRoutes = <Route>
  <Route path={KBLI_BASE} element={<KbliListLazyPage />} />
  <Route path={`${KBLI_BASE}/create`} element={<KbliCreateLazyPage />} />
  <Route path={`${KBLI_BASE}/:id`} element={<KbliDetailLazyPage />} />
  <Route path={`${KBLI_BASE}/:id/edit`} element={<KbliEditLazyPage />} />
</Route>;
