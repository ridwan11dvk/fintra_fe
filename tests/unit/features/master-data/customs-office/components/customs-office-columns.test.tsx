import { customsOfficeColumns } from "@/features/master-data/customs-office/components/customs-office-columns";
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
      ColumnHeader: ({ column }: { column: { id: string } }) => (
        <div data-testid={`column-header-${column.id}`}>Header</div>
      ),

      StatusBadge: ({ status }: { status: string }) => (
        <span data-testid={`status-badge-${status}`}>{status}</span>
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
  header?:
    | React.ComponentType<never>
    | ((ctx: { column: { id: string } }) => React.ReactNode);
};

const mockHandlers = {
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe("customsOfficeColumns", () => {
  it("returns an array of 5 columns", () => {
    const columns = customsOfficeColumns(mockHandlers);
    expect(columns).toHaveLength(5);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = customsOfficeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual(["number", "code", "name", "isActive", "actions"]);
  });

  it("number column has enableSorting: false and enableHiding: false", () => {
    const columns = customsOfficeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const numberCol = columns.find((c) => (c.id ?? c.accessorKey) === "number");
    expect(numberCol?.enableSorting).toBe(false);
    expect(numberCol?.enableHiding).toBe(false);
  });

  it("actions column has enableSorting: false and enableHiding: false", () => {
    const columns = customsOfficeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find(
      (c) => (c.id ?? c.accessorKey) === "actions",
    );
    expect(actionsCol?.enableSorting).toBe(false);
    expect(actionsCol?.enableHiding).toBe(false);
  });

  it("each column has a meta.title defined", () => {
    const columns = customsOfficeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    columns.forEach((col) => {
      expect(col.meta?.title).toBeTruthy();
    });
  });

  it("column titles are correct", () => {
    const columns = customsOfficeColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const titles = columns.map((col) => col.meta?.title);
    expect(titles).toEqual(["No.", "Code", "Name", "Status", "Actions"]);
  });

  describe("number header", () => {
    it('renders "No." as header text', () => {
      const columns = customsOfficeColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const numberCol = columns.find((c) => c.id === "number");
      if (!numberCol?.header) return;

      render(
        flexRender(numberCol.header, {
          column: { id: "number" },
          header: { id: "number" },
          getContext: () => ({}),
        } as never) as React.ReactElement,
      );

      expect(screen.getByText("No.")).toBeInTheDocument();
    });
  });

  describe("code header", () => {
    it("renders ColumnHeader for code column", () => {
      const columns = customsOfficeColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const codeCol = columns.find((c) => c.accessorKey === "code");
      if (!codeCol?.header) return;

      render(
        flexRender(codeCol.header, {
          column: { id: "code" },
          header: { id: "code" },
          getContext: () => ({}),
        } as never) as React.ReactElement,
      );

      expect(screen.getByTestId("column-header-code")).toBeInTheDocument();
    });
  });

  describe("name header", () => {
    it("renders ColumnHeader for name column", () => {
      const columns = customsOfficeColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const nameCol = columns.find((c) => c.accessorKey === "name");
      if (!nameCol?.header) return;

      render(
        flexRender(nameCol.header, {
          column: { id: "name" },
          header: { id: "name" },
          getContext: () => ({}),
        } as never) as React.ReactElement,
      );

      expect(screen.getByTestId("column-header-name")).toBeInTheDocument();
    });
  });

  describe("isActive header", () => {
    it("renders ColumnHeader for isActive column with center alignment", () => {
      const columns = customsOfficeColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const statusCol = columns.find((c) => c.accessorKey === "isActive");
      if (!statusCol?.header) return;

      render(
        flexRender(statusCol.header, {
          column: { id: "isActive" },
          header: { id: "isActive" },
          getContext: () => ({}),
        } as never) as React.ReactElement,
      );

      expect(screen.getByTestId("column-header-isActive")).toBeInTheDocument();
    });
  });

  describe("actions header", () => {
    it('renders "Actions" as header text', () => {
      const columns = customsOfficeColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const actionsCol = columns.find((c) => c.id === "actions");
      if (!actionsCol?.header) return;

      render(
        flexRender(actionsCol.header, {
          column: { id: "actions" },
          header: { id: "actions" },
          getContext: () => ({}),
        } as never) as React.ReactElement,
      );

      expect(screen.getByText("Actions")).toBeInTheDocument();
    });
  });

  describe("number cell", () => {
    it("renders number cell with row index + 1", () => {
      const columns = customsOfficeColumns(
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
  });

  describe("code cell", () => {
    it("renders customs office code", () => {
      const columns = customsOfficeColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const codeCol = columns.find((c) => c.accessorKey === "code");
      if (!codeCol?.cell) return;

      render(
        flexRender(codeCol.cell, {
          row: {
            index: 0,
            original: { code: "KPPBC-001" },
            getValue: () => "KPPBC-001",
          },
          column: { id: "code" },
          getValue: () => "KPPBC-001",
          renderValue: () => "KPPBC-001",
          table: {},
          cell: {},
          getContext: () => ({}) as never,
        } as never) as React.ReactElement,
      );

      expect(screen.getByText("KPPBC-001")).toBeInTheDocument();
    });
  });

  describe("name cell", () => {
    it("renders customs office name", () => {
      const columns = customsOfficeColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const nameCol = columns.find((c) => c.accessorKey === "name");
      if (!nameCol?.cell) return;

      render(
        flexRender(nameCol.cell, {
          row: {
            index: 0,
            original: { name: "KPPBC Jakarta" },
            getValue: () => "KPPBC Jakarta",
          },
          column: { id: "name" },
          getValue: () => "KPPBC Jakarta",
          renderValue: () => "KPPBC Jakarta",
          table: {},
          cell: {},
          getContext: () => ({}) as never,
        } as never) as React.ReactElement,
      );

      expect(screen.getByText("KPPBC Jakarta")).toBeInTheDocument();
    });
  });

  describe("isActive cell", () => {
    it("renders active badge when isActive is true", () => {
      const columns = customsOfficeColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const statusCol = columns.find((c) => c.accessorKey === "isActive");
      if (!statusCol?.cell) return;

      render(
        flexRender(statusCol.cell, {
          row: { index: 0, original: { isActive: true }, getValue: () => true },
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

    it("renders inactive badge when isActive is false", () => {
      const columns = customsOfficeColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const statusCol = columns.find((c) => c.accessorKey === "isActive");
      if (!statusCol?.cell) return;

      render(
        flexRender(statusCol.cell, {
          row: {
            index: 0,
            original: { isActive: false },
            getValue: () => false,
          },
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
  });

  describe("actions cell", () => {
    it("renders edit and delete action buttons", () => {
      const columns = customsOfficeColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const actionsCol = columns.find((c) => c.id === "actions");
      if (!actionsCol?.cell) return;

      render(
        flexRender(actionsCol.cell, {
          row: {
            index: 0,
            original: { id: 1, name: "Test" },
            getValue: () => undefined,
          },
          column: { id: "actions" },
          getValue: () => undefined,
          renderValue: () => undefined,
          table: {},
          cell: {},
          getContext: () => ({}) as never,
        } as never) as React.ReactElement,
      );

      expect(screen.getByTestId("action-edit")).toBeInTheDocument();
      expect(screen.getByTestId("action-delete")).toBeInTheDocument();
    });

    it("calls onEdit handler when edit button is clicked", async () => {
      const { default: userEvent } =
        await import("@testing-library/user-event");
      const user = userEvent.setup();
      const onEdit = vi.fn();

      const columns = customsOfficeColumns({
        ...mockHandlers,
        onEdit,
      }) as unknown as TestColumnDef[];
      const actionsCol = columns.find((c) => c.id === "actions");
      if (!actionsCol?.cell) return;

      render(
        flexRender(actionsCol.cell, {
          row: {
            index: 0,
            original: { id: 3, name: "Edit Office" },
            getValue: () => undefined,
          },
          column: { id: "actions" },
          getValue: () => undefined,
          renderValue: () => undefined,
          table: {},
          cell: {},
          getContext: () => ({}) as never,
        } as never) as React.ReactElement,
      );

      await user.click(screen.getByTestId("action-edit"));
      expect(onEdit).toHaveBeenCalledWith({ id: 3, name: "Edit Office" });
    });

    it("calls onDelete handler when delete button is clicked", async () => {
      const { default: userEvent } =
        await import("@testing-library/user-event");
      const user = userEvent.setup();
      const onDelete = vi.fn();

      const columns = customsOfficeColumns({
        ...mockHandlers,
        onDelete,
      }) as unknown as TestColumnDef[];
      const actionsCol = columns.find((c) => c.id === "actions");
      if (!actionsCol?.cell) return;

      render(
        flexRender(actionsCol.cell, {
          row: {
            index: 0,
            original: { id: 7, name: "Delete Office" },
            getValue: () => undefined,
          },
          column: { id: "actions" },
          getValue: () => undefined,
          renderValue: () => undefined,
          table: {},
          cell: {},
          getContext: () => ({}) as never,
        } as never) as React.ReactElement,
      );

      await user.click(screen.getByTestId("action-delete"));
      expect(onDelete).toHaveBeenCalledWith({ id: 7, name: "Delete Office" });
    });
  });
});
