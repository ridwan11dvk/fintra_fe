import { REPORTING_DASHBOARD_PAGE_TITLE } from "@/features/reporting";
import { Page } from "@railfinance/core/components/page-shell";

export function ReportingDashboardPage() {
  return (
    <Page type="reporting" title={REPORTING_DASHBOARD_PAGE_TITLE}>
      {REPORTING_DASHBOARD_PAGE_TITLE}
    </Page>
  );
}

export default ReportingDashboardPage;
