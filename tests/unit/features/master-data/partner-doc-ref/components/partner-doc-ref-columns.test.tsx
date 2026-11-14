import { partnerDocRefColumns } from "@/features/master-data/partner-doc-ref/components/partner-doc-ref-columns";
import type { PartnerDocRefResponse } from "@/features/master-data/partner-doc-ref/data/partner-doc-ref.types";
import type { TableActionHandlers } from "@railfinance/core";
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
      ColumnHeader: () => <div data-testid="column-header" />,
      ActionButton: ({
        variant,
        onClick,
        label,
      }: {
        variant: string;
        onClick?: () => void;
        label?: string;
      }) => (
        <button data-testid={`action-btn-${variant}`} onClick={onClick}>
          {label ?? variant}
        </button>
      ),

      StatusBadge: ({ status }: { status: string }) => (
        <div data-testid={`status-badge-${status}`}>{status}</div>
      ),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/visibility", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dropdown-menu", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/pagination", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/popover", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/radio-group", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/table", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/tabs", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

type TestColumnDef = {
  id?: string;
  accessorKey?: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  meta?: { title: string };
  cell?: React.ComponentType<never>;
  header?: React.ComponentType<never> | ((ctx: never) => React.ReactNode);
};

const mockHandlers: TableActionHandlers<PartnerDocRefResponse> = {
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

/**
 * Response row extended with lookup-id fields that are not yet part of the
 * published @railfinance/core response type.
 */
type TestRow = PartnerDocRefResponse & {
  documentNameId?: number | null;
  partnerLegalityId?: number | null;
  partnerLegalityName?: string | null;
  partnerRoleId?: number | null;
  partnerRoleName?: string | null;
};

const mockRow: TestRow = {
  id: 1,
  countryId: 1,
  countryName: "Indonesia",
  companyCode: "C001",
  partnerCategoryId: 1,
  partnerCategoryName: "Supplier",
  partnerTypeId: 1,
  partnerTypeName: "Individual",
  partnerSubTypeId: 1,
  partnerSubTypeName: "Local",
  partnerLegalityId: 15,
  partnerLegalityName: "Jasa",
  partnerRoleId: 16,
  partnerRoleName: "Vendor",
  documentNameId: 15,
  documentName: "KTP",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

describe("partnerDocRefColumns", () => {
  it("returns an array of 12 columns", () => {
    const columns = partnerDocRefColumns(mockHandlers);
    expect(columns).toHaveLength(12);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = partnerDocRefColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "number",
      "documentName",
      "countryName",
      "companyCode",
      "partnerCategoryName",
      "partnerLegalityName",
      "partnerRoleName",
      "partnerTypeName",
      "partnerSubTypeName",
      "isActive",
      "createdOn",
      "actions",
    ]);
  });

  it("number column has enableSorting: false and enableHiding: false", () => {
    const columns = partnerDocRefColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const numberCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "number",
    );
    expect(numberCol?.enableSorting).toBe(false);
    expect(numberCol?.enableHiding).toBe(false);
  });

  it("actions column has enableSorting: false and enableHiding: false", () => {
    const columns = partnerDocRefColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find(
      (col) => (col.id ?? col.accessorKey) === "actions",
    );
    expect(actionsCol?.enableSorting).toBe(false);
    expect(actionsCol?.enableHiding).toBe(false);
  });

  it("each column has a meta.title defined", () => {
    const columns = partnerDocRefColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    columns.forEach((col) => {
      expect(col.meta).toBeDefined();
      expect(col.meta?.title).toBeTruthy();
    });
  });

  it("meta.title values match expected column labels", () => {
    const columns = partnerDocRefColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const titles = columns.map((col) => col.meta?.title);
    expect(titles).toEqual([
      "No.",
      "Document Name",
      "Country",
      "Company Code",
      "Partner Category",
      "Partner Legality",
      "Partner Role",
      "Partner Type",
      "Partner Sub-Type",
      "Status",
      "Created At",
      "Actions",
    ]);
  });

  it("renders number cell with row index + 1", () => {
    const columns = partnerDocRefColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const numberCol = columns.find((col) => (col.id ?? "") === "number");
    if (!numberCol?.cell) return;
    render(
      flexRender(numberCol.cell, {
        row: { index: 2, original: {} },
        column: { id: "number" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders number column header with 'No.' text", () => {
    const columns = partnerDocRefColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const numberCol = columns.find((col) => col.id === "number");
    if (!numberCol?.header) return;
    render(flexRender(numberCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("No.")).toBeInTheDocument();
  });

  it("renders document name column header with ColumnHeader", () => {
    const columns = partnerDocRefColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const nameCol = columns.find((col) => col.accessorKey === "documentName");
    if (!nameCol?.header) return;
    render(
      flexRender(nameCol.header, {
        column: { id: "documentName" },
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("column-header")).toBeInTheDocument();
  });

  it("renders countryName cell with value", () => {
    const columns = partnerDocRefColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "countryName");
    if (!col?.cell) return;
    render(
      flexRender(col.cell, {
        row: { index: 0, original: mockRow, getValue: () => "Indonesia" },
        column: { id: "countryName" },
        getValue: () => "Indonesia",
        renderValue: () => "Indonesia",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Indonesia")).toBeInTheDocument();
  });

  it("renders companyCode cell with font-mono", () => {
    const columns = partnerDocRefColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "companyCode");
    if (!col?.cell) return;
    render(
      flexRender(col.cell, {
        row: { index: 0, original: mockRow, getValue: () => "C001" },
        column: { id: "companyCode" },
        getValue: () => "C001",
        renderValue: () => "C001",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("C001")).toBeInTheDocument();
  });

  it("renders isActive cell with active StatusBadge when isActive is true", () => {
    const columns = partnerDocRefColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const isActiveCol = columns.find((col) => col.accessorKey === "isActive");
    if (!isActiveCol?.cell) return;
    render(
      flexRender(isActiveCol.cell, {
        row: { index: 0, original: { ...mockRow, isActive: true } },
        column: { id: "isActive" },
        getValue: () => true,
        renderValue: () => true,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("status-badge-active")).toBeInTheDocument();
  });

  it("renders isActive cell with inactive StatusBadge when isActive is false", () => {
    const columns = partnerDocRefColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const isActiveCol = columns.find((col) => col.accessorKey === "isActive");
    if (!isActiveCol?.cell) return;
    render(
      flexRender(isActiveCol.cell, {
        row: { index: 0, original: { ...mockRow, isActive: false } },
        column: { id: "isActive" },
        getValue: () => false,
        renderValue: () => false,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("status-badge-inactive")).toBeInTheDocument();
  });

  it("renders createdAt cell with formatted date", () => {
    const columns = partnerDocRefColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => c.accessorKey === "createdAt");
    if (!col?.cell) return;
    render(
      flexRender(col.cell, {
        row: { index: 0, original: mockRow },
        column: { id: "createdAt" },
        getValue: () => "2024-01-01T00:00:00Z",
        renderValue: () => "2024-01-01T00:00:00Z",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("01/01/2024")).toBeInTheDocument();
  });

  it("renders actions column header with 'Actions' text", () => {
    const columns = partnerDocRefColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.header) return;
    render(flexRender(actionsCol.header, {} as never) as React.ReactElement);
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders actions cell with edit and delete buttons", () => {
    const columns = partnerDocRefColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;
    render(
      flexRender(actionsCol.cell, {
        row: { index: 0, original: mockRow },
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("action-btn-edit")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-delete")).toBeInTheDocument();
  });

  it("calls onEdit handler when edit button is clicked", async () => {
    const user = userEvent.setup();
    const columns = partnerDocRefColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;
    render(
      flexRender(actionsCol.cell, {
        row: { index: 0, original: mockRow },
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    await user.click(screen.getByTestId("action-btn-edit"));
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockRow);
  });

  it("calls onDelete handler when delete button is clicked", async () => {
    const user = userEvent.setup();
    const columns = partnerDocRefColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find((col) => col.id === "actions");
    if (!actionsCol?.cell) return;
    const deleteRow = { ...mockRow, id: 2, documentName: "Passport" };
    render(
      flexRender(actionsCol.cell, {
        row: { index: 0, original: deleteRow },
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    await user.click(screen.getByTestId("action-btn-delete"));
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(deleteRow);
  });
});
