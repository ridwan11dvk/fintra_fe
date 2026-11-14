import { lazy } from "react";

export const CashflowCategoryLazyPage = lazy(() =>
  import("./cashflow-category.page").then((mod) => ({
    default: mod.CashflowCategoryPage,
  })),
);

export const CashflowCategoryCreateLazyPage = lazy(() =>
  import("./cashflow-category-form.page").then((mod) => ({
    default: mod.CashflowCategoryCreatePage,
  })),
);

export const CashflowCategoryEditLazyPage = lazy(() =>
  import("./cashflow-category-form.page").then((mod) => ({
    default: mod.CashflowCategoryEditPage,
  })),
);

export const CashflowCategoryShowLazyPage = lazy(() =>
  import("./cashflow-category-form.page").then((mod) => ({
    default: mod.CashflowCategoryShowPage,
  })),
);
