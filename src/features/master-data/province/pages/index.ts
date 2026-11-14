import { lazy } from "react";

export const ProvinceLazyPage = lazy(() =>
  import("./province.page").then((mod) => ({
    default: mod.ProvincePage,
  })),
);
