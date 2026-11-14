import { lazy } from "react";

export const UserLazyPage = lazy(() =>
  import("./user.page").then((mod) => ({
    default: mod.UserPage,
  })),
);

export const AddInternalUserLazyPage = lazy(() =>
  import("./add-internal.page").then((mod) => ({
    default: mod.AddInternalUserPage,
  })),
);

export const EditInternalUserLazyPage = lazy(() =>
  import("./edit-internal.page").then((mod) => ({
    default: mod.EditInternalUserPage,
  })),
);

export const ShowInternalUserLazyPage = lazy(() =>
  import("./show-internal.page").then((mod) => ({
    default: mod.ShowInternalUserPage,
  })),
);

export const AddExternalUserLazyPage = lazy(() =>
  import("./add-external.page").then((mod) => ({
    default: mod.AddExternalUserPage,
  })),
);

export const EditExternalUserLazyPage = lazy(() =>
  import("./edit-external.page").then((mod) => ({
    default: mod.EditExternalUserPage,
  })),
);

export const ShowExternalUserLazyPage = lazy(() =>
  import("./show-external.page").then((mod) => ({
    default: mod.ShowExternalUserPage,
  })),
);
