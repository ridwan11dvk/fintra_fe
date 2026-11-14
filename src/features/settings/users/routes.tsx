/**
 * Users Feature Routes
 */

import { Route } from "react-router";
import { USER_BASE } from "./data/user.utils";
import {
  AddExternalUserLazyPage,
  AddInternalUserLazyPage,
  EditExternalUserLazyPage,
  EditInternalUserLazyPage,
  ShowExternalUserLazyPage,
  ShowInternalUserLazyPage,
  UserLazyPage,
} from "./pages";

export const usersRoutes = (
  <Route path={USER_BASE}>
    <Route index element={<UserLazyPage />} />

    <Route path="internal/add" element={<AddInternalUserLazyPage />} />
    <Route path="internal/:id" element={<ShowInternalUserLazyPage />} />
    <Route path="internal/:id/edit" element={<EditInternalUserLazyPage />} />

    <Route path="external/add" element={<AddExternalUserLazyPage />} />
    <Route path="external/:id" element={<ShowExternalUserLazyPage />} />
    <Route path="external/:id/edit" element={<EditExternalUserLazyPage />} />
  </Route>
);
