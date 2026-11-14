/**
 * Term of Payment Feature Routes
 */

import { Route } from "react-router";
import { TERM_OF_PAYMENT_BASE } from "./data/term-of-payment.utils";
import { TermOfPaymentLazyPage } from "./pages";

export const termOfPaymentRoutes = (
  <Route>
    <Route path={TERM_OF_PAYMENT_BASE} element={<TermOfPaymentLazyPage />} />
  </Route>
);
