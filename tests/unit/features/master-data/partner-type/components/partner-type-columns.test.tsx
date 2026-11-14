import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { partnerTypeColumns } from "@/features/master-data/partner-type/components/partner-type-columns";

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      ActionButton: ({ onClick, tooltip, ...props }: any) => (
        <button
          onClick={onClick}
          aria-label={tooltip}
          data-variant={props.variant}
          {...props}
        >
          {tooltip}
        </button>
      ),
      ActionButton: ({ onClick, tooltip, ...props }: any) => (
        <button
          onClick={onClick}
          aria-label={tooltip}
          data-variant={props.variant}
          {...props}
        >
          {tooltip}
        </button>
      ),
      ColumnHeader: ({ column }: any) => <th>{column.id}</th>,

      StatusBadge: ({ status }: { status: string }) => (
        <span data-status={status}>{status}</span>
      ),
      Badge: ({ children, variant }: any) => (
        <span data-variant={variant}>{children}</span>
      ),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);

const mockHandlers = {
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

const baseRow = {
  index: 0,
  original: {
    id: 1,
    code: "PT-001",
    name: "Supplier",
    partnerLegality: { id: 1, name: "Vendor" },
    description: "A supplier partner type",
    isActive: true,
    integratedToErp: true,
  },
  getValue: (key: string) => {
    const values: Record<string, any> = {
      code: "PT-001",
      name: "Supplier",
    };
    return values[key];
  },
};

function createCellRenderer(columnIndex: number) {
  const columns = partnerTypeColumns(mockHandlers);
  const column = columns[columnIndex];
  return (rowOverrides = {}) =>
    column.cell
      ? (column.cell as any)({
          row: { ...baseRow, ...rowOverrides },
          column: { id: column.accessorKey || column.id },
        })
      : null;
}

describe("partnerTypeColumns", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 8 columns", () => {
    const columns = partnerTypeColumns(mockHandlers);
    expect(columns).toHaveLength(8);
  });

  it("renders number column with index + 1", () => {
    const columns = partnerTypeColumns(mockHandlers);
    const cell = columns[0].cell as any;
    const { container } = render(cell({ row: { index: 0 } }));
    expect(container).toHaveTextContent("1");
  });

  it("renders code column with value", () => {
    const columns = partnerTypeColumns(mockHandlers);
    const cell = columns[1].cell as any;
    const { container } = render(
      cell({
        row: { getValue: () => "PT-001", original: baseRow.original },
        column: { id: "code" },
      }),
    );
    expect(container).toHaveTextContent("PT-001");
  });

  it("renders code column with dash when no value", () => {
    const columns = partnerTypeColumns(mockHandlers);
    const cell = columns[1].cell as any;
    const { container } = render(
      cell({
        row: { getValue: () => null, original: baseRow.original },
        column: { id: "code" },
      }),
    );
    expect(container).toHaveTextContent("-");
  });

  it("renders name column with value", () => {
    const columns = partnerTypeColumns(mockHandlers);
    const cell = columns[2].cell as any;
    const { container } = render(
      cell({
        row: { getValue: () => "Supplier", original: baseRow.original },
        column: { id: "name" },
      }),
    );
    expect(container).toHaveTextContent("Supplier");
  });

  it("renders partnerLegality with name", () => {
    const columns = partnerTypeColumns(mockHandlers);
    const cell = columns[3].cell as any;
    const { container } = render(cell({ row: { original: baseRow.original } }));
    expect(container).toHaveTextContent("Vendor");
  });

  it("renders description with dash when empty", () => {
    const columns = partnerTypeColumns(mockHandlers);
    const cell = columns[4].cell as any;
    const { container } = render(
      cell({
        row: {
          original: { ...baseRow.original, description: null },
          getValue: () => null,
        },
        column: { id: "description" },
      }),
    );
    expect(container).toHaveTextContent("-");
  });

  it("renders active status badge", () => {
    const columns = partnerTypeColumns(mockHandlers);
    const cell = columns[5].cell as any;
    render(
      cell({ row: { original: { ...baseRow.original, isActive: true } } }),
    );
    expect(screen.getByText("active")).toBeInTheDocument();
  });

  it("renders inactive status badge", () => {
    const columns = partnerTypeColumns(mockHandlers);
    const cell = columns[5].cell as any;
    render(
      cell({ row: { original: { ...baseRow.original, isActive: false } } }),
    );
    expect(screen.getByText("inactive")).toBeInTheDocument();
  });

  it("renders integratedToErp yes badge", () => {
    const columns = partnerTypeColumns(mockHandlers);
    const cell = columns[6].cell as any;
    render(
      cell({
        row: { original: { ...baseRow.original, integratedToErp: true } },
      }),
    );
    expect(screen.getByText("Yes")).toBeInTheDocument();
  });

  it("renders integratedToErp no badge", () => {
    const columns = partnerTypeColumns(mockHandlers);
    const cell = columns[6].cell as any;
    render(
      cell({
        row: { original: { ...baseRow.original, integratedToErp: false } },
      }),
    );
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("calls onEdit when edit button clicked", async () => {
    const user = userEvent.setup();
    const columns = partnerTypeColumns(mockHandlers);
    const cell = columns[7].cell as any;
    render(cell({ row: { original: baseRow.original } }));
    await user.click(screen.getByLabelText("Edit"));
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(baseRow.original);
  });

  it("calls onDelete when delete button clicked", async () => {
    const user = userEvent.setup();
    const columns = partnerTypeColumns(mockHandlers);
    const cell = columns[7].cell as any;
    render(cell({ row: { original: baseRow.original } }));
    await user.click(screen.getByLabelText("Delete"));
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(baseRow.original);
  });
});
