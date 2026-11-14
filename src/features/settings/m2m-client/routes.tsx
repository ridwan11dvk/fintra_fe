/**
 * M2M Client Feature Routes
 */

import { Route } from "react-router";
import {
  AddM2mClientLazyPage,
  EditM2mClientLazyPage,
  M2mClientLazyPage,
  ShowM2mClientLazyPage,
} from "./pages";

export const m2mClientRoutes = (
  <>
    <Route path="m2m-client" element={<M2mClientLazyPage />} />
    <Route path="m2m-client/create" element={<AddM2mClientLazyPage />} />
    <Route path="m2m-client/:id" element={<ShowM2mClientLazyPage />} />
    <Route path="m2m-client/:id/edit" element={<EditM2mClientLazyPage />} />
  </>
);
