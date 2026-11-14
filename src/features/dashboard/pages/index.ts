import { lazy } from "react";

export const DashboardLazyPage = lazy(() =>
  import("./dashboard.page").then((mod) => ({
    default: mod.DashboardPage,
  })),
);
