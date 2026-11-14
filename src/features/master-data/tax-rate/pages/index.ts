import { lazy } from "react";

export const TaxRateLazyPage = lazy(() =>
  import("./tax-rate.page").then((mod) => ({
    default: mod.TaxRatePage,
  })),
);
