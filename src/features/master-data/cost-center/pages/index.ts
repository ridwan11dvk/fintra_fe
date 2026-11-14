import { lazy } from "react";

export const CostCenterLazyPage = lazy(() =>
  import("./cost-center.page").then((mod) => ({
    default: mod.CostCenterPage,
  })),
);
