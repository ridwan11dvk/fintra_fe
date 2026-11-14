import { lazy } from "react";

export const CurrencyRateLazyPage = lazy(() =>
  import("./currency-rate.page").then((mod) => ({
    default: mod.CurrencyRatePage,
  })),
);
