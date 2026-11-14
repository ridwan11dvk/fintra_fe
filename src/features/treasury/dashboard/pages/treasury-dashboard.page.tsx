import { TREASURY_DASHBOARD_PAGE_TITLE } from "@/features/treasury";
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
import {
  ArrowDownCircle,
  ArrowUpCircle,
  FileClock,
  Landmark,
  Vault,
  Wallet,
} from "lucide-react";

function renderStatusBadge(r: { status: string }) {
  return <SimpleStatusBadge status={r.status} />;
}

function renderAmountWithColor(r: { amount: number }) {
  return (
    <span className={r.amount > 0 ? "text-success" : "text-destructive"}>
      {fmtIDR(r.amount)}
    </span>
  );
}

function renderNetAmount(r: { inflow: number; outflow: number }) {
  const net = r.inflow - r.outflow;
  return (
    <span className={net >= 0 ? "text-success" : "text-destructive"}>
      {fmtIDR(net)}
    </span>
  );
}

export function TreasuryDashboardPage() {
  return (
    <Page
      type="treasury"
      title={TREASURY_DASHBOARD_PAGE_TITLE}
      breadcrumbs={[
        { title: "Treasury", url: "/treasury" },
        { title: "Dashboard", url: "/treasury/dashboard" },
      ]}
    >
      <div className="space-y-6">
        <PageHeader
          title={TREASURY_DASHBOARD_PAGE_TITLE}
          description="Real-time cash position, payments and forecast."
          withBackButton={false}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KpiCard
            label="Bank Balance"
            value={fmtIDR(284_500_000_000)}
            delta={1.2}
            icon={Landmark}
            tone="primary"
          />
          <KpiCard
            label="Incoming Today"
            value={fmtIDR(6_800_000_000)}
            delta={8.4}
            icon={ArrowDownCircle}
            tone="success"
          />
          <KpiCard
            label="Outgoing Today"
            value={fmtIDR(4_200_000_000)}
            delta={-3.1}
            icon={ArrowUpCircle}
            tone="warning"
          />
          <KpiCard
            label="Open Payment"
            value={fmtIDR(12_400_000_000)}
            delta={2.2}
            icon={FileClock}
            tone="accent"
          />
          <KpiCard
            label="Deposit Box"
            value={fmtIDR(45_000_000_000)}
            delta={0.4}
            icon={Vault}
            tone="primary"
          />
          <KpiCard
            label="Net Cash Position"
            value={fmtIDR(228_500_000_000)}
            delta={2.6}
            icon={Wallet}
            tone="success"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard
            title="Cash Position Summary"
            description="Across all bank accounts"
          >
            <div className="space-y-3">
              {[
                { bank: "BCA Operasional", amount: 124_000_000_000 },
                { bank: "Mandiri Payroll", amount: 64_000_000_000 },
                { bank: "BNI Treasury", amount: 52_000_000_000 },
                { bank: "BRI Collection", amount: 44_500_000_000 },
              ].map((b) => (
                <div
                  key={b.bank}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/40"
                >
                  <span className="text-sm font-medium">{b.bank}</span>
                  <span className="text-sm font-bold">{fmtIDR(b.amount)}</span>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="7-day Cash Flow Trend" className="lg:col-span-2">
            <Chart
              type="line"
              height={290}
              series={[
                { name: "Inflow", data: [6.2, 5.8, 7.1, 4.9, 6.8, 8.2, 7.4] },
                { name: "Outflow", data: [4.1, 5.2, 6, 3.8, 4.2, 5.8, 4.6] },
              ]}
              options={{
                xaxis: {
                  categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                },
                colors: ["#22c55e", "#ef4444"],
                stroke: { width: 3, curve: "smooth" },
              }}
            />
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard title="House Bank Distribution">
            <Chart
              type="donut"
              height={290}
              series={[44, 22, 18, 16]}
              options={{ labels: ["BCA", "Mandiri", "BNI", "BRI"] }}
            />
          </SectionCard>
          <SectionCard
            title="Incoming Payment Summary"
            className="lg:col-span-2"
          >
            <SimpleTable
              columns={[
                { key: "id", header: "Reference" },
                { key: "payer", header: "Payer" },
                { key: "bank", header: "Bank" },
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
                  id: "IN-3120",
                  payer: "PT Berkah Jaya",
                  bank: "BCA",
                  amount: 380_000_000,
                  status: "posted",
                },
                {
                  id: "IN-3119",
                  payer: "PT Sumber Alam",
                  bank: "Mandiri",
                  amount: 540_000_000,
                  status: "open",
                },
                {
                  id: "IN-3118",
                  payer: "PT Cipta Mandiri",
                  bank: "BNI",
                  amount: 290_000_000,
                  status: "processing",
                },
                {
                  id: "IN-3117",
                  payer: "PT Mega Karya",
                  bank: "BCA",
                  amount: 1_120_000_000,
                  status: "posted",
                },
              ]}
            />
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectionCard title="Outgoing Payment Summary">
            <SimpleTable
              columns={[
                { key: "id", header: "Reference" },
                { key: "vendor", header: "Vendor" },
                { key: "type", header: "Type" },
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
                  id: "OUT-8101",
                  vendor: "PT Sinar Mas",
                  type: "Single",
                  amount: 1_240_000_000,
                  status: "processing",
                },
                {
                  id: "OUT-8102",
                  vendor: "Multiple",
                  type: "Bulk",
                  amount: 8_900_000_000,
                  status: "approved",
                },
                {
                  id: "OUT-8103",
                  vendor: "PLN",
                  type: "Autodebet",
                  amount: 320_000_000,
                  status: "posted",
                },
              ]}
            />
          </SectionCard>
          <SectionCard title="Open Items">
            <SimpleTable
              columns={[
                { key: "id", header: "Reference" },
                { key: "aging", header: "Aging" },
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
                  id: "OP-201",
                  aging: "5 days",
                  amount: 420_000_000,
                  status: "open",
                },
                {
                  id: "OP-202",
                  aging: "9 days",
                  amount: 1_800_000_000,
                  status: "pending",
                },
                {
                  id: "OP-203",
                  aging: "14 days",
                  amount: 640_000_000,
                  status: "overdue",
                },
              ]}
            />
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard title="Treasury Alerts">
            <AlertBanner
              items={[
                {
                  level: "critical",
                  title: "BCA Operasional below threshold",
                  description: "Below IDR 150B floor",
                },
                {
                  level: "warning",
                  title: "Unreconciled receipts",
                  description: "12 items pending settlement",
                },
                {
                  level: "info",
                  title: "FX hedge expires in 7 days",
                  description: "USD 2M forward contract",
                },
              ]}
            />
          </SectionCard>
          <SectionCard title="Recent Transactions" className="lg:col-span-2">
            <SimpleTable
              columns={[
                { key: "time", header: "Time" },
                { key: "desc", header: "Description" },
                { key: "bank", header: "Bank" },
                {
                  key: "amount",
                  header: "Amount",
                  align: "right",
                  cell: renderAmountWithColor,
                },
              ]}
              data={[
                {
                  time: "14:22",
                  desc: "Customer collection",
                  bank: "BCA",
                  amount: 380_000_000,
                },
                {
                  time: "13:50",
                  desc: "Vendor payment",
                  bank: "Mandiri",
                  amount: -540_000_000,
                },
                {
                  time: "12:18",
                  desc: "Tax payment",
                  bank: "BNI",
                  amount: -120_000_000,
                },
                {
                  time: "11:40",
                  desc: "Customer collection",
                  bank: "BCA",
                  amount: 1_120_000_000,
                },
              ]}
            />
          </SectionCard>
        </div>

        <SectionCard title="Cash Forecast — Next 7 Days">
          <SimpleTable
            columns={[
              { key: "day", header: "Day" },
              {
                key: "inflow",
                header: "Inflow",
                align: "right",
                cell: (r) => fmtIDR(r.inflow),
              },
              {
                key: "outflow",
                header: "Outflow",
                align: "right",
                cell: (r) => fmtIDR(r.outflow),
              },
              {
                key: "net",
                header: "Net",
                align: "right",
                cell: renderNetAmount,
              },
              {
                key: "closing",
                header: "Closing Position",
                align: "right",
                cell: (r) => fmtIDR(r.closing),
              },
            ]}
            data={[
              {
                day: "Mon Jun 09",
                inflow: 6_200_000_000,
                outflow: 4_100_000_000,
                closing: 286_600_000_000,
              },
              {
                day: "Tue Jun 10",
                inflow: 5_800_000_000,
                outflow: 5_200_000_000,
                closing: 287_200_000_000,
              },
              {
                day: "Wed Jun 11",
                inflow: 7_100_000_000,
                outflow: 6_000_000_000,
                closing: 288_300_000_000,
              },
              {
                day: "Thu Jun 12",
                inflow: 4_900_000_000,
                outflow: 3_800_000_000,
                closing: 289_400_000_000,
              },
              {
                day: "Fri Jun 13",
                inflow: 6_800_000_000,
                outflow: 4_200_000_000,
                closing: 292_000_000_000,
              },
              {
                day: "Sat Jun 14",
                inflow: 1_200_000_000,
                outflow: 800_000_000,
                closing: 292_400_000_000,
              },
              {
                day: "Sun Jun 15",
                inflow: 600_000_000,
                outflow: 400_000_000,
                closing: 292_600_000_000,
              },
            ]}
          />
        </SectionCard>
      </div>
    </Page>
  );
}

export default TreasuryDashboardPage;
