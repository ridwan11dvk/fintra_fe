import { lazy } from "react";

export const ReceivableDashboardLazyPage = lazy(() =>
  import("./receivable-dashboard.page").then((mod) => ({
    default: mod.ReceivableDashboardPage,
  })),
);
