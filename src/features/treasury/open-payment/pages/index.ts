import { lazy } from "react";

export const DepositLazyPage = lazy(() =>
  import("./deposit.page").then((mod) => ({
    default: mod.DepositPage,
  })),
);
