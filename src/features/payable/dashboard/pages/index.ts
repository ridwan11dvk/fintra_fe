import { lazy } from "react";

export const PayableDashboardLazyPage = lazy(() =>
  import("./payable-dashboard.page").then((mod) => ({
    default: mod.PayableDashboardPage,
  })),
);
