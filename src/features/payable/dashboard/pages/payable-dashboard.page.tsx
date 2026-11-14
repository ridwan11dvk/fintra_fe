import { PAYABLE_DASHBOARD_PAGE_TITLE } from "@/features/payable";
import { ActivityFeed } from "@railfinance/core/components/activity-feed";
import { AlertBanner } from "@railfinance/core/components/alert-banner";
import { SimpleStatusBadge } from "@railfinance/core/components/badges";
import {
  Chart,
  KpiCard,
  SectionCard,
} from "@railfinance/core/components/cards";
import { PageHeader } from "@railfinance/core/components/page-header";
import { Page } from "@railfinance/core/components/page-shell";
import { SimpleTable } from "@railfinance/core/components/simple-table";
import { fmtIDR } from "@railfinance/core/lib";
import { Button } from "@railfinance/core/ui/button";
import { Progress } from "@railfinance/core/ui/progress";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Coins,
  FileText,
  Plus,
  Receipt,
  Send,
  Timer,
  Wallet,
  XCircle,
} from "lucide-react";

function renderStatusBadge(r: { status: string }) {
  return <SimpleStatusBadge status={r.status} />;
}

export function PayableDashboardPage() {
  return (
    <Page
      type="payable"
      title={PAYABLE_DASHBOARD_PAGE_TITLE}
      breadcrumbs={[
        { title: "Payable", url: "/payable" },
        { title: "Dashboard", url: "/payable/dashboard" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Payable Dashboard"
          description="Monitor outstanding obligations, cash advances and approval pipeline."
          withBackButton={false}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KpiCard
            label="Outstanding Payables"
            value={fmtIDR(98_200_000_000)}
            delta={-2.1}
            icon={Wallet}
            tone="primary"
          />
          <KpiCard
            label="Due Today"
            value={fmtIDR(4_800_000_000)}
            delta={12}
            icon={Clock}
            tone="warning"
          />
          <KpiCard
            label="Overdue Amount"
            value={fmtIDR(2_100_000_000)}
            delta={5.4}
            icon={AlertTriangle}
            tone="destructive"
          />
          <KpiCard
            label="Cash Advance Out."
            value={fmtIDR(1_350_000_000)}
            delta={-1.2}
            icon={Coins}
            tone="accent"
          />
          <KpiCard
            label="Reimbursement Pending"
            value={fmtIDR(240_000_000)}
            delta={3.1}
            icon={Receipt}
            tone="warning"
          />
          <KpiCard
            label="Avg. Payment Cycle"
            value="18 days"
            delta={-4.5}
            icon={Timer}
            tone="success"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard
            title="Outstanding Payables Trend"
            description="Last 12 months (IDR Bn)"
            className="lg:col-span-2"
          >
            <Chart
              type="area"
              height={290}
              series={[
                {
                  name: "Outstanding",
                  data: [82, 86, 91, 88, 95, 99, 102, 108, 99, 101, 97, 98],
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
                  gradient: { opacityFrom: 0.6, opacityTo: 0.05 },
                },
              }}
            />
          </SectionCard>
          <SectionCard title="Payable Composition">
            <Chart
              type="donut"
              height={290}
              series={[58, 22, 12, 8]}
              options={{
                labels: [
                  "Vendor",
                  "Utilities",
                  "Cash Advance",
                  "Reimbursement",
                ],
              }}
            />
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard
            title="Cash Advance Monitoring"
            className="lg:col-span-2"
          >
            <SimpleTable
              columns={[
                { key: "id", header: "Reference" },
                { key: "holder", header: "Holder" },
                { key: "type", header: "Type" },
                {
                  key: "balance",
                  header: "Balance",
                  align: "right",
                  cell: (r) => fmtIDR(r.balance),
                },
                { key: "aging", header: "Aging" },
                {
                  key: "status",
                  header: "Status",
                  cell: renderStatusBadge,
                },
              ]}
              data={[
                {
                  id: "CA-1201",
                  holder: "Andi P.",
                  type: "Petty Cash",
                  balance: 25_000_000,
                  aging: "3 days",
                  status: "active",
                },
                {
                  id: "CA-1202",
                  holder: "Sari K.",
                  type: "Operational",
                  balance: 350_000_000,
                  aging: "12 days",
                  status: "pending",
                },
                {
                  id: "CA-1203",
                  holder: "Budi H.",
                  type: "Operational",
                  balance: 120_000_000,
                  aging: "21 days",
                  status: "overdue",
                },
                {
                  id: "CA-1204",
                  holder: "Lina M.",
                  type: "Petty Cash",
                  balance: 8_500_000,
                  aging: "1 day",
                  status: "active",
                },
              ]}
            />
          </SectionCard>
          <SectionCard title="Workflow Status">
            <Chart
              type="donut"
              height={290}
              series={[42, 18, 28, 12]}
              options={{
                labels: ["Approved", "Pending", "Processing", "Rejected"],
                colors: ["#22c55e", "#f59e0b", "#2563eb", "#ef4444"],
              }}
            />
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard title="Top 10 Due Payments" className="lg:col-span-2">
            <SimpleTable
              columns={[
                { key: "invoice", header: "Invoice" },
                { key: "vendor", header: "Vendor" },
                { key: "due", header: "Due" },
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
                  invoice: "INV-9921",
                  vendor: "PT Sinar Mas",
                  due: "Jun 06",
                  amount: 1_240_000_000,
                  status: "pending",
                },
                {
                  invoice: "INV-9918",
                  vendor: "PT Astra Mitra",
                  due: "Jun 07",
                  amount: 980_000_000,
                  status: "approved",
                },
                {
                  invoice: "INV-9911",
                  vendor: "PT Wijaya Karya",
                  due: "Jun 05",
                  amount: 720_000_000,
                  status: "overdue",
                },
                {
                  invoice: "INV-9907",
                  vendor: "CV Karya Abadi",
                  due: "Jun 08",
                  amount: 540_000_000,
                  status: "pending",
                },
                {
                  invoice: "INV-9899",
                  vendor: "PT Gunung Madu",
                  due: "Jun 09",
                  amount: 410_000_000,
                  status: "processing",
                },
                {
                  invoice: "INV-9882",
                  vendor: "PT Garuda Indah",
                  due: "Jun 10",
                  amount: 380_000_000,
                  status: "pending",
                },
              ]}
            />
          </SectionCard>
          <SectionCard title="Pending by Approver">
            <Chart
              type="bar"
              height={290}
              series={[{ name: "Pending", data: [18, 14, 9, 7, 5, 3] }]}
              options={{
                plotOptions: {
                  bar: { horizontal: true, borderRadius: 4, barHeight: "60%" },
                },
                xaxis: {
                  categories: [
                    "Lestari A.",
                    "Hadi S.",
                    "Rahmat B.",
                    "Dewi K.",
                    "Surya P.",
                    "Maya R.",
                  ],
                },
                colors: ["#2563eb"],
              }}
            />
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard
            title="Approval Bottleneck Trend"
            className="lg:col-span-2"
            description="Avg approval lead time (hours)"
          >
            <Chart
              type="line"
              height={260}
              series={[
                {
                  name: "Avg Lead Time",
                  data: [12, 14, 18, 22, 19, 24, 28, 22, 18, 16, 14, 12],
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
                stroke: { width: 3, curve: "smooth" },
                colors: ["#f59e0b"],
              }}
            />
          </SectionCard>
          <SectionCard title="Recent Activity">
            <ActivityFeed
              items={[
                {
                  icon: CheckCircle2,
                  title: "INV-9918 approved",
                  description: "PT Astra Mitra",
                  time: "5m ago",
                  tone: "success",
                },
                {
                  icon: Send,
                  title: "Bulk payment sent",
                  description: "42 items via BCA",
                  time: "30m ago",
                  tone: "primary",
                },
                {
                  icon: XCircle,
                  title: "INV-9870 rejected",
                  description: "Missing PO reference",
                  time: "1h ago",
                  tone: "destructive",
                },
                {
                  icon: FileText,
                  title: "New reimbursement",
                  description: "Travel — Hadi S.",
                  time: "2h ago",
                  tone: "warning",
                },
              ]}
            />
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard title="Alerts & Exceptions" className="lg:col-span-2">
            <AlertBanner
              items={[
                {
                  level: "critical",
                  title: "3 invoices overdue > 30 days",
                  description: "Exposure IDR 1.1B — escalate to AP Lead",
                },
                {
                  level: "warning",
                  title: "Cash advance > 21 days unsettled",
                  description: "CA-1203 — Budi H.",
                },
                {
                  level: "info",
                  title: "Weekly disbursement run scheduled",
                  description: "Friday 16:00 WIB",
                },
              ]}
            />
          </SectionCard>
          <SectionCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start">
                <Plus className="h-4 w-4 mr-2" />
                New Payable
              </Button>
              <Button variant="outline" className="justify-start">
                <Receipt className="h-4 w-4 mr-2" />
                Reimbursement
              </Button>
              <Button variant="outline" className="justify-start">
                <Coins className="h-4 w-4 mr-2" />
                Cash Advance
              </Button>
              <Button variant="outline" className="justify-start">
                <Send className="h-4 w-4 mr-2" />
                Bulk Payment
              </Button>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">
                  Monthly Budget Used
                </span>
                <span className="font-medium">68%</span>
              </div>
              <Progress value={68} />
            </div>
          </SectionCard>
        </div>
      </div>
    </Page>
  );
}

export default PayableDashboardPage;
