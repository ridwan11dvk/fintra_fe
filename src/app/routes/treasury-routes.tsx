import { closePaymentRoutes } from "@/features/treasury/close-payment/routes";
import { treasuryDashboardRoutes } from "@/features/treasury/dashboard/routes";
import { digitalVaultRoutes } from "@/features/treasury/digital-vault/routes";
import { depositRoutes } from "@/features/treasury/open-payment/routes";
import { lazy } from "react";
import { Navigate, Route } from "react-router";

const UnderConstructionPage = lazy(() =>
  import("@/features/errors").then((module) => ({
    default: module.UnderConstructionPage,
  })),
);

export const treasuryRoutes = (
  <Route path="treasury">
    <Route index element={<Navigate to="dashboard" replace />} />
    {treasuryDashboardRoutes}
    <Route path="incoming-payment">
      <Route index element={<Navigate to="close-payment" replace />} />
      {closePaymentRoutes}

      {depositRoutes}
      <Route path="settlement" element={<UnderConstructionPage />} />
      <Route path="receipt" element={<UnderConstructionPage />} />
    </Route>
    <Route path="outgoing-payment">
      <Route index element={<Navigate to="single-payment" replace />} />
      <Route path="single-payment" element={<UnderConstructionPage />} />
      <Route path="bulk-payment" element={<UnderConstructionPage />} />
      <Route path="autodebet" element={<UnderConstructionPage />} />
    </Route>
    <Route path="dropping" element={<UnderConstructionPage />} />

    {/* Digital Vault Routes */}
    {digitalVaultRoutes}
  </Route>
);
