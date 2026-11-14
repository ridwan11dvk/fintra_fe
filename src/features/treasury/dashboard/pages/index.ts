import { lazy } from "react";

export const TreasuryDashboardLazyPage = lazy(() =>
  import("./treasury-dashboard.page").then((mod) => ({
    default: mod.TreasuryDashboardPage,
  })),
);
