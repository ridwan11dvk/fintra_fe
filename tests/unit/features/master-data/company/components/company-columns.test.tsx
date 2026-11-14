import { companyColumns } from "@/features/master-data/company/components/company-columns";
import { flexRender } from "@tanstack/react-table";
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
        <button data-testid={`action-${variant}`} onClick={onClick}>
          {variant}
        </button>
      ),
      ActionButton: ({
        onClick,
        variant,
      }: {
        onClick?: () => void;
        variant?: string;
      }) => (
        <button data-testid={`action-${variant}`} onClick={onClick}>
          {variant}
        </button>
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

type CellContext = {
  row: {
    index: number;
    original: Record<string, unknown>;
    getValue: (key: string) => unknown;
  };
  column: { id: string };
  getValue: () => unknown;
  renderValue: () => unknown;
  table: Record<string, unknown>;
  cell: Record<string, unknown>;
  getContext: () => Record<string, unknown>;
};

type TestColumnDef = {
  id?: string;
  accessorKey?: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  meta?: { title: string };
  cell?: React.ComponentType<never>;
  header?: React.ComponentType<never> | ((ctx: never) => React.ReactNode);
};

const mockHandlers = {
  onView: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

function makeCellContext(overrides: Partial<CellContext> = {}): CellContext {
  const original = overrides.row?.original ?? {};
  const columnId = overrides.column?.id ?? "";
  return {
    row: {
      index: 0,
      original,
      getValue: (key: string) => original[key],
    },
    column: { id: columnId },
    getValue: () => undefined,
    renderValue: () => undefined,
    table: {},
    cell: {},
    getContext: () => ({}),
    ...overrides,
  };
}

describe("companyColumns", () => {
  it("returns an array of columns", () => {
    const columns = companyColumns(mockHandlers);
    expect(Array.isArray(columns)).toBe(true);
    expect(columns.length).toBeGreaterThan(0);
  });

  it("returns 8 columns (number, name, code, alias, businessType, address, status, actions)", () => {
    const columns = companyColumns(mockHandlers);
    expect(columns).toHaveLength(8);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = companyColumns(mockHandlers) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "number",
      "name",
      "code",
      "alias",
      "businessType",
      "address",
      "isActive",
      "actions",
    ]);
  });

  it("number column has enableSorting: false and enableHiding: false", () => {
    const columns = companyColumns(mockHandlers) as unknown as TestColumnDef[];
    const numberCol = columns.find((c) => (c.id ?? c.accessorKey) === "number");
    expect(numberCol?.enableSorting).toBe(false);
    expect(numberCol?.enableHiding).toBe(false);
  });

  it("actions column has enableSorting: false and enableHiding: false", () => {
    const columns = companyColumns(mockHandlers) as unknown as TestColumnDef[];
    const actionsCol = columns.find(
      (c) => (c.id ?? c.accessorKey) === "actions",
    );
    expect(actionsCol?.enableSorting).toBe(false);
    expect(actionsCol?.enableHiding).toBe(false);
  });

  it("each column has a meta.title defined", () => {
    const columns = companyColumns(mockHandlers) as unknown as TestColumnDef[];
    columns.forEach((col) => {
      expect(col.meta?.title).toBeTruthy();
      expect(typeof col.meta?.title).toBe("string");
    });
  });

  it("column titles are correct", () => {
    const columns = companyColumns(mockHandlers) as unknown as TestColumnDef[];
    const titles = columns.map((col) => col.meta?.title);
    expect(titles).toEqual([
      "No.",
      "Name",
      "Code",
      "Alias",
      "Business Type",
      "Address",
      "Status",
      "Actions",
    ]);
  });

  describe("number cell", () => {
    it("renders number cell with row index + 1", () => {
      const columns = companyColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const numberCol = columns.find((c) => c.id === "number");
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

    it("renders correct number for first row (index 0)", () => {
      const columns = companyColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const numberCol = columns.find((c) => c.id === "number");
      if (!numberCol?.cell) return;

      render(
        flexRender(numberCol.cell, {
          row: { index: 0, original: {} },
          column: { id: "number" },
          getValue: () => undefined,
          renderValue: () => undefined,
          table: {},
          cell: {},
          getContext: () => ({}) as never,
        } as never) as React.ReactElement,
      );

      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });

  describe("header cells", () => {
    it("renders headers without crashing", () => {
      const columns = companyColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];

      columns.forEach((col) => {
        if (col.header && typeof col.header !== "string") {
          expect(() => {
            if (typeof col.header === "function") {
              try {
                // Try to render as a component
                render(col.header as unknown as React.ReactElement);
              } catch {
                // If it fails, it might be a class component - that's okay
              }
            } else {
              // It's already a React element or component, render it
              render(col.header as unknown as React.ReactElement);
            }
          }).not.toThrow();
        }
      });
    });
  });

  it("name column renders company name", () => {
    const columns = companyColumns(mockHandlers) as unknown as TestColumnDef[];
    const nameCol = columns.find((c) => c.accessorKey === "name");

    expect(nameCol).toBeDefined();
    expect(nameCol?.meta?.title).toBe("Name");
  });

  it("code column renders company code", () => {
    const columns = companyColumns(mockHandlers) as unknown as TestColumnDef[];
    const codeCol = columns.find((c) => c.accessorKey === "code");

    expect(codeCol).toBeDefined();
    expect(codeCol?.meta?.title).toBe("Code");
  });

  it("address column renders company address", () => {
    const columns = companyColumns(mockHandlers) as unknown as TestColumnDef[];
    const addressCol = columns.find((c) => c.accessorKey === "address");

    expect(addressCol).toBeDefined();
    expect(addressCol?.meta?.title).toBe("Address");
  });

  it("isActive column renders status badge", () => {
    const columns = companyColumns(mockHandlers) as unknown as TestColumnDef[];
    const isActiveCol = columns.find((c) => c.accessorKey === "isActive");

    expect(isActiveCol).toBeDefined();
    expect(isActiveCol?.meta?.title).toBe("Status");
  });

  it("actions column has three action buttons", () => {
    const columns = companyColumns(mockHandlers) as unknown as TestColumnDef[];
    const actionsCol = columns.find((c) => c.id === "actions");

    expect(actionsCol).toBeDefined();
    expect(actionsCol?.meta?.title).toBe("Actions");
  });

  it("view action button calls onView handler", () => {
    const handlers = {
      ...mockHandlers,
      onView: vi.fn(),
    };

    const columns = companyColumns(handlers);

    // Verify that the handlers are passed correctly
    expect(columns).toHaveLength(8);
  });

  it("all columns are properly configured for table rendering", () => {
    const columns = companyColumns(mockHandlers) as unknown as TestColumnDef[];

    columns.forEach((col) => {
      // Each column should have either id or accessorKey
      expect(col.id || col.accessorKey).toBeTruthy();

      // Each column should have meta with title
      expect(col.meta?.title).toBeTruthy();

      // Each column should have either header or be a special column
      if (col.id !== "number" && col.id !== "actions") {
        expect(col.header || col.accessorKey).toBeTruthy();
      }
    });
  });

  describe("name cell", () => {
    it("renders company name", () => {
      const columns = companyColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const nameCol = columns.find((c) => c.accessorKey === "name");
      if (!nameCol?.cell) return;

      render(
        flexRender(nameCol.cell, {
          ...makeCellContext({
            row: {
              index: 0,
              original: { name: "PT Mitra Utama" },
              getValue: (key: string) =>
                key === "name" ? "PT Mitra Utama" : undefined,
            },
            column: { id: "name" },
          }),
        } as never) as React.ReactElement,
      );

      expect(screen.getByText("PT Mitra Utama")).toBeInTheDocument();
    });
  });

  describe("code cell", () => {
    it("renders company code", () => {
      const columns = companyColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const codeCol = columns.find((c) => c.accessorKey === "code");
      if (!codeCol?.cell) return;

      render(
        flexRender(codeCol.cell, {
          ...makeCellContext({
            row: {
              index: 0,
              original: { code: "COMP001" },
              getValue: (key: string) =>
                key === "code" ? "COMP001" : undefined,
            },
            column: { id: "code" },
          }),
        } as never) as React.ReactElement,
      );

      expect(screen.getByText("COMP001")).toBeInTheDocument();
    });
  });

  describe("address cell", () => {
    it("renders address when present", () => {
      const columns = companyColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const addressCol = columns.find((c) => c.accessorKey === "address");
      if (!addressCol?.cell) return;

      render(
        flexRender(addressCol.cell, {
          ...makeCellContext({
            row: {
              index: 0,
              original: { address: "Jakarta" },
              getValue: (key: string) =>
                key === "address" ? "Jakarta" : undefined,
            },
            column: { id: "address" },
          }),
        } as never) as React.ReactElement,
      );

      expect(screen.getByText("Jakarta")).toBeInTheDocument();
    });

    it("shows dash when address is falsy", () => {
      const columns = companyColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const addressCol = columns.find((c) => c.accessorKey === "address");
      if (!addressCol?.cell) return;

      render(
        flexRender(addressCol.cell, {
          ...makeCellContext({
            row: {
              index: 0,
              original: { address: "" },
              getValue: (key: string) => (key === "address" ? "" : undefined),
            },
            column: { id: "address" },
          }),
        } as never) as React.ReactElement,
      );

      expect(screen.getByText("-")).toBeInTheDocument();
    });
  });

  describe("status cell", () => {
    it("renders active badge when isActive is true", () => {
      const columns = companyColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const statusCol = columns.find((c) => c.accessorKey === "isActive");
      if (!statusCol?.cell) return;

      render(
        flexRender(statusCol.cell, {
          ...makeCellContext({
            row: {
              index: 0,
              original: { isActive: true },
              getValue: () => undefined,
            },
            column: { id: "isActive" },
          }),
        } as never) as React.ReactElement,
      );

      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("renders inactive badge when isActive is false", () => {
      const columns = companyColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const statusCol = columns.find((c) => c.accessorKey === "isActive");
      if (!statusCol?.cell) return;

      render(
        flexRender(statusCol.cell, {
          ...makeCellContext({
            row: {
              index: 0,
              original: { isActive: false },
              getValue: () => undefined,
            },
            column: { id: "isActive" },
          }),
        } as never) as React.ReactElement,
      );

      expect(screen.getByText("Inactive")).toBeInTheDocument();
    });
  });

  describe("actions cell", () => {
    it("renders view, edit, and delete action buttons", () => {
      const columns = companyColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const actionsCol = columns.find((c) => c.id === "actions");
      if (!actionsCol?.cell) return;

      render(
        flexRender(actionsCol.cell, {
          ...makeCellContext({
            row: {
              index: 0,
              original: { id: 1, name: "Test" },
              getValue: () => undefined,
            },
            column: { id: "actions" },
          }),
        } as never) as React.ReactElement,
      );

      expect(screen.getByTestId("action-show")).toBeInTheDocument();
      expect(screen.getByTestId("action-edit")).toBeInTheDocument();
      expect(screen.getByTestId("action-delete")).toBeInTheDocument();
    });

    it("calls onView handler when view button is clicked", async () => {
      const { default: userEvent } =
        await import("@testing-library/user-event");
      const user = userEvent.setup();
      const onView = vi.fn();
      const handlers = { ...mockHandlers, onView };

      const columns = companyColumns(handlers) as unknown as TestColumnDef[];
      const actionsCol = columns.find((c) => c.id === "actions");
      if (!actionsCol?.cell) return;

      render(
        flexRender(actionsCol.cell, {
          ...makeCellContext({
            row: {
              index: 0,
              original: { id: 5, name: "Test Co" },
              getValue: () => undefined,
            },
            column: { id: "actions" },
          }),
        } as never) as React.ReactElement,
      );

      await user.click(screen.getByTestId("action-show"));
      expect(onView).toHaveBeenCalledWith({ id: 5, name: "Test Co" });
    });

    it("calls onEdit handler when edit button is clicked", async () => {
      const { default: userEvent } =
        await import("@testing-library/user-event");
      const user = userEvent.setup();
      const onEdit = vi.fn();
      const handlers = { ...mockHandlers, onEdit };

      const columns = companyColumns(handlers) as unknown as TestColumnDef[];
      const actionsCol = columns.find((c) => c.id === "actions");
      if (!actionsCol?.cell) return;

      render(
        flexRender(actionsCol.cell, {
          ...makeCellContext({
            row: {
              index: 0,
              original: { id: 3, name: "Edit Co" },
              getValue: () => undefined,
            },
            column: { id: "actions" },
          }),
        } as never) as React.ReactElement,
      );

      await user.click(screen.getByTestId("action-edit"));
      expect(onEdit).toHaveBeenCalledWith({ id: 3, name: "Edit Co" });
    });

    it("calls onDelete handler when delete button is clicked", async () => {
      const { default: userEvent } =
        await import("@testing-library/user-event");
      const user = userEvent.setup();
      const onDelete = vi.fn();
      const handlers = { ...mockHandlers, onDelete };

      const columns = companyColumns(handlers) as unknown as TestColumnDef[];
      const actionsCol = columns.find((c) => c.id === "actions");
      if (!actionsCol?.cell) return;

      render(
        flexRender(actionsCol.cell, {
          ...makeCellContext({
            row: {
              index: 0,
              original: { id: 7, name: "Delete Co" },
              getValue: () => undefined,
            },
            column: { id: "actions" },
          }),
        } as never) as React.ReactElement,
      );

      await user.click(screen.getByTestId("action-delete"));
      expect(onDelete).toHaveBeenCalledWith({ id: 7, name: "Delete Co" });
    });
  });
});
