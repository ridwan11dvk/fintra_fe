import { lazy } from "react";

export const RegencyLazyPage = lazy(() =>
  import("./regency.page").then((mod) => ({
    default: mod.RegencyPage,
  })),
);
