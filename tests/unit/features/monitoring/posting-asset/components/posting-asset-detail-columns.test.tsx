import type { PostingAsset } from "@/features/monitoring";
import { postingAssetDetailColumns } from "@/features/monitoring/posting-asset/components/posting-asset-detail-columns";
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
        disabled,
      }: {
        variant: string;
        onClick?: () => void;
        disabled?: boolean;
      }) => (
        <button
          data-testid={`action-btn-${variant}`}
          onClick={onClick}
          disabled={disabled}
        >
          {variant}
        </button>
      ),
      formatDate: (date: string) => date ?? "",
      formatCurrency: (amount: number) => `Rp${amount.toLocaleString("id-ID")}`,
      getCurrencyLabel: (code: string | null | undefined) => code ?? "-",

      SapStatusBadge: ({ status }: { status: string }) => (
        <div data-testid={`sap-badge-${status}`}>{status}</div>
      ),
      CreditDebitBadge: ({ flag }: { flag: string }) => (
        <div data-testid={`dc-badge-${flag}`}>{flag}</div>
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

describe("postingAssetDetailColumns", () => {
  const onEdit = vi.fn();
  const onDelete = vi.fn();

  it("returns an array of 32 columns", () => {
    const columns = postingAssetDetailColumns({ onEdit, onDelete });
    expect(columns).toHaveLength(32);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = postingAssetDetailColumns() as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "no",
      "actions",
      "recordNumber",
      "transactionCode",
      "documentType",
      "documentDate",
      "postingDate",
      "documentNumber",
      "reference",
      "reversalFlag",
      "accountNumber",
      "alternativeAccount",
      "debitCreditFlag",
      "amount",
      "businessArea",
      "segment",
      "costCenter",
      "profitCenter",
      "assignment",
      "fixedAssetNumber",
      "vendor",
      "customer",
      "virtualAccount",
      "withholdingTax",
      "fiscalYear",
      "recordIndex",
      "totalIndex",
      "fileName",
      "postingTimestamp",
      "sapStatus",
      "sapDocumentNumber",
      "createdAt",
    ]);
  });

  it("renders no header with No.", () => {
    const columns = postingAssetDetailColumns() as unknown as TestColumnDef[];
    const col = columns.find((c) => c.id === "no");
    if (!col?.header) return;
    render(flexRender(col.header, {} as never) as React.ReactElement);
    expect(screen.getByText("No.")).toBeInTheDocument();
  });

  it("renders number cell with row index + 1", () => {
    const columns = postingAssetDetailColumns() as unknown as TestColumnDef[];
    const col = columns.find((c) => c.id === "no");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: { ...createRow({}), index: 2 },
        column: { id: "no" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: { options: {} },
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders actions cell with edit and delete buttons", () => {
    const columns = postingAssetDetailColumns() as unknown as TestColumnDef[];
    const col = columns.find((c) => c.id === "actions");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({
          postingStatus: 0,
          sapStatus: null,
        } as unknown as Record<string, unknown>),
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: { options: {} },
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByTestId("action-btn-edit")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-delete")).toBeInTheDocument();
  });

  it("disables edit and delete buttons when posted and SAP success", () => {
    const columns = postingAssetDetailColumns() as unknown as TestColumnDef[];
    const col = columns.find((c) => c.id === "actions");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({
          postingStatus: 1,
          sapStatus: "S",
        } as unknown as Record<string, unknown>),
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: { options: {} },
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByTestId("action-btn-edit")).toBeDisabled();
    expect(screen.getByTestId("action-btn-delete")).toBeDisabled();
  });

  it("calls onEdit when edit button clicked", async () => {
    const user = userEvent.setup();
    const columns = postingAssetDetailColumns({
      onEdit,
      onDelete,
    }) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.id === "actions");
    if (!col?.cell) return;

    const mockRecord: PostingAsset = {
      id: 1,
      fileName: null,
      recordNumber: "001",
      transactionCode: "TC01",
      withholdingTax: null,
      reversalFlag: "A",
      documentType: "DR",
      postingDate: "20240115",
      documentDate: "20240115",
      documentNumber: "DOC-001",
      reference: null,
      debitCreditFlag: "S",
      accountNumber: "123",
      alternativeAccount: null,
      amount: 1000,
      businessArea: "BA01",
      segment: "",
      fixedAssetNumber: "",
      costCenter: "",
      profitCenter: "",
      internalOrderFlag: null,
      assignment: null,
      vendor: null,
      customer: null,
      postingStatus: 0,
      postingTimestamp: null,
      sapStatus: null,
      sapDocumentNumber: null,
      fiscalYear: null,
      virtualAccount: null,
      recordIndex: null,
      totalIndex: null,
      assetAccountFlag: null,
      wwrvc: null,
      kndnr: null,
      wwprd: null,
      createdAt: null,
      updatedAt: null,
    };

    render(
      flexRender(col.cell, {
        row: createRow(mockRecord as unknown as Record<string, unknown>),
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: { options: {} },
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    await user.click(screen.getByTestId("action-btn-edit"));
    expect(onEdit).toHaveBeenCalledWith(mockRecord);
  });

  it("calls onDelete when delete button clicked", async () => {
    const user = userEvent.setup();
    const columns = postingAssetDetailColumns({
      onEdit,
      onDelete,
    }) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.id === "actions");
    if (!col?.cell) return;

    const mockRecord: PostingAsset = {
      id: 2,
      fileName: null,
      recordNumber: null,
      transactionCode: "TC02",
      withholdingTax: null,
      reversalFlag: "B",
      documentType: "CR",
      postingDate: "20240115",
      documentDate: "20240115",
      documentNumber: "DOC-002",
      reference: null,
      debitCreditFlag: "H",
      accountNumber: "456",
      alternativeAccount: null,
      amount: 500,
      businessArea: "BA01",
      segment: "",
      fixedAssetNumber: "",
      costCenter: "",
      profitCenter: "",
      internalOrderFlag: null,
      assignment: null,
      vendor: null,
      customer: null,
      postingStatus: 0,
      postingTimestamp: null,
      sapStatus: null,
      sapDocumentNumber: null,
      fiscalYear: null,
      virtualAccount: null,
      recordIndex: null,
      totalIndex: null,
      assetAccountFlag: null,
      wwrvc: null,
      kndnr: null,
      wwprd: null,
      createdAt: null,
      updatedAt: null,
    };

    render(
      flexRender(col.cell, {
        row: createRow(mockRecord as unknown as Record<string, unknown>),
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: { options: {} },
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    await user.click(screen.getByTestId("action-btn-delete"));
    expect(onDelete).toHaveBeenCalledWith(mockRecord);
  });

  it("renders sapStatus cell with badge when status exists", () => {
    const columns = postingAssetDetailColumns() as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "sapStatus");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
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
    const columns = postingAssetDetailColumns() as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "sapStatus");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
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

  it("renders debitCreditFlag with CreditDebitBadge", () => {
    const columns = postingAssetDetailColumns() as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "debitCreditFlag");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ debitCreditFlag: "S" }),
        column: { id: "debitCreditFlag" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: { options: {} },
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByTestId("dc-badge-S")).toBeInTheDocument();
  });

  it("renders amount cell with formatted currency", () => {
    const columns = postingAssetDetailColumns() as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "amount");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ amount: 1000000 }),
        column: { id: "amount" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: { options: {} },
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("Rp1.000.000")).toBeInTheDocument();
  });

  it("renders amount cell with dash when amount is null", () => {
    const columns = postingAssetDetailColumns() as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "amount");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
        row: createRow({ amount: null }),
        column: { id: "amount" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: { options: {} },
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders cell with dash for null values", () => {
    const columns = postingAssetDetailColumns() as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "reference");
    if (!col?.cell) return;

    render(
      flexRender(col.cell, {
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
});
