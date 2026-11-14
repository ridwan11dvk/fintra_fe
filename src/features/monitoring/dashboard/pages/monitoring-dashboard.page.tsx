import { MONITORING_DASHBOARD_PAGE_TITLE } from "@/features/monitoring";
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
import { Card, CardContent } from "@railfinance/core/ui/card";
import { Progress } from "@railfinance/core/ui/progress";
import {
  Activity,
  AlertCircle,
  ArrowDownCircle,
  CheckCircle2,
  FileClock,
  Percent,
  ShieldCheck,
  XCircle,
} from "lucide-react";

function renderSeverityBadge(r: { severity: string }) {
  return <SimpleStatusBadge status={r.severity} />;
}

function renderStatusBadge(r: { status: string }) {
  return <SimpleStatusBadge status={r.status} />;
}

export function MonitoringDashboardPage() {
  return (
    <Page
      type="monitoring"
      title={MONITORING_DASHBOARD_PAGE_TITLE}
      breadcrumbs={[
        { title: "Monitoring", url: "/monitoring" },
        { title: "Dashboard", url: "/monitoring/dashboard" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title="Monitoring Dashboard"
          description="System health, posting status and SLA compliance."
          withBackButton={false}
        />

        <AlertBanner
          items={[
            {
              level: "critical",
              title: "Posting failure spike",
              description: "23 errors in last hour — GL mapping issue",
            },
            {
              level: "warning",
              title: "SLA breach risk",
              description: "8 invoices > 4 hours pending",
            },
          ]}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KpiCard
            label="Pending Invoice Post"
            value="142"
            delta={-4.2}
            icon={FileClock}
            tone="warning"
          />
          <KpiCard
            label="Failed Invoice Post"
            value="23"
            delta={6.1}
            icon={XCircle}
            tone="destructive"
          />
          <KpiCard
            label="Pending Payment Post"
            value="68"
            delta={2.1}
            icon={ArrowDownCircle}
            tone="warning"
          />
          <KpiCard
            label="Failed Payment Post"
            value="9"
            delta={-12}
            icon={XCircle}
            tone="destructive"
          />
          <KpiCard
            label="Success Rate"
            value="96.4%"
            delta={0.8}
            icon={Percent}
            tone="success"
          />
          <KpiCard
            label="SLA Compliance"
            value="93.1%"
            delta={1.2}
            icon={ShieldCheck}
            tone="success"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard title="Invoice Posting Monitoring">
            <Chart
              type="donut"
              height={280}
              series={[820, 142, 23]}
              options={{
                labels: ["Posted", "Pending", "Failed"],
                colors: ["#22c55e", "#f59e0b", "#ef4444"],
              }}
            />
          </SectionCard>
          <SectionCard title="Incoming Payment Posting Monitoring">
            <Chart
              type="donut"
              height={280}
              series={[612, 68, 9]}
              options={{
                labels: ["Posted", "Pending", "Failed"],
                colors: ["#22c55e", "#f59e0b", "#ef4444"],
              }}
            />
          </SectionCard>
          <SectionCard title="Processing Distribution">
            <Chart
              type="donut"
              height={280}
              series={[44, 26, 18, 12]}
              options={{ labels: ["Auto", "Manual", "Batch", "Retry"] }}
            />
          </SectionCard>
        </div>

        <SectionCard
          title="Posting Trend"
          description="Last 14 days success vs failed"
        >
          <Chart
            type="line"
            height={300}
            series={[
              {
                name: "Success",
                type: "column",
                data: [
                  820, 790, 840, 880, 910, 870, 920, 880, 900, 940, 950, 920,
                  960, 980,
                ],
              },
              {
                name: "Failed",
                type: "column",
                data: [22, 28, 18, 24, 31, 20, 19, 24, 22, 18, 16, 21, 17, 23],
              },
              {
                name: "Success Rate %",
                type: "line",
                data: [
                  97.4, 96.6, 97.9, 97.4, 96.7, 97.8, 98, 97.4, 97.6, 98.1,
                  98.3, 97.7, 98.3, 97.7,
                ],
              },
            ]}
            options={{
              stroke: { width: [0, 0, 3] },
              xaxis: {
                categories: Array.from(
                  { length: 14 },
                  (_, i) => `Day ${i + 1}`,
                ),
              },
              yaxis: [
                { title: { text: "Count" } },
                {},
                {
                  opposite: true,
                  title: { text: "Success %" },
                  min: 90,
                  max: 100,
                },
              ],
              colors: ["#22c55e", "#ef4444", "#2563eb"],
              plotOptions: { bar: { columnWidth: "60%", borderRadius: 3 } },
            }}
          />
        </SectionCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectionCard title="Error Analysis">
            <SimpleTable
              columns={[
                { key: "code", header: "Code" },
                { key: "msg", header: "Error" },
                { key: "count", header: "Count", align: "right" },
                {
                  key: "severity",
                  header: "Severity",
                  cell: renderSeverityBadge,
                },
              ]}
              data={[
                {
                  code: "GL-401",
                  msg: "GL mapping not found",
                  count: 12,
                  severity: "overdue",
                },
                {
                  code: "VND-220",
                  msg: "Vendor master missing",
                  count: 8,
                  severity: "pending",
                },
                {
                  code: "FX-501",
                  msg: "FX rate not available",
                  count: 5,
                  severity: "pending",
                },
                {
                  code: "TAX-330",
                  msg: "Tax code invalid",
                  count: 4,
                  severity: "pending",
                },
                {
                  code: "DOC-110",
                  msg: "Duplicate reference",
                  count: 3,
                  severity: "open",
                },
              ]}
            />
          </SectionCard>
          <SectionCard title="Real-Time Activity Feed">
            <ActivityFeed
              items={[
                {
                  icon: CheckCircle2,
                  title: "Batch posted",
                  description: "120 invoices — BCA",
                  time: "Just now",
                  tone: "success",
                },
                {
                  icon: AlertCircle,
                  title: "Retry triggered",
                  description: "GL-401 — 12 items",
                  time: "1m ago",
                  tone: "warning",
                },
                {
                  icon: XCircle,
                  title: "Posting failed",
                  description: "INV-90211 — GL mapping",
                  time: "3m ago",
                  tone: "destructive",
                },
                {
                  icon: Activity,
                  title: "Reconciliation complete",
                  description: "Mandiri 14:00 batch",
                  time: "8m ago",
                  tone: "primary",
                },
              ]}
            />
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard title="SLA Monitoring" className="lg:col-span-2">
            <SimpleTable
              columns={[
                { key: "process", header: "Process" },
                { key: "sla", header: "SLA" },
                { key: "actual", header: "Actual" },
                { key: "compliance", header: "Compliance" },
                {
                  key: "status",
                  header: "Status",
                  cell: renderStatusBadge,
                },
              ]}
              data={[
                {
                  process: "Invoice Posting",
                  sla: "4h",
                  actual: "2.8h",
                  compliance: "97%",
                  status: "active",
                },
                {
                  process: "Payment Posting",
                  sla: "2h",
                  actual: "1.6h",
                  compliance: "94%",
                  status: "active",
                },
                {
                  process: "Reconciliation",
                  sla: "End of day",
                  actual: "21:40",
                  compliance: "91%",
                  status: "pending",
                },
                {
                  process: "Approval",
                  sla: "1d",
                  actual: "1.3d",
                  compliance: "82%",
                  status: "overdue",
                },
              ]}
            />
          </SectionCard>
          <SectionCard title="System Health">
            <div className="space-y-4">
              {[
                { label: "API Gateway", value: 99 },
                { label: "Posting Engine", value: 96 },
                { label: "Bank Integration", value: 92 },
                { label: "Tax Engine", value: 98 },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{s.label}</span>
                    <span
                      className={
                        s.value >= 95 ? "text-success" : "text-warning"
                      }
                    >
                      {s.value}%
                    </span>
                  </div>
                  <Progress value={s.value} />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Open Invoices", value: "1,248" },
            { label: "Open Payments", value: "682" },
            { label: "In Reconciliation", value: "184" },
            { label: "Awaiting Approval", value: "92" },
          ].map((s) => (
            <Card key={s.label} className="shadow-card">
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {s.label}
                </p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Page>
  );
}

export default MonitoringDashboardPage;
