import { dashboardRoutes } from "@/features/dashboard/routes";
import { guestRoutes } from "@/features/guest";
import { notificationRoutes } from "@/features/notification/routes";
import {
  ErrorBoundary,
  ErrorFallback,
} from "@/shared/components/error-boundary";
import { PageLoader } from "@/shared/components/page-loader";
import { internalAuthRoutes } from "@railfinance/core/auth";
import { NotFoundContent } from "@railfinance/core/components/errors";
import { AuthLayout, GuestLayout, MainLayout } from "@railfinance/core/layouts";
import { profileRoutes } from "@railfinance/core/profile";
import { Suspense } from "react";
import { Route, Routes } from "react-router";
import { masterDataRoutes } from "./master-data-routes";
import { monitoringRoutes } from "./monitoring-routes";
import { payableRoutes } from "./payable-routes";
import { receivableRoutes } from "./receivable-routes";
import { reportingRoutes } from "./reporting-routes";
import { settingRoutes } from "./setting-routes";
import { taxRoutes } from "./tax-routes";
import { treasuryRoutes } from "./treasury-routes";

export default function AppRoutes() {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<AuthLayout />}>{internalAuthRoutes}</Route>
          <Route element={<MainLayout />}>
            {dashboardRoutes}

            {/* Profile Routes */}
            {profileRoutes}

            {/* Payable Routes */}
            {payableRoutes}

            {/* Receivable Routes */}
            {receivableRoutes}

            {/* Treasury Routes */}
            {treasuryRoutes}

            {/* Tax Routes */}
            {taxRoutes}

            {/* Reporting Routes */}
            {reportingRoutes}

            {/* Monitoring Routes */}
            {monitoringRoutes}

            {/* Notification Routes */}
            {notificationRoutes}

            {/* Setting Routes */}
            {settingRoutes}

            {/* Master Data Routes */}
            {masterDataRoutes}
          </Route>

          <Route element={<GuestLayout />}>{guestRoutes}</Route>
          <Route path="*" element={<NotFoundContent />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
