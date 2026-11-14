import { lazy } from "react";

export const CurrencyLazyPage = lazy(() =>
  import("./currency.page").then((mod) => ({
    default: mod.CurrencyPage,
  })),
);
