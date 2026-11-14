import { receivableDashboardRoutes } from "@/features/receivable/dashboard/routes";
import { lazy } from "react";
import { Navigate, Route } from "react-router";

const UnderConstructionPage = lazy(() =>
  import("@/features/errors").then((module) => ({
    default: module.UnderConstructionPage,
  })),
);
export const receivableRoutes = (
  <Route path="receivable">
    <Route index element={<Navigate to="dashboard" replace />} />
    {receivableDashboardRoutes}
    <Route path="billing-request" element={<UnderConstructionPage />} />
    <Route path="billing-transaction" element={<UnderConstructionPage />} />
    <Route path="collector-performance" element={<UnderConstructionPage />} />
  </Route>
);
