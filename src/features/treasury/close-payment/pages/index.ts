import { lazy } from "react";

export const ClosePaymentLazyPage = lazy(() =>
  import("./close-payment.page").then((mod) => ({
    default: mod.ClosePaymentPage,
  })),
);
