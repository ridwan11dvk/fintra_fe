import { bannerColumns } from "@/features/settings/banner/components/banner-columns";
import type { BannerResponse } from "@/features/settings/banner/data/banner.types";
import type { TableActionHandlers } from "@railfinance/core";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      useAuth: () => ({
        can: () => true,
        hasResource: () => true,
        permissions: [],
        roles: [],
        user: {},
        token: null,
        isSuperAdmin: false,
        isAuthenticated: true,
        isLoading: false,
        isRefreshing: false,
        error: null,
        logout: vi.fn(),
        scheduleTokenRefresh: vi.fn(),
      }),
      ColumnHeader: () => <div data-testid="column-header" />,
      Image: ({ alt }: { alt?: string }) => (
        <div data-testid="banner-image">{alt}</div>
      ),
      ActionButton: ({
        variant,
        onClick,
      }: {
        variant: string;
        onClick?: () => void;
      }) => (
        <button data-testid={`action-btn-${variant}`} onClick={onClick}>
          {variant}
        </button>
      ),
      StatusBadge: ({ status, label }: { status: string; label?: string }) => (
        <div data-testid={`status-badge-${status}`}>{label ?? status}</div>
      ),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/image", __railfinanceCoreMock);

type CellCtx = {
  row: {
    original: BannerResponse;
    index: number;
    getValue: () => unknown;
  };
};

type TestColumnDef = {
  id?: string;
  accessorKey?: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  meta?: { title: string };
  cell?: (ctx: CellCtx) => React.ReactNode;
};

const mockHandlers: TableActionHandlers<BannerResponse> = {
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

const baseBanner: BannerResponse = {
  id: 1,
  target: "guest_home",
  title: "Simplify Your Financial Operations",
  startDate: "2026-01-01",
  endDate: "2026-12-31",
  sortOrder: 10,
};

function getCellRenderer(colId: string) {
  const columns = bannerColumns(mockHandlers) as unknown as TestColumnDef[];
  const col = columns.find((c) => c.id === colId);
  if (!col?.cell) return null;
  return col.cell;
}

function renderCell(colId: string, banner: BannerResponse) {
  const cell = getCellRenderer(colId);
  if (!cell) throw new Error(`Column ${colId} has no cell renderer`);
  return render(
    cell({
      row: { original: banner, index: 0, getValue: () => undefined },
    }) as React.ReactElement,
  );
}

describe("bannerColumns", () => {
  it("returns an array of 10 columns", () => {
    const columns = bannerColumns(mockHandlers);
    expect(columns).toHaveLength(10);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = bannerColumns(mockHandlers) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "number",
      "image",
      "title",
      "target",
      "validity",
      "status",
      "sortOrder",
      "modifiedOn",
      "modifiedBy",
      "actions",
    ]);
  });

  it("each column has a meta.title defined", () => {
    const columns = bannerColumns(mockHandlers) as unknown as TestColumnDef[];
    columns.forEach((col) => {
      expect(col.meta).toBeDefined();
      expect(col.meta?.title).toBeTruthy();
    });
  });

  it("renders the status badge as active for a banner spanning today", () => {
    renderCell("status", baseBanner);
    expect(screen.getByTestId("status-badge-active")).toBeInTheDocument();
  });

  it("renders the status badge as expired when endDate is in the past", () => {
    renderCell("status", { ...baseBanner, endDate: "2020-01-01" });
    expect(screen.getByTestId("status-badge-archived")).toBeInTheDocument();
  });

  it("renders the status badge as scheduled when startDate is in the future", () => {
    renderCell("status", { ...baseBanner, startDate: "2099-01-01" });
    expect(screen.getByTestId("status-badge-pending")).toBeInTheDocument();
  });

  it("renders a Text placeholder for text-only banners", () => {
    renderCell("image", { ...baseBanner, imageUrl: undefined });
    expect(screen.getByText("Text")).toBeInTheDocument();
  });

  it("renders the image thumbnail when imageUrl exists", () => {
    renderCell("image", { ...baseBanner, imageUrl: "https://x/y.png" });
    expect(screen.getByTestId("banner-image")).toBeInTheDocument();
  });

  it("renders validity with 'No end date' when endDate is empty", () => {
    renderCell("validity", { ...baseBanner, endDate: undefined });
    expect(screen.getByText(/No end date/)).toBeInTheDocument();
  });

  it("calls onEdit handler when edit action is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    const onEdit = vi.fn();
    const columns = bannerColumns({ onEdit, onDelete: vi.fn() });
    const actionsCol = columns.find(
      (col) => col.id === "actions",
    ) as unknown as TestColumnDef;
    if (!actionsCol?.cell) throw new Error("no actions cell");

    render(
      actionsCol.cell({
        row: { original: baseBanner, index: 0, getValue: () => undefined },
      }) as React.ReactElement,
    );

    await user.click(screen.getByTestId("action-btn-edit"));
    expect(onEdit).toHaveBeenCalledWith(baseBanner);
  });

  it("calls onDelete handler when delete action is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    const onDelete = vi.fn();
    const columns = bannerColumns({ onEdit: vi.fn(), onDelete });
    const actionsCol = columns.find(
      (col) => col.id === "actions",
    ) as unknown as TestColumnDef;
    if (!actionsCol?.cell) throw new Error("no actions cell");

    render(
      actionsCol.cell({
        row: { original: baseBanner, index: 0, getValue: () => undefined },
      }) as React.ReactElement,
    );

    await user.click(screen.getByTestId("action-btn-delete"));
    expect(onDelete).toHaveBeenCalledWith(baseBanner);
  });
});
