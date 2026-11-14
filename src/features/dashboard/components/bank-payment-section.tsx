import { Button } from "@railfinance/core/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@railfinance/core/ui/card";
import { formatCurrency } from "@railfinance/core/lib";
import { Filter } from "lucide-react";
import { useMemo } from "react";
import Chart from "react-apexcharts";

interface BankPaymentData {
  bank: string;
  balance: number;
  color: string;
}

const bankPaymentData: BankPaymentData[] = [
  { bank: "BNI", balance: 85103507835, color: "#FF5733" },
  { bank: "BCA", balance: 84765646326, color: "#1E40AF" },
  { bank: "BRI", balance: 35014116544, color: "#1E3A8A" },
  { bank: "BMRI", balance: 17006131890, color: "#0F172A" },
  { bank: "BSI", balance: 1067057653, color: "#0D7377" },
  { bank: "FIN", balance: 500000000, color: "#D32F2F" },
  { bank: "BJTG", balance: 300000000, color: "#F39C12" },
  { bank: "BSB", balance: 200000000, color: "#27AE60" },
];

export function BankPaymentSection() {
  const chartOptions = useMemo(
    () => ({
      chart: {
        type: "donut" as const,
      },
      colors: bankPaymentData.map((item) => item.color),
      labels: bankPaymentData.map((item) => item.bank),
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: "left" as const,
        fontSize: "12",
        markers: {
          size: 4,
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
          },
        },
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              width: 250,
            },
            legend: {
              position: "bottom" as const,
            },
          },
        },
      ],
    }),
    [],
  );

  const chartSeries = useMemo(
    () => bankPaymentData.map((item) => item.balance),
    [],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payments by Bank</CardTitle>
        <CardDescription>
          Januari 2026 ( Status Paid - Currency IDR )
        </CardDescription>
        <CardAction>
          <Button variant="outline" size="icon">
            <Filter />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 lg:flex-row">
        {/* Chart Section */}
        <div className="flex flex-1 justify-center">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="donut"
            width={300}
            height={300}
          />
        </div>

        {/* Table Section */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="space-y-2 rounded-lg border">
            {bankPaymentData.map((item) => (
              <div
                key={item.bank}
                className="flex items-center justify-between border-b px-4 py-3 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-sm">{item.bank}</span>
                </div>
                <span className="text-right text-sm font-semibold">
                  {formatCurrency(item.balance)}
                </span>
              </div>
            ))}
          </div>

          {/* View Full Report Button */}
          <div className="flex justify-end pt-2">
            <Button variant="outline">View full report</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
