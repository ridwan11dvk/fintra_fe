import { reportingDashboardRoutes } from "@/features/reporting/dashboard/routes";
import { Navigate, Route } from "react-router";

export const reportingRoutes = (
  <Route path="reporting">
    <Route index element={<Navigate to="dashboard" replace />} />

    {reportingDashboardRoutes}
  </Route>
);
