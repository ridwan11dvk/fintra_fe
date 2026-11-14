import { postingAutoLegacyDetailColumns } from "@/features/monitoring/posting-auto-legacy/components/posting-auto-legacy-detail-columns";
import { postingAutoLegacyGroupColumns } from "@/features/monitoring/posting-auto-legacy/components/posting-auto-legacy-group-columns";
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
        onClick,
        variant,
      }: {
        onClick?: () => void;
        variant?: string;
      }) => (
        <button data-testid={`action-btn-${variant}`} onClick={onClick}>
          {variant}
        </button>
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

const groupItem = {
  REVERSAL: "A",
  NO_DOK: "DOK-001",
  REFERENCE: "REF-1",
  DOC_DATE: "2024-01-15",
  POSTING_DATE: "2024-01-16",
  virtual_acc: "VA-123",
  NO_DOKSAP: "SAP-9",
  Fiscal_year: 2024,
  entry_date: "2024-01-15T10:00:00Z",
  status0: null as string | null,
};

const detailItem = {
  indeks: 1,
  TCODE: "FB01",
  DOC_TYPE: "KR",
  NO_DOK: "DOK-001",
  ACCOUNT: "100001",
  DEBIT_KREDIT: "D",
  AMOUNT: "1000",
  BA: "1000",
  pos_status: 0,
  status0: "" as string,
  pos_tgl: "2024-01-17",
  totalidx: 2,
};

type GroupCol = ReturnType<typeof postingAutoLegacyGroupColumns>[number];
type DetailCol = ReturnType<typeof postingAutoLegacyDetailColumns>[number];

function groupCtx(overrides: Partial<Parameters<GroupCol["cell"]>[0]> = {}) {
  const base = {
    row: {
      index: 0,
      original: groupItem,
      getIsSelected: () => false,
      toggleSelected: vi.fn(),
      getValue: (key: string) => (groupItem as Record<string, unknown>)[key],
    },
    getValue: (key: string) => (groupItem as Record<string, unknown>)[key],
    table: { options: { meta: { currentPage: 0, pageSize: 10 } } },
  };
  return { ...base, ...overrides } as never;
}

function detailCtx() {
  return {
    row: {
      index: 0,
      original: detailItem,
      getValue: (key: string) => (detailItem as Record<string, unknown>)[key],
    },
    getValue: (key: string) => (detailItem as Record<string, unknown>)[key],
  } as never;
}

function renderCell(col: { cell?: (ctx: never) => unknown }, ctx: never) {
  return col.cell
    ? render(<div>{col.cell(ctx) as React.ReactNode}</div>)
    : null;
}

describe("postingAutoLegacyGroupColumns", () => {
  it("renders all cells for a group row", () => {
    const cols = postingAutoLegacyGroupColumns({
      onView: vi.fn(),
      onRegenerate: vi.fn(),
      onSendToSap: vi.fn(),
    });

    const byKey = (key: string) =>
      cols.find((c) => ("id" in c ? c.id === key : c.accessorKey === key));

    // actions
    renderCell(byKey("actions") as never, groupCtx());
    expect(screen.getByTestId("action-btn-show")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-generate")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-sent")).toBeInTheDocument();
  });

  it("wires action handlers", async () => {
    const onView = vi.fn();
    const onRegenerate = vi.fn();
    const onSendToSap = vi.fn();
    const cols = postingAutoLegacyGroupColumns({
      onView,
      onRegenerate,
      onSendToSap,
    });

    const user = userEventSetup();
    renderCell(
      cols.find((c) => "id" in c && c.id === "actions") as never,
      groupCtx(),
    );
    await user.click(screen.getByTestId("action-btn-show"));
    expect(onView).toHaveBeenCalledWith(groupItem);
    await user.click(screen.getByTestId("action-btn-generate"));
    expect(onRegenerate).toHaveBeenCalledWith(groupItem);
    await user.click(screen.getByTestId("action-btn-sent"));
    expect(onSendToSap).toHaveBeenCalledWith(groupItem);
  });

  it("renders value cells including fallbacks", () => {
    const cols = postingAutoLegacyGroupColumns();
    const stringKeys = [
      "REVERSAL",
      "NO_DOK",
      "REFERENCE",
      "DOC_DATE",
      "POSTING_DATE",
      "virtual_acc",
      "NO_DOKSAP",
      "Fiscal_year",
      "entry_date",
    ];
    for (const key of stringKeys) {
      const col = cols.find((c) => "accessorKey" in c && c.accessorKey === key);
      expect(col, `column ${key} should exist`).toBeTruthy();
      renderCell(col as never, groupCtx());
    }
    expect(screen.getByText("DOK-001")).toBeInTheDocument();
    expect(screen.getByText("REF-1")).toBeInTheDocument();
    expect(screen.getByText("VA-123")).toBeInTheDocument();
    expect(screen.getByText("SAP-9")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("renders the status cell with dash when status is empty", () => {
    const cols = postingAutoLegacyGroupColumns();
    const statusCol = cols.find(
      (c) => "accessorKey" in c && c.accessorKey === "status0",
    );
    renderCell(statusCol as never, groupCtx());
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders the row number with pagination offset", () => {
    const cols = postingAutoLegacyGroupColumns();
    const noCol = cols.find((c) => "id" in c && c.id === "no");
    renderCell(noCol as never, groupCtx());
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});

describe("postingAutoLegacyDetailColumns", () => {
  it("renders actions for an unposted record", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const cols = postingAutoLegacyDetailColumns({ onEdit, onDelete });

    renderCell(
      cols.find((c) => "id" in c && c.id === "actions") as never,
      detailCtx(),
    );
    expect(screen.getByTestId("action-btn-edit")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-delete")).toBeInTheDocument();
  });

  it("renders all accessor cells", () => {
    const cols = postingAutoLegacyDetailColumns();
    for (const col of cols) {
      if ("accessorKey" in col && col.accessorKey !== "status0") {
        renderCell(col as never, detailCtx());
      }
    }
    expect(screen.getByText("FB01")).toBeInTheDocument();
    expect(screen.getByText("KR")).toBeInTheDocument();
    expect(screen.getByText("100001")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument(); // indeks
  });

  it("renders dash for null values", () => {
    const cols = postingAutoLegacyDetailColumns();
    for (const col of cols) {
      if ("accessorKey" in col) {
        renderCell(col as never, detailCtx());
      }
    }
    // ALTERNATIVE_ACC is undefined -> renders "-"
    expect(screen.getAllByText("-").length).toBeGreaterThanOrEqual(1);
  });
});

function userEventSetup() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@testing-library/user-event").default.setup();
}
