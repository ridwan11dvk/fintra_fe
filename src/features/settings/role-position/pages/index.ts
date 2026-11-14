import { lazy } from "react";

export const RolePositionLazyPage = lazy(() =>
  import("./role-position.page").then((mod) => ({
    default: mod.RolePositionPage,
  })),
);

export const ShowRolePositionLazyPage = lazy(() =>
  import("./show-role-position.page").then((mod) => ({
    default: mod.ShowRolePositionPage,
  })),
);

export const CreateRolePositionLazyPage = lazy(() =>
  import("./create-role-position.page").then((mod) => ({
    default: mod.CreateRolePositionPage,
  })),
);

export const UpdateRolePositionLazyPage = lazy(() =>
  import("./update-role-position.page").then((mod) => ({
    default: mod.UpdateRolePositionPage,
  })),
);

// Lazy pages for reverse perspective (one role → many positions)
export const CreateRolePositionByRoleLazyPage = lazy(() =>
  import("./create-role-position-by-role.page").then((mod) => ({
    default: mod.CreateRolePositionByRolePage,
  })),
);

export const UpdateRolePositionByRoleLazyPage = lazy(() =>
  import("./update-role-position-by-role.page").then((mod) => ({
    default: mod.UpdateRolePositionByRolePage,
  })),
);

export const ShowRolePositionByRoleLazyPage = lazy(() =>
  import("./show-role-position-by-role.page").then((mod) => ({
    default: mod.ShowRolePositionByRolePage,
  })),
);
