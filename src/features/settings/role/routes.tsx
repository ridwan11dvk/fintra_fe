/**
 * Role Feature Routes
 */

import { Route } from "react-router";
import { ROLE_BASE } from "./data/role.utils";
import {
  CreateRoleLazyPage,
  RoleLazyPage,
  ShowRoleLazyPage,
  UpdateRoleLazyPage,
} from "./pages";

export const roleRoutes = (
  <Route path={ROLE_BASE}>
    <Route index element={<RoleLazyPage />} />
    <Route path=":id" element={<ShowRoleLazyPage />} />
    <Route path="create" element={<CreateRoleLazyPage />} />
    <Route path=":id/update" element={<UpdateRoleLazyPage />} />
  </Route>
);
