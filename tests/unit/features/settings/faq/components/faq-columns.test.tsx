import { faqColumns } from "@/features/settings/faq/components/faq-columns";
import type { FaqResponse } from "@/features/settings/faq/data/faq.types";
import type { TableActionHandlers } from "@railfinance/core";
import userEvent from "@testing-library/user-event";
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

type CellCtx = {
  row: {
    original: FaqResponse;
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

const mockHandlers: TableActionHandlers<FaqResponse> = {
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

const baseFaq: FaqResponse = {
  id: 1,
  target: "guest_home",
  question: "Bagaimana cara melacak status invoice saya?",
  answer: "Masukkan NPWP/NIK dan nomor invoice Anda.",
  startDate: "2026-01-01",
  endDate: "2026-12-31",
  sortOrder: 10,
};

function getCellRenderer(colId: string) {
  const columns = faqColumns(mockHandlers) as unknown as TestColumnDef[];
  const col = columns.find((c) => c.id === colId);
  if (!col?.cell) return null;
  return col.cell;
}

function renderCell(colId: string, faq: FaqResponse) {
  const cell = getCellRenderer(colId);
  if (!cell) throw new Error(`Column ${colId} has no cell renderer`);
  return render(
    cell({
      row: { original: faq, index: 0, getValue: () => undefined },
    }) as React.ReactElement,
  );
}

describe("faqColumns", () => {
  it("returns an array of 9 columns", () => {
    const columns = faqColumns(mockHandlers);
    expect(columns).toHaveLength(9);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = faqColumns(mockHandlers) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "number",
      "question",
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
    const columns = faqColumns(mockHandlers) as unknown as TestColumnDef[];
    columns.forEach((col) => {
      expect(col.meta).toBeDefined();
      expect(col.meta?.title).toBeTruthy();
    });
  });

  it("renders the status badge as active for a FAQ spanning today", () => {
    renderCell("status", baseFaq);
    expect(screen.getByTestId("status-badge-active")).toBeInTheDocument();
  });

  it("renders the status badge as expired when endDate is in the past", () => {
    renderCell("status", { ...baseFaq, endDate: "2020-01-01" });
    expect(screen.getByTestId("status-badge-archived")).toBeInTheDocument();
  });

  it("renders the status badge as scheduled when startDate is in the future", () => {
    renderCell("status", { ...baseFaq, startDate: "2099-01-01" });
    expect(screen.getByTestId("status-badge-pending")).toBeInTheDocument();
  });

  it("shows 'No end date' in the validity cell when endDate is absent", () => {
    renderCell("validity", { ...baseFaq, endDate: undefined });
    expect(screen.getByText(/No end date/)).toBeInTheDocument();
  });

  it("wires the edit and delete action buttons to the handlers", async () => {
    const user = userEvent.setup();
    renderCell("actions", baseFaq);

    await user.click(screen.getByTestId("action-btn-edit"));
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(baseFaq);

    await user.click(screen.getByTestId("action-btn-delete"));
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(baseFaq);
  });
});
