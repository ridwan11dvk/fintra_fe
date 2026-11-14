/** Role Position Feature Routes */

import { Route } from "react-router";
import { ROLE_POSITION_BASE } from "./data/role-position.utils";
import {
  CreateRolePositionByRoleLazyPage,
  CreateRolePositionLazyPage,
  RolePositionLazyPage,
  ShowRolePositionByRoleLazyPage,
  ShowRolePositionLazyPage,
  UpdateRolePositionByRoleLazyPage,
  UpdateRolePositionLazyPage,
} from "./pages";

export const rolePositionRoutes = (
  <Route path={ROLE_POSITION_BASE}>
    <Route index element={<RolePositionLazyPage />} />
    <Route path="create" element={<CreateRolePositionLazyPage />} />
    <Route path=":id" element={<ShowRolePositionLazyPage />} />
    <Route path=":id/update" element={<UpdateRolePositionLazyPage />} />

    {/* Routes for reverse perspective (one role → many positions) */}
    <Route path="by-role">
      <Route path="create" element={<CreateRolePositionByRoleLazyPage />} />
      <Route path=":id" element={<ShowRolePositionByRoleLazyPage />} />
      <Route path=":id/update" element={<UpdateRolePositionByRoleLazyPage />} />
    </Route>
  </Route>
);
