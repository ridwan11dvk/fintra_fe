import { TransactionDetailModal } from "@/features/treasury";
import { server } from "@tests/unit/mocks/server";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      formatDate: (date: string, format: string, showTime?: boolean) => {
        if (showTime) {
          const d = new Date(date);
          return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}, ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
        }
        const d = new Date(date);
        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
      },
      formatCurrency: (amount: number) => `Rp${amount.toLocaleString("id-ID")}`,
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/alert-banner", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/cards", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/simple-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dialog", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dropdown-menu", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/field", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/pagination", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/skeleton", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/table", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

const BASE = "http://localhost:3000";

describe("TransactionDetailModal", () => {
  it("should not render when closed", () => {
    const { container } = render(
      <TransactionDetailModal
        isOpen={false}
        onClose={vi.fn()}
        selectedId={1}
      />,
    );

    expect(container.textContent).not.toContain("Transaction Detail");
  });

  it("should render loading skeleton when opened", () => {
    render(
      <TransactionDetailModal isOpen={true} onClose={vi.fn()} selectedId={1} />,
    );

    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should display header information when data loads", async () => {
    render(
      <TransactionDetailModal isOpen={true} onClose={vi.fn()} selectedId={1} />,
    );

    expect(await screen.findByText("Station A")).toBeInTheDocument();
    expect(await screen.findByText("C001")).toBeInTheDocument();
    expect(screen.getAllByText("CL-001").length).toBeGreaterThanOrEqual(1);
    expect(
      (await screen.findAllByText("1234567890")).length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      (await screen.findAllByText("BANK01")).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("should display formatted amounts in summary cards", async () => {
    render(
      <TransactionDetailModal isOpen={true} onClose={vi.fn()} selectedId={1} />,
    );

    // Total Closure comes from closureAmount, while Total Deposit/Credit/Completed
    // are summed from depositDetails by billingType (4.000.000 DEPOSIT + 5.000.000 CREDIT).
    // Deposit and Credit amounts also appear in the transaction table rows.
    expect(await screen.findByText("Rp10.000.000")).toBeInTheDocument();
    expect(screen.getByText("Total Deposit")).toBeInTheDocument();
    expect(screen.getByText("Total Credit")).toBeInTheDocument();
    expect(screen.getByText("Total Completed")).toBeInTheDocument();
    expect(
      (await screen.findAllByText("Rp4.000.000")).length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Rp5.000.000").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Rp0").length).toBeGreaterThanOrEqual(1);
  });

  it("should display deposit status badge", async () => {
    render(
      <TransactionDetailModal isOpen={true} onClose={vi.fn()} selectedId={1} />,
    );

    expect(
      (await screen.findAllByText("Credit")).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("should display SAP status badge", async () => {
    render(
      <TransactionDetailModal isOpen={true} onClose={vi.fn()} selectedId={1} />,
    );

    expect(
      (await screen.findAllByText("Success")).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("should render deposit transactions table with items", async () => {
    render(
      <TransactionDetailModal isOpen={true} onClose={vi.fn()} selectedId={1} />,
    );

    expect(await screen.findByText("No")).toBeInTheDocument();
    expect(await screen.findByText("VA number")).toBeInTheDocument();
    expect(await screen.findByText("Amount")).toBeInTheDocument();

    // Amounts also appear in the summary tiles, so use findAllByText
    expect(
      (await screen.findAllByText("Rp5.000.000")).length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      (await screen.findAllByText("Rp4.000.000")).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("should show no transactions message when list is empty", async () => {
    server.use(
      http.get(`${BASE}/treasury/digital-vault/transactions/3`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          message: "Transaction detail retrieved successfully",
          data: {
            id: 3,
            virtualAccountNumber: "1234567890",
            stationName: "Station A",
            companyCode: "C001",
            closureNumber: "CL-003",
            closureDate: "2025-06-17",
            closureAmount: 5000000,
            depositType: 1,
            latestBillingType: "DEPOSIT",
            latestDepositDate: null,
            totalDepositAmount: 0,
            bankCode: "BANK01",
            paymentStatus: 0,
            postingA8Status: null,
            depositDetails: [],
          },
        }),
      ),
    );

    render(
      <TransactionDetailModal isOpen={true} onClose={vi.fn()} selectedId={3} />,
    );

    expect(
      await screen.findByText("No transactions recorded"),
    ).toBeInTheDocument();
  });

  it("should show error state when fetch fails", async () => {
    server.use(
      http.get(`${BASE}/treasury/digital-vault/transactions/999`, () =>
        HttpResponse.json(
          { status: "ERROR", message: "Transaction not found", data: null },
          { status: 404 },
        ),
      ),
    );

    render(
      <TransactionDetailModal
        isOpen={true}
        onClose={vi.fn()}
        selectedId={999}
      />,
    );

    expect(
      await screen.findByText(
        "Failed to load closure detail. Please try again.",
      ),
    ).toBeInTheDocument();
  });
});
