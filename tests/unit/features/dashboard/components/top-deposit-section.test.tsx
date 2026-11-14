import { render, screen } from "@tests/unit/utils/render-with-providers";
import { Suspense } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-apexcharts", () => ({
  default: ({
    options,
    series,
    type,
    height,
    width,
  }: {
    options?: unknown;
    series?: unknown;
    type?: string;
    height?: number;
    width?: string;
  }) => (
    <div data-testid="apex-chart" data-type={type} data-height={height}>
      <span data-testid="chart-series-count">{Array.isArray(series) ? series.length : 0}</span>
    </div>
  ),
}));

import { TopDepositSection } from "@/features/dashboard/components/top-deposit-section";

describe("TopDepositSection", () => {
  it("renders the card title", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <TopDepositSection />
      </Suspense>,
    );
    expect(await screen.findByText("Top 5 Deposits")).toBeInTheDocument();
  });

  it("renders the card description", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <TopDepositSection />
      </Suspense>,
    );
    expect(await screen.findByText("14 January 2026")).toBeInTheDocument();
  });

  it("renders the bar chart via react-apexcharts (lazy)", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <TopDepositSection />
      </Suspense>,
    );
    const chart = await screen.findByTestId("apex-chart");
    expect(chart).toBeInTheDocument();
    expect(chart).toHaveAttribute("data-type", "bar");
  });

  it("renders all 5 table rows with VA numbers", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <TopDepositSection />
      </Suspense>,
    );
    expect(await screen.findByText("121771020000270")).toBeInTheDocument();
    expect(screen.getByText("121771020000212")).toBeInTheDocument();
    expect(screen.getByText("121771020000243")).toBeInTheDocument();
    expect(screen.getByText("121771020000230")).toBeInTheDocument();
    expect(screen.getByText("121771020000244")).toBeInTheDocument();
  });

  it("renders all 5 partner names", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <TopDepositSection />
      </Suspense>,
    );
    const finnetElements = await screen.findAllByText("PT FINNET INDONESIA");
    expect(finnetElements).toHaveLength(2);
    expect(screen.getByText("PT TRINUSA TRAVELINDO")).toBeInTheDocument();
    expect(screen.getByText("PT GLOBAL TIKET NETWORK")).toBeInTheDocument();
    expect(screen.getByText("PT. RINTIS SEJAHTERA")).toBeInTheDocument();
  });

  it("renders the View report button", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <TopDepositSection />
      </Suspense>,
    );
    expect(await screen.findByRole("button", { name: /view report/i })).toBeInTheDocument();
  });

  it("renders table headers", async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <TopDepositSection />
      </Suspense>,
    );
    expect(await screen.findByText("VA")).toBeInTheDocument();
    expect(screen.getByText("Nama Mitra")).toBeInTheDocument();
    expect(screen.getByText("Total Deposit")).toBeInTheDocument();
  });
});
