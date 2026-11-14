import { RECEIVABLE_DASHBOARD_PAGE_TITLE } from "@/features/receivable";
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
import { fmtIDR, fmtPct } from "@railfinance/core/lib";
import { Progress } from "@railfinance/core/ui/progress";
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  FileText,
  Percent,
  Receipt,
  Send,
  Timer,
  TrendingUp,
} from "lucide-react";

function renderRiskBadge(r: { risk: string }) {
  return <SimpleStatusBadge status={r.risk} />;
}

function renderStatusBadge(r: { status: string }) {
  return <SimpleStatusBadge status={r.status} />;
}

export function ReceivableDashboardPage() {
  const collectors = [
    { name: "Maya R.", target: 8_000_000_000, collected: 6_400_000_000 },
    { name: "Hadi P.", target: 6_000_000_000, collected: 5_700_000_000 },
    { name: "Dewi K.", target: 5_000_000_000, collected: 3_100_000_000 },
    { name: "Surya N.", target: 4_500_000_000, collected: 4_200_000_000 },
  ];
  return (
    <Page
      type="receivable"
      title={RECEIVABLE_DASHBOARD_PAGE_TITLE}
      breadcrumbs={[
        { title: "Receivable", url: "/receivable" },
        { title: "Dashboard", url: "/receivable/dashboard" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title={RECEIVABLE_DASHBOARD_PAGE_TITLE}
          description="Track billings, collection performance and aging buckets."
          withBackButton={false}
        />

        <AlertBanner
          items={[
            {
              level: "warning",
              title: "DSO trending up",
              description: "Current 42 days vs target 35 days",
            },
            {
              level: "critical",
              title: "3 customers > 60 days overdue",
              description: "Total exposure IDR 5.2B",
            },
          ]}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KpiCard
            label="Total Receivable"
            value={fmtIDR(142_800_000_000)}
            delta={3.6}
            icon={Receipt}
            tone="primary"
          />
          <KpiCard
            label="Monthly Billing"
            value={fmtIDR(38_400_000_000)}
            delta={6.2}
            icon={TrendingUp}
            tone="accent"
          />
          <KpiCard
            label="Collected"
            value={fmtIDR(28_900_000_000)}
            delta={2.4}
            icon={Banknote}
            tone="success"
          />
          <KpiCard
            label="Collection Rate"
            value="75.3%"
            delta={1.8}
            icon={Percent}
            tone="success"
          />
          <KpiCard
            label="Overdue Receivable"
            value={fmtIDR(9_200_000_000)}
            delta={4.1}
            icon={AlertTriangle}
            tone="destructive"
          />
          <KpiCard
            label="DSO"
            value="42 days"
            delta={3.2}
            icon={Timer}
            tone="warning"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard
            title="Billing Pipeline"
            description="Stages from request to settlement"
            className="lg:col-span-2"
          >
            <Chart
              type="bar"
              height={290}
              series={[{ name: "Amount (IDR Bn)", data: [42, 38, 31, 28, 22] }]}
              options={{
                xaxis: {
                  categories: [
                    "Request",
                    "Issued",
                    "Sent",
                    "Collected",
                    "Settled",
                  ],
                },
                plotOptions: {
                  bar: {
                    borderRadius: 6,
                    columnWidth: "55%",
                    distributed: true,
                  },
                },
                colors: ["#2563eb", "#3b82f6", "#0ea5e9", "#22c55e", "#14b8a6"],
                legend: { show: false },
              }}
            />
          </SectionCard>
          <SectionCard title="Receivable Aging">
            <Chart
              type="donut"
              height={290}
              series={[58, 22, 12, 8]}
              options={{
                labels: ["0-30 days", "31-60", "61-90", "> 90"],
                colors: ["#22c55e", "#f59e0b", "#fb923c", "#ef4444"],
              }}
            />
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard
            title="Collection Performance"
            description="Achievement vs target"
          >
            <Chart
              type="radialBar"
              height={290}
              series={[75, 88, 62]}
              options={{
                labels: ["Overall", "On-time", "High-risk"],
                plotOptions: {
                  radialBar: {
                    hollow: { size: "40%" },
                    dataLabels: { value: { fontSize: "14px" } },
                  },
                },
                colors: ["#2563eb", "#22c55e", "#f59e0b"],
              }}
            />
          </SectionCard>
          <SectionCard
            title="Monthly Collection Trend"
            className="lg:col-span-2"
          >
            <Chart
              type="line"
              height={290}
              series={[
                {
                  name: "Billed",
                  data: [22, 26, 28, 30, 32, 36, 38, 34, 40, 42, 38, 38],
                },
                {
                  name: "Collected",
                  data: [18, 22, 24, 26, 28, 30, 32, 29, 34, 36, 32, 30],
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
                stroke: { width: [3, 3], curve: "smooth" },
              }}
            />
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard
            title="Top Outstanding Customers"
            className="lg:col-span-2"
          >
            <SimpleTable
              columns={[
                { key: "name", header: "Customer" },
                {
                  key: "outstanding",
                  header: "Outstanding",
                  align: "right",
                  cell: (r) => fmtIDR(r.outstanding),
                },
                {
                  key: "overdue",
                  header: "Overdue",
                  align: "right",
                  cell: (r) => fmtIDR(r.overdue),
                },
                { key: "days", header: "Days" },
                {
                  key: "risk",
                  header: "Risk",
                  cell: renderRiskBadge,
                },
              ]}
              data={[
                {
                  name: "PT Mega Karya",
                  outstanding: 4_200_000_000,
                  overdue: 1_800_000_000,
                  days: 64,
                  risk: "overdue",
                },
                {
                  name: "PT Sumber Alam",
                  outstanding: 3_100_000_000,
                  overdue: 900_000_000,
                  days: 41,
                  risk: "pending",
                },
                {
                  name: "PT Berkah Jaya",
                  outstanding: 2_800_000_000,
                  overdue: 0,
                  days: 12,
                  risk: "active",
                },
                {
                  name: "PT Lintas Nusantara",
                  outstanding: 2_400_000_000,
                  overdue: 1_200_000_000,
                  days: 78,
                  risk: "overdue",
                },
                {
                  name: "PT Cipta Mandiri",
                  outstanding: 1_900_000_000,
                  overdue: 400_000_000,
                  days: 36,
                  risk: "pending",
                },
              ]}
            />
          </SectionCard>
          <SectionCard title="Billing Status">
            <Chart
              type="donut"
              height={290}
              series={[58, 18, 14, 10]}
              options={{
                labels: ["Paid", "Pending", "Overdue", "Draft"],
                colors: ["#22c55e", "#f59e0b", "#ef4444", "#94a3b8"],
              }}
            />
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard title="Billing Transactions" className="lg:col-span-2">
            <SimpleTable
              columns={[
                { key: "id", header: "Invoice" },
                { key: "customer", header: "Customer" },
                { key: "date", header: "Date" },
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
                  id: "BL-44120",
                  customer: "PT Mega Karya",
                  date: "Jun 04",
                  amount: 820_000_000,
                  status: "overdue",
                },
                {
                  id: "BL-44119",
                  customer: "PT Sumber Alam",
                  date: "Jun 04",
                  amount: 540_000_000,
                  status: "paid",
                },
                {
                  id: "BL-44118",
                  customer: "PT Berkah Jaya",
                  date: "Jun 03",
                  amount: 380_000_000,
                  status: "pending",
                },
                {
                  id: "BL-44117",
                  customer: "PT Cipta Mandiri",
                  date: "Jun 03",
                  amount: 290_000_000,
                  status: "paid",
                },
                {
                  id: "BL-44116",
                  customer: "PT Lintas Nusantara",
                  date: "Jun 02",
                  amount: 1_120_000_000,
                  status: "overdue",
                },
              ]}
            />
          </SectionCard>
          <SectionCard title="Collection by Collector">
            <div className="space-y-4">
              {collectors.map((c) => {
                const pct = (c.collected / c.target) * 100;
                return (
                  <div key={c.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium">{c.name}</span>
                      <span className="text-muted-foreground">
                        {fmtPct(pct, 0)}
                      </span>
                    </div>
                    <Progress value={pct} />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {fmtIDR(c.collected)} / {fmtIDR(c.target)}
                    </p>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Recent Activities">
          <ActivityFeed
            items={[
              {
                icon: CheckCircle2,
                title: "Payment received",
                description: "PT Berkah Jaya — IDR 380M",
                time: "8m ago",
                tone: "success",
              },
              {
                icon: Send,
                title: "Reminder sent",
                description: "5 customers — overdue notice",
                time: "1h ago",
                tone: "primary",
              },
              {
                icon: FileText,
                title: "New billing issued",
                description: "BL-44120 — PT Mega Karya",
                time: "3h ago",
                tone: "primary",
              },
              {
                icon: AlertTriangle,
                title: "Customer escalation",
                description: "PT Lintas Nusantara — 78 days",
                time: "5h ago",
                tone: "warning",
              },
            ]}
          />
        </SectionCard>
      </div>
    </Page>
  );
}

export default ReceivableDashboardPage;
