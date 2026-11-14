import { lazy } from "react";

export const CashflowGroupLazyPage = lazy(() =>
  import("./cashflow-group.page").then((mod) => ({
    default: mod.CashflowGroupPage,
  })),
);

export const CashflowGroupCreateLazyPage = lazy(() =>
  import("./cashflow-group-form.page").then((mod) => ({
    default: mod.CashflowGroupCreatePage,
  })),
);

export const CashflowGroupEditLazyPage = lazy(() =>
  import("./cashflow-group-form.page").then((mod) => ({
    default: mod.CashflowGroupEditPage,
  })),
);

export const CashflowGroupShowLazyPage = lazy(() =>
  import("./cashflow-group-form.page").then((mod) => ({
    default: mod.CashflowGroupShowPage,
  })),
);
