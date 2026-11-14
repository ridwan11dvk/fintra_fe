import { render, screen } from "@tests/unit/utils/render-with-providers";
import { DepositSummaryCards } from "@/features/treasury";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

const BASE = "http://localhost:3000";

describe("DepositSummaryCards", () => {
  it("should render loading skeletons initially", () => {
    render(<DepositSummaryCards />);
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should display summary cards with data", async () => {
    render(<DepositSummaryCards />);

    expect(await screen.findByText("Total Deposits")).toBeInTheDocument();
    expect(await screen.findByText("Not Sent")).toBeInTheDocument();
    expect(await screen.findByText("Sent")).toBeInTheDocument();
    expect(await screen.findByText("Total Amount")).toBeInTheDocument();
  });

  it("should display correct values for total deposits", async () => {
    render(<DepositSummaryCards />);

    expect(await screen.findByText("2")).toBeInTheDocument();
  });

  it("should display formatted total amount with non-breaking space", async () => {
    render(<DepositSummaryCards />);

    expect(await screen.findByText((content) => content.replace(/\s+/g, ' ').trim() === "Rp 3.000.000")).toBeInTheDocument();
  });

  it("should render Not Sent value with yellow text class", async () => {
    render(<DepositSummaryCards />);

    const notSentValues = await screen.findAllByText("1");
    const yellowValue = notSentValues.find(
      (el) => el.className === "text-2xl font-bold text-yellow-600",
    );
    expect(yellowValue).toBeDefined();
  });

  it("should render Sent value with green text class", async () => {
    render(<DepositSummaryCards />);

    const sentValues = await screen.findAllByText("1");
    const greenValue = sentValues.find(
      (el) => el.className === "text-2xl font-bold text-green-600",
    );
    expect(greenValue).toBeDefined();
  });

  it("should show zero values when summary has no data", async () => {
    server.use(
      http.get(`${BASE}/treasury/deposit/summary/stats`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          message: "Summary retrieved successfully",
          data: {
            totalDeposits: 0,
            totalNotSent: 0,
            totalSent: 0,
            totalAmount: 0,
          },
        }),
      ),
    );

    render(<DepositSummaryCards />);

    expect(await screen.findByText("Total Deposits")).toBeInTheDocument();
    const zeroTexts = await screen.findAllByText("0");
    expect(zeroTexts.length).toBe(3);
  });

  it("should show Rp 0 when totalAmount is zero", async () => {
    server.use(
      http.get(`${BASE}/treasury/deposit/summary/stats`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          message: "Summary retrieved successfully",
          data: {
            totalDeposits: 0,
            totalNotSent: 0,
            totalSent: 0,
            totalAmount: 0,
          },
        }),
      ),
    );

    render(<DepositSummaryCards />);

    expect(await screen.findByText("Rp 0")).toBeInTheDocument();
  });
});
