import { lazy } from "react";

export const GLAccountLazyPage = lazy(() =>
  import("./gl-account.page").then((mod) => ({
    default: mod.GLAccountPage,
  })),
);
