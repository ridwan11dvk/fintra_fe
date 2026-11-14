import { lazy } from "react";

export const TransactionTypeLazyPage = lazy(() =>
  import("./transaction-type.page").then((mod) => ({
    default: mod.TransactionTypePage,
  })),
);
