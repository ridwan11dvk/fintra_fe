import {
  CalendarSection,
  DASHBOARD_LIST_PAGE_TITLE,
  DASHBOARD_URL,
} from "@/features/dashboard";
import { ActivityFeed } from "@railfinance/core/components/activity-feed";
import { AlertBanner } from "@railfinance/core/components/alert-banner";
import { Chart, KpiCard, SectionCard } from "@railfinance/core/components/cards";
import { fmtCompact, fmtIDR } from "@railfinance/core/lib";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { SimpleStatusBadge } from "@railfinance/core/components/badges";
import { SimpleTable } from "@railfinance/core/components/simple-table";
import {
  Activity,
  AlertTriangle,
  Calculator,
  CheckCircle2,
  CreditCard,
  FileText,
  Landmark,
  Receipt,
  Wallet,
} from "lucide-react";

function renderStatusBadge(r: { status: string }) {
  return <SimpleStatusBadge status={r.status} />;
}

export function DashboardPage() {
  return (
    <Page
      type="base"
      title={DASHBOARD_LIST_PAGE_TITLE}
      breadcrumbs={[
        { title: "Home", url: "#" },
        { title: DASHBOARD_LIST_PAGE_TITLE, url: DASHBOARD_URL },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Finance Operations Control Tower"
          description="Real-time view of payable, receivable, treasury and tax positions."
          withBackButton={false}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Cash Position"
            value={fmtIDR(284_500_000_000)}
            delta={4.2}
            icon={Landmark}
            tone="primary"
          />
          <KpiCard
            label="Total Payable"
            value={fmtIDR(98_200_000_000)}
            delta={-2.1}
            icon={Wallet}
            tone="warning"
          />
          <KpiCard
            label="Total Receivable"
            value={fmtIDR(142_800_000_000)}
            delta={3.6}
            icon={Receipt}
            tone="accent"
          />
          <KpiCard
            label="Tax Liability"
            value={fmtIDR(31_400_000_000)}
            delta={1.8}
            icon={Calculator}
            tone="destructive"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard
            title="Cash Flow (12 months)"
            description="Operational inflow vs outflow"
            className="lg:col-span-2"
          >
            <Chart
              type="area"
              height={300}
              series={[
                {
                  name: "Inflow",
                  data: [
                    120, 132, 101, 134, 190, 230, 210, 260, 220, 240, 290, 310,
                  ],
                },
                {
                  name: "Outflow",
                  data: [
                    90, 105, 110, 120, 150, 170, 180, 210, 190, 200, 230, 250,
                  ],
                },
              ]}
              options={{
                xaxis: {
                  categories: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ],
                },
                fill: {
                  type: "gradient",
                  gradient: { opacityFrom: 0.5, opacityTo: 0.05 },
                },
                yaxis: {
                  labels: { formatter: (v) => fmtCompact(v * 1_000_000_000) },
                },
              }}
            />
          </SectionCard>
          {/* <SectionCard
            title="Module Distribution"
            description="By transaction volume"
          >
            <Chart
              type="donut"
              height={300}
              series={[42, 28, 18, 12]}
              options={{ labels: ["Payable", "Receivable", "Treasury", "Tax"] }}
            />
          </SectionCard> */}
          <CalendarSection />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard title="Recent Activity" className="lg:col-span-2">
            <ActivityFeed
              items={[
                {
                  icon: CheckCircle2,
                  title: "Vendor payment approved",
                  description: "PT Sinar Mas — IDR 1.2B",
                  time: "2 min ago",
                  tone: "success",
                },
                {
                  icon: FileText,
                  title: "New billing request",
                  description: "Invoice INV-2026-00482 created",
                  time: "12 min ago",
                  tone: "primary",
                },
                {
                  icon: AlertTriangle,
                  title: "Overdue alert",
                  description: "PT Garuda Indah — 14 days overdue",
                  time: "32 min ago",
                  tone: "warning",
                },
                {
                  icon: CreditCard,
                  title: "Bulk payment executed",
                  description: "BCA — 42 payments — IDR 8.7B",
                  time: "1h ago",
                  tone: "success",
                },
                {
                  icon: Activity,
                  title: "Posting failed",
                  description: "Invoice IP-90211 — GL mapping error",
                  time: "2h ago",
                  tone: "destructive",
                },
              ]}
            />
          </SectionCard>
          <SectionCard title="Critical Alerts">
            <AlertBanner
              items={[
                {
                  level: "critical",
                  title: "12 overdue invoices > 30 days",
                  description: "Total exposure IDR 4.2B",
                  time: "Now",
                },
                {
                  level: "warning",
                  title: "VAT filing due in 3 days",
                  description: "April period — draft incomplete",
                },
                {
                  level: "info",
                  title: "FX rate updated",
                  description: "USD/IDR refreshed at 09:00 WIB",
                },
              ]}
            />
          </SectionCard>
        </div>

        <SectionCard title="Top Pending Approvals">
          <SimpleTable
            columns={[
              { key: "id", header: "Reference" },
              { key: "type", header: "Type" },
              { key: "requester", header: "Requester" },
              {
                key: "amount",
                header: "Amount",
                align: "right",
                cell: (r) => fmtIDR(r.amount),
              },
              {
                key: "status",
                header: "Status",
                cell: renderStatusBadge,
              },
            ]}
            data={[
              {
                id: "VP-00821",
                type: "Vendor Payment",
                requester: "Lestari A.",
                amount: 1_240_000_000,
                status: "pending",
              },
              {
                id: "RB-00712",
                type: "Reimbursement",
                requester: "Hadi S.",
                amount: 12_500_000,
                status: "pending",
              },
              {
                id: "BP-00120",
                type: "Bulk Payment",
                requester: "Treasury Ops",
                amount: 8_900_000_000,
                status: "processing",
              },
              {
                id: "TX-00301",
                type: "Tax Deposit",
                requester: "Tax Team",
                amount: 540_000_000,
                status: "approved",
              },
            ]}
          />
        </SectionCard>
      </div>
    </Page>
  );
}

export default DashboardPage;
