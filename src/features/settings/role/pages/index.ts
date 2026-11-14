import { lazy } from "react";

export const RoleLazyPage = lazy(() =>
  import("./role.page").then((mod) => ({
    default: mod.RolePage,
  })),
);

export const ShowRoleLazyPage = lazy(() =>
  import("./show-role.page").then((mod) => ({
    default: mod.ShowRolePage,
  })),
);

export const CreateRoleLazyPage = lazy(() =>
  import("./create-role.page").then((mod) => ({
    default: mod.CreateRolePage,
  })),
);

export const UpdateRoleLazyPage = lazy(() =>
  import("./update-role.page").then((mod) => ({
    default: mod.UpdateRolePage,
  })),
);
