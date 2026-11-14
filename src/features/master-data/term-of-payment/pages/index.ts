import { lazy } from "react";

export const TermOfPaymentLazyPage = lazy(() =>
  import("./term-of-payment.page").then((mod) => ({
    default: mod.TermOfPaymentPage,
  })),
);
