import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockUsePostingAutoStatusSummary = vi.hoisted(() => vi.fn());

vi.mock("@/features/monitoring/posting-auto/data/posting-auto.query", () => ({
  usePostingAutoStatusSummary: mockUsePostingAutoStatusSummary,
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
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/skeleton", __railfinanceCoreMock);

import { PostingAutoStatusSummaryCard } from "@/features/monitoring/posting-auto/components/posting-auto-status-summary";

describe("PostingAutoStatusSummaryCard", () => {
  beforeEach(() => {
    mockUsePostingAutoStatusSummary.mockReturnValue({
      isLoading: false,
      data: undefined,
    });
  });

  describe("loading state", () => {
    it("renders 6 skeleton placeholders when loading", () => {
      mockUsePostingAutoStatusSummary.mockReturnValue({
        isLoading: true,
        data: undefined,
      });

      render(<PostingAutoStatusSummaryCard />);
      expect(screen.getAllByTestId("skeleton")).toHaveLength(6);
    });
  });

  describe("empty state", () => {
    it("returns null when no data", () => {
      render(<PostingAutoStatusSummaryCard />);
      expect(screen.queryAllByTestId("skeleton")).toHaveLength(0);
      expect(screen.queryAllByTestId(/^badge-/)).toHaveLength(0);
    });
  });

  describe("data state", () => {
    it("renders all 6 stat cards with correct values", () => {
      mockUsePostingAutoStatusSummary.mockReturnValue({
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

      render(<PostingAutoStatusSummaryCard />);

      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("8")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("renders correct badge variants for each stat", () => {
      mockUsePostingAutoStatusSummary.mockReturnValue({
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

      render(<PostingAutoStatusSummaryCard />);

      expect(screen.getAllByTestId("badge-secondary")[0]).toHaveTextContent(
        "5",
      );
      expect(screen.getAllByTestId("badge-default")[0]).toHaveTextContent("10");
      expect(screen.getAllByTestId("badge-destructive")[0]).toHaveTextContent(
        "2",
      );
      expect(screen.getAllByTestId("badge-default")[1]).toHaveTextContent("8");
      expect(screen.getAllByTestId("badge-destructive")[1]).toHaveTextContent(
        "3",
      );
      expect(screen.getAllByTestId("badge-secondary")[1]).toHaveTextContent(
        "1",
      );
    });
  });
});
