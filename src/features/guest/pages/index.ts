import { lazy } from "react";

export const HomeLazyPage = lazy(() =>
  import("./home.page").then((mod) => ({
    default: mod.HomePage,
  })),
);

export const SelectModuleLazyPage = lazy(() =>
  import("./select-module.page").then((mod) => ({
    default: mod.SelectModulePage,
  })),
);
