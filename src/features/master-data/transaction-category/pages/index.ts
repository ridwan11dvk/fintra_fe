import { lazy } from "react";

export const TransactionCategoryLazyPage = lazy(() =>
  import("./transaction-category.page").then((mod) => ({
    default: mod.TransactionCategoryPage,
  })),
);
