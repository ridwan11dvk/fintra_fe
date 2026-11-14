import { lazy } from "react";

export const MonitoringDashboardLazyPage = lazy(() =>
  import("./monitoring-dashboard.page").then((mod) => ({
    default: mod.MonitoringDashboardPage,
  })),
);
