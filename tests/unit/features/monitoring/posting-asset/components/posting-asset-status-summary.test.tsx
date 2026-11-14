import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockUsePostingAssetStatusSummary = vi.hoisted(() => vi.fn());

vi.mock("@/features/monitoring", () => ({
  usePostingAssetStatusSummary: mockUsePostingAssetStatusSummary,
  MONITORING_DASHBOARD_BASE: "dashboard",
  MONITORING_DASHBOARD_URL: "/monitoring/dashboard",
  MONITORING_DASHBOARD_PAGE_TITLE: "Monitoring Dashboard",
  POSTING_ASSET_BASE: "invoice",
  POSTING_ASSET_LIST_PAGE_TITLE: "Posting Invoice",
  POSTING_ASSET_URL: "/monitoring/invoice",
  POSTING_ASSET_DETAIL_PAGE_TITLE: "Posting Detail",
  POSTING_ASSET_PERMISSION: "monitoring:invoice:",
  POSTING_ASSET_LIST_PERMISSION: "monitoring:invoice:list",
  POSTING_ASSET_READ_PERMISSION: "monitoring:invoice:read",
  POSTING_ASSET_CREATE_PERMISSION: "monitoring:invoice:create",
  POSTING_ASSET_UPDATE_PERMISSION: "monitoring:invoice:update",
  POSTING_ASSET_DELETE_PERMISSION: "monitoring:invoice:delete",
  POSTING_AUTO_BASE: "auto",
  POSTING_AUTO_LIST_PAGE_TITLE: "Posting Auto",
  POSTING_AUTO_URL: "/monitoring/auto",
  REVERSAL_FLAG_LABELS: { A: "Normal (A)", B: "Reversal (B)" },
}));

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      Badge: ({
        children,
        variant,
      }: {
        children: React.ReactNode;
        variant?: string;
      }) => <div data-testid={`badge-${variant}`}>{children}</div>,
      Skeleton: ({ className }: { className?: string }) => (
        <div data-testid="skeleton" className={className} />
      ),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/activity-feed", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/alert-banner", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/cards", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/simple-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/constants", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/progress", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/skeleton", __railfinanceCoreMock);

import { PostingAssetStatusSummaryCard } from "@/features/monitoring/posting-asset/components/posting-asset-status-summary";

describe("PostingAssetStatusSummaryCard", () => {
  beforeEach(() => {
    mockUsePostingAssetStatusSummary.mockReturnValue({
      isLoading: false,
      data: undefined,
    });
  });

  describe("loading state", () => {
    it("renders 6 skeleton placeholders when loading", () => {
      mockUsePostingAssetStatusSummary.mockReturnValue({
        isLoading: true,
        data: undefined,
      });

      render(<PostingAssetStatusSummaryCard />);
      expect(screen.getAllByTestId("skeleton")).toHaveLength(6);
    });
  });

  describe("empty state", () => {
    it("returns null when no data", () => {
      render(<PostingAssetStatusSummaryCard />);
      expect(screen.queryAllByTestId("skeleton")).toHaveLength(0);
      expect(screen.queryAllByTestId(/^badge-/)).toHaveLength(0);
    });
  });

  describe("data state", () => {
    it("renders all 6 stat cards with correct values", () => {
      mockUsePostingAssetStatusSummary.mockReturnValue({
        isLoading: false,
        data: {
          status: "SUCCESS",
          message: "ok",
          data: {
            pendingCount: 5,
            postedCount: 10,
            errorCount: 2,
            sapSuccessCount: 8,
            sapErrorCount: 3,
            sapCancelCount: 1,
          },
        },
      });

      render(<PostingAssetStatusSummaryCard />);

      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("8")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("renders correct badge variants for each stat", () => {
      mockUsePostingAssetStatusSummary.mockReturnValue({
        isLoading: false,
        data: {
          status: "SUCCESS",
          message: "ok",
          data: {
            pendingCount: 5,
            postedCount: 10,
            errorCount: 2,
            sapSuccessCount: 8,
            sapErrorCount: 3,
            sapCancelCount: 1,
          },
        },
      });

      render(<PostingAssetStatusSummaryCard />);

      expect(screen.getByTestId("badge-secondary")).toHaveTextContent("5");
      expect(screen.getAllByTestId("badge-default")[0]).toHaveTextContent("10");
      expect(screen.getAllByTestId("badge-destructive")[0]).toHaveTextContent(
        "2",
      );
      expect(screen.getAllByTestId("badge-default")[1]).toHaveTextContent("8");
      expect(screen.getAllByTestId("badge-destructive")[1]).toHaveTextContent(
        "3",
      );
      expect(screen.getByTestId("badge-outline")).toHaveTextContent("1");
    });
  });
});
