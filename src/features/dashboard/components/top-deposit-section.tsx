import { Button } from "@railfinance/core/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@railfinance/core/ui/card";
import { formatAbbr, formatCurrency } from "@railfinance/core/lib";
import { lazy, useMemo } from "react";

const ReactApexChart = lazy(() => import("react-apexcharts"));

interface TopDepositData {
  va: string;
  name: string;
  deposit: number;
}

const topDepositData: TopDepositData[] = [
  {
    va: "121771020000270",
    name: "PT FINNET INDONESIA",
    deposit: 134061734944,
  },
  {
    va: "121771020000212",
    name: "PT TRINUSA TRAVELINDO",
    deposit: 114000000072,
  },
  {
    va: "121771020000243",
    name: "PT FINNET INDONESIA",
    deposit: 42928415416,
  },
  {
    va: "121771020000230",
    name: "PT GLOBAL TIKET NETWORK",
    deposit: 26500000000,
  },
  {
    va: "121771020000244",
    name: "PT. RINTIS SEJAHTERA",
    deposit: 17074898049,
  },
];

export function TopDepositSection() {
  const chartOptions = useMemo(
    () => ({
      chart: {
        type: "bar" as const,
        toolbar: {
          show: false,
        },
      },
      colors: ["#FF6B35"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 4,
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        y: {
          formatter: (value: number) => {
            return formatCurrency(value);
          },
        },
      },
      xaxis: {
        categories: topDepositData.map((item) => item.name),
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          rotate: 0,
          rotateAlways: false,
          trim: true,
          maxHeight: 120,
        },
      },
      yaxis: {
        title: {
          text: undefined,
        },
        labels: {
          formatter: (value: number) => {
            return formatAbbr(value);
          },
        },
      },
      grid: {
        borderColor: "#e0e0e0",
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            plotOptions: {
              bar: {
                columnWidth: "70%",
              },
            },
          },
        },
      ],
    }),
    [],
  );

  const chartSeries = useMemo(
    () => [
      {
        name: "Total Deposit",
        data: topDepositData.map((item) => item.deposit),
      },
    ],
    [],
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Top 5 Deposits</CardTitle>
            <CardDescription>14 January 2026</CardDescription>
          </div>
          <CardAction>
            <Button variant="outline" size="sm">
              View report
            </Button>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Chart Section */}
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={250}
          width="100%"
        />

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-semibold">VA</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Nama Mitra
                </th>
                <th className="px-4 py-3 text-right font-semibold">
                  Total Deposit
                </th>
              </tr>
            </thead>
            <tbody>
              {topDepositData.map((item) => (
                <tr key={item.va} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{item.va}</td>
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatCurrency(item.deposit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
