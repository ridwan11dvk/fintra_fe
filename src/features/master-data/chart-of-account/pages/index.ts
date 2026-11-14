import { lazy } from "react";

export const ChartOfAccountLazyPage = lazy(() =>
  import("./chart-of-account.page").then((mod) => ({
    default: mod.ChartOfAccountPage,
  })),
);

export const ChartOfAccountFormLazyPage = lazy(() =>
  import("./chart-of-account-form.page").then((mod) => ({
    default: mod.ChartOfAccountFormPage,
  })),
);

export const ChartOfAccountDetailLazyPage = lazy(() =>
  import("./chart-of-account-detail.page").then((mod) => ({
    default: mod.ChartOfAccountDetailPage,
  })),
);

export * from "./chart-of-account.page";
export * from "./chart-of-account-form.page";
export * from "./chart-of-account-detail.page";
