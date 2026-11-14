import {
  monitoringDashboardRoutes,
  postingAssetLegacyRoutes,
  postingAssetRoutes,
  postingAutoLegacyRoutes,
  postingAutoRoutes,
} from "@/features/monitoring";
import { Navigate, Route } from "react-router";

export const monitoringRoutes = (
  <Route path="monitoring">
    <Route index element={<Navigate to="dashboard" replace />} />
    {monitoringDashboardRoutes}
    {postingAutoRoutes}
    {postingAssetRoutes}
    {postingAssetLegacyRoutes}
    {postingAutoLegacyRoutes}
  </Route>
);
