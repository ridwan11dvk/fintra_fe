import type { PostingAutoGroup } from "@/features/monitoring";
import { postingAutoGroupColumns } from "@/features/monitoring/posting-auto/components/posting-auto-group-columns";
import { flexRender } from "@tanstack/react-table";
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
      SapStatusBadge: ({ status }: { status: string }) => (
        <div data-testid={`sap-badge-${status}`}>{status}</div>
      ),
      formatDate: (date: string) => date,
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

function createRow(
  original: Record<string, unknown>,
  values?: Record<string, unknown>,
) {
  const rowValues = values ?? original;
  return {
    index: 0,
    original,
    getValue: (key: string) => rowValues[key as keyof typeof rowValues],
  };
}

type TestColumnDef = {
  id?: string;
  accessorKey?: string;
  header?: React.ComponentType<never> | ((ctx: never) => React.ReactNode);
  cell?: React.ComponentType<never>;
};

describe("postingAutoGroupColumns", () => {
  const onView = vi.fn();

  it("returns an array of 9 columns", () => {
    const columns = postingAutoGroupColumns({ onView });
    expect(columns).toHaveLength(9);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = postingAutoGroupColumns() as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "no",
      "actions",
      "sapStatus",
      "reversalFlag",
      "documentNumber",
      "reference",
      "documentDate",
      "virtualAccount",
      "sapDocumentNumber",
    ]);
  });

  it("renders number cell with row index + 1 and offset from meta", () => {
    const columns = postingAutoGroupColumns() as unknown as TestColumnDef[];
    const numberCol = columns.find((col) => col.id === "no");

    if (!numberCol?.cell) return;

    render(
      flexRender(numberCol.cell, {
        row: { ...createRow({}), index: 2 },
        column: { id: "no" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: { options: { meta: { currentPage: 1, pageSize: 10 } } },
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("13")).toBeInTheDocument();
  });

  it("renders number cell with default offset when meta is undefined", () => {
    const columns = postingAutoGroupColumns() as unknown as TestColumnDef[];
    const numberCol = columns.find((col) => col.id === "no");

    if (!numberCol?.cell) return;

    render(
      flexRender(numberCol.cell, {
        row: { index: 0, ...createRow({}) },
        column: { id: "no" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: { options: {} },
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("renders actions cell with show button", () => {
    const columns = postingAutoGroupColumns() as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");

    if (!actionsCol?.cell) return;

    render(
      flexRender(actionsCol.cell, {
        row: createRow({}),
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: { options: {} },
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByTestId("action-btn-show")).toBeInTheDocument();
  });

  it("calls onView when show button is clicked", async () => {
    const user = userEvent.setup();
    const columns = postingAutoGroupColumns({
      onView,
    }) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");

    if (!actionsCol?.cell) return;

    const mockGroup: PostingAutoGroup = {
      sapStatus: "S",
      postingStatus: 1,
      reversalFlag: "A",
      documentDate: "2024-01-15",
      documentNumber: "DOC-001",
      reference: "REF-001",
      assignment: "ASG-001",
      sapDocumentNumber: "SAP-001",
      fiscalYear: 2024,
      virtualAccount: "VA-001",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    render(
      flexRender(actionsCol.cell, {
        row: createRow(mockGroup as unknown as Record<string, unknown>),
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: { options: {} },
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    await user.click(screen.getByTestId("action-btn-show"));
    expect(onView).toHaveBeenCalledWith(mockGroup);
  });

  it("renders sapStatus cell with badge when status exists", () => {
    const columns = postingAutoGroupColumns() as unknown as TestColumnDef[];
    const sapCol = columns.find((col) => col.accessorKey === "sapStatus");

    if (!sapCol?.cell) return;

    render(
      flexRender(sapCol.cell, {
        row: createRow({ sapStatus: "S" }),
        column: { id: "sapStatus" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: { options: {} },
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByTestId("sap-badge-S")).toBeInTheDocument();
  });

  it("renders sapStatus cell with dash when status is null", () => {
    const columns = postingAutoGroupColumns() as unknown as TestColumnDef[];
    const sapCol = columns.find((col) => col.accessorKey === "sapStatus");

    if (!sapCol?.cell) return;

    render(
      flexRender(sapCol.cell, {
        row: createRow({ sapStatus: null }),
        column: { id: "sapStatus" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: { options: {} },
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders reference cell with dash when reference is null", () => {
    const columns = postingAutoGroupColumns() as unknown as TestColumnDef[];
    const refCol = columns.find((col) => col.accessorKey === "reference");

    if (!refCol?.cell) return;

    render(
      flexRender(refCol.cell, {
        row: createRow({ reference: null }),
        column: { id: "reference" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: { options: {} },
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders documentNumber with font-medium class", () => {
    const columns = postingAutoGroupColumns() as unknown as TestColumnDef[];
    const docCol = columns.find((col) => col.accessorKey === "documentNumber");

    if (!docCol?.cell) return;

    render(
      flexRender(docCol.cell, {
        row: createRow({ documentNumber: "DOC-001" }),
        column: { id: "documentNumber" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: { options: {} },
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("DOC-001")).toBeInTheDocument();
  });
});
