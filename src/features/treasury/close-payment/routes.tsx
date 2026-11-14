/**
 * Close Payment Feature Routes
 */

import { Route } from "react-router";
import { CLOSE_PAYMENT_BASE } from "./data/close-payment.utils";
import { ClosePaymentLazyPage } from "./pages";

export const closePaymentRoutes = (
  <Route path={CLOSE_PAYMENT_BASE} element={<ClosePaymentLazyPage />} />
);
