import { currencyRateColumns } from "@/features/master-data/currency-rate/components/currency-rate-columns";
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
  header?: React.ComponentType<never>;
};

const mockHandlers = {
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe("currencyRateColumns", () => {
  it("returns an array of 8 columns", () => {
    const columns = currencyRateColumns(mockHandlers);
    expect(columns).toHaveLength(8);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = currencyRateColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "number",
      "currencyCode",
      "rateType",
      "rate",
      "startDate",
      "endDate",
      "description",
      "actions",
    ]);
  });

  it("number column has enableSorting: false and enableHiding: false", () => {
    const columns = currencyRateColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const numberCol = columns.find((c) => (c.id ?? c.accessorKey) === "number");
    expect(numberCol?.enableSorting).toBe(false);
    expect(numberCol?.enableHiding).toBe(false);
  });

  it("actions column has enableSorting: false and enableHiding: false", () => {
    const columns = currencyRateColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const actionsCol = columns.find(
      (c) => (c.id ?? c.accessorKey) === "actions",
    );
    expect(actionsCol?.enableSorting).toBe(false);
    expect(actionsCol?.enableHiding).toBe(false);
  });

  it("each column has a meta.title defined", () => {
    const columns = currencyRateColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    columns.forEach((col) => {
      expect(col.meta?.title).toBeTruthy();
    });
  });

  it("column titles are correct", () => {
    const columns = currencyRateColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const titles = columns.map((col) => col.meta?.title);
    expect(titles).toEqual([
      "No.",
      "Currency",
      "Rate Type",
      "Rate",
      "Start Date",
      "End Date",
      "Description",
      "Actions",
    ]);
  });

  describe("number cell", () => {
    it("renders number cell with row index + 1", () => {
      const columns = currencyRateColumns(
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

  describe("currencyCode cell", () => {
    it("renders currency code in uppercase", () => {
      const columns = currencyRateColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const codeCol = columns.find((c) => c.accessorKey === "currencyCode");
      if (!codeCol?.cell) return;

      render(
        flexRender(codeCol.cell, {
          row: {
            index: 0,
            original: { currencyCode: "usd" },
            getValue: () => "usd",
          },
          column: { id: "currencyCode" },
          getValue: () => "usd",
          renderValue: () => "usd",
          table: {},
          cell: {},
          getContext: () => ({}) as never,
        } as never) as React.ReactElement,
      );

      expect(screen.getByText("usd")).toBeInTheDocument();
    });
  });

  describe("rateType cell", () => {
    it("renders rate type", () => {
      const columns = currencyRateColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const typeCol = columns.find((c) => c.accessorKey === "rateType");
      if (!typeCol?.cell) return;

      render(
        flexRender(typeCol.cell, {
          row: {
            index: 0,
            original: { rateType: "KMK" },
            getValue: () => "KMK",
          },
          column: { id: "rateType" },
          getValue: () => "KMK",
          renderValue: () => "KMK",
          table: {},
          cell: {},
          getContext: () => ({}) as never,
        } as never) as React.ReactElement,
      );

      expect(screen.getByText("KMK")).toBeInTheDocument();
    });
  });

  describe("rate cell", () => {
    it("renders rate with formatted number", () => {
      const columns = currencyRateColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const rateCol = columns.find((c) => c.accessorKey === "rate");
      if (!rateCol?.cell) return;

      render(
        flexRender(rateCol.cell, {
          row: {
            index: 0,
            original: { rate: 15500.5 },
            getValue: () => 15500.5,
          },
          column: { id: "rate" },
          getValue: () => 15500.5,
          renderValue: () => 15500.5,
          table: {},
          cell: {},
          getContext: () => ({}) as never,
        } as never) as React.ReactElement,
      );

      expect(screen.getByText("15,500.50")).toBeInTheDocument();
    });
  });

  describe("endDate cell", () => {
    it('renders "Ongoing" when endDate is null', () => {
      const columns = currencyRateColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const endDateCol = columns.find((c) => c.accessorKey === "endDate");
      if (!endDateCol?.cell) return;

      render(
        flexRender(endDateCol.cell, {
          row: { index: 0, original: { endDate: null }, getValue: () => null },
          column: { id: "endDate" },
          getValue: () => null,
          renderValue: () => null,
          table: {},
          cell: {},
          getContext: () => ({}) as never,
        } as never) as React.ReactElement,
      );

      expect(screen.getByText("Ongoing")).toBeInTheDocument();
    });

    it("renders formatted date when endDate is present", () => {
      const columns = currencyRateColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const endDateCol = columns.find((c) => c.accessorKey === "endDate");
      if (!endDateCol?.cell) return;

      render(
        flexRender(endDateCol.cell, {
          row: {
            index: 0,
            original: { endDate: "2024-12-31T00:00:00Z" },
            getValue: () => "2024-12-31T00:00:00Z",
          },
          column: { id: "endDate" },
          getValue: () => "2024-12-31T00:00:00Z",
          renderValue: () => "2024-12-31T00:00:00Z",
          table: {},
          cell: {},
          getContext: () => ({}) as never,
        } as never) as React.ReactElement,
      );

      expect(screen.getByText("12/31/2024")).toBeInTheDocument();
    });
  });

  describe("description cell", () => {
    it("renders description when present", () => {
      const columns = currencyRateColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const descCol = columns.find((c) => c.accessorKey === "description");
      if (!descCol?.cell) return;

      render(
        flexRender(descCol.cell, {
          row: {
            index: 0,
            original: { description: "Official rate" },
            getValue: () => "Official rate",
          },
          column: { id: "description" },
          getValue: () => "Official rate",
          renderValue: () => "Official rate",
          table: {},
          cell: {},
          getContext: () => ({}) as never,
        } as never) as React.ReactElement,
      );

      expect(screen.getByText("Official rate")).toBeInTheDocument();
    });

    it("shows dash when description is falsy", () => {
      const columns = currencyRateColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const descCol = columns.find((c) => c.accessorKey === "description");
      if (!descCol?.cell) return;

      render(
        flexRender(descCol.cell, {
          row: { index: 0, original: { description: "" }, getValue: () => "" },
          column: { id: "description" },
          getValue: () => "",
          renderValue: () => "",
          table: {},
          cell: {},
          getContext: () => ({}) as never,
        } as never) as React.ReactElement,
      );

      expect(screen.getByText("-")).toBeInTheDocument();
    });
  });

  describe("actions cell", () => {
    it("renders edit and delete action buttons", () => {
      const columns = currencyRateColumns(
        mockHandlers,
      ) as unknown as TestColumnDef[];
      const actionsCol = columns.find((c) => c.id === "actions");
      if (!actionsCol?.cell) return;

      render(
        flexRender(actionsCol.cell, {
          row: {
            index: 0,
            original: { id: 1, rateType: "KMK" },
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

      const columns = currencyRateColumns({
        ...mockHandlers,
        onEdit,
      }) as unknown as TestColumnDef[];
      const actionsCol = columns.find((c) => c.id === "actions");
      if (!actionsCol?.cell) return;

      render(
        flexRender(actionsCol.cell, {
          row: {
            index: 0,
            original: { id: 3, currencyCode: "USD" },
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
      expect(onEdit).toHaveBeenCalledWith({ id: 3, currencyCode: "USD" });
    });

    it("calls onDelete handler when delete button is clicked", async () => {
      const { default: userEvent } =
        await import("@testing-library/user-event");
      const user = userEvent.setup();
      const onDelete = vi.fn();

      const columns = currencyRateColumns({
        ...mockHandlers,
        onDelete,
      }) as unknown as TestColumnDef[];
      const actionsCol = columns.find((c) => c.id === "actions");
      if (!actionsCol?.cell) return;

      render(
        flexRender(actionsCol.cell, {
          row: {
            index: 0,
            original: { id: 7, currencyCode: "EUR" },
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
      expect(onDelete).toHaveBeenCalledWith({ id: 7, currencyCode: "EUR" });
    });
  });
});
