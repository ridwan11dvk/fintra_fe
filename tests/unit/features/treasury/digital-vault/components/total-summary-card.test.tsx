import { TotalSummaryCard } from "@/features/treasury";
import { server } from "@tests/unit/mocks/server";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

const BASE = "http://localhost:3000";

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      formatAbbr: (amount: number | null) => {
        if (amount === null || amount === undefined) return "Rp.0";
        const abs = Math.abs(amount);
        if (abs >= 1_000_000_000)
          return `${(amount / 1_000_000_000).toFixed(2)} B`;
        if (abs >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)} M`;
        if (abs >= 1_000) return `${(amount / 1_000).toFixed(2)} K`;
        return `Rp.${amount}`;
      },
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

describe("TotalSummaryCard", () => {
  it("should render loading skeleton initially", () => {
    render(<TotalSummaryCard />);
    const loader = document.querySelector(".animate-spin");
    expect(loader).toBeInTheDocument();
  });

  it("should display Total Closure and Total deposit labels", async () => {
    render(<TotalSummaryCard />);

    expect(await screen.findByText("Total Closure")).toBeInTheDocument();
    expect(await screen.findByText("Total Deposit")).toBeInTheDocument();
  });

  it("should display formatted total closure amount", async () => {
    render(<TotalSummaryCard />);

    expect(await screen.findByText(/80\.00 M/)).toBeInTheDocument();
  });

  it("should display formatted total deposit amount", async () => {
    render(<TotalSummaryCard />);

    expect(await screen.findByText(/73\.00 M/)).toBeInTheDocument();
  });

  it("should show 0 when summary has no data", async () => {
    server.use(
      http.get(`${BASE}/treasury/digital-vault/total`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          message: "Total summary retrieved successfully",
          data: null,
        }),
      ),
    );

    render(<TotalSummaryCard />);

    expect(await screen.findByText("Total Closure")).toBeInTheDocument();
    const zeroTexts = await screen.findAllByText("0", { exact: false });
    expect(zeroTexts.length).toBeGreaterThanOrEqual(1);
  });
});
