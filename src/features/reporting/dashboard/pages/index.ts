import { lazy } from "react";

export const ReportingDashboardLazyPage = lazy(() =>
  import("./reporting-dashboard.page").then((mod) => ({
    default: mod.ReportingDashboardPage,
  })),
);
