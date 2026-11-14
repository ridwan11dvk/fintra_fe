import type { ChartOfAccountActionHandlers } from "@/features/master-data/chart-of-account/data/chart-of-account.types";
import { chartOfAccountColumns } from "@/features/master-data/chart-of-account/components/chart-of-account-columns";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { mockChartOfAccount } from "../data/chart-of-account.handlers";

vi.mock("@railfinance/core", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    Visibility: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    TooltipTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    TooltipContent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    ColumnHeader: ({ title }: { title: string }) => <div>{title}</div>,
  };
});

vi.mock("@railfinance/core/components/actions", () => ({
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
}));

type TestColumnDef = {
  id?: string;
  accessorKey?: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  meta?: { title: string };
  cell?: (ctx: { row: { original: typeof mockChartOfAccount } }) => React.ReactNode;
  header?: (ctx: { column: unknown }) => React.ReactNode;
};

const mockHandlers: ChartOfAccountActionHandlers = {
  onView: vi.fn(),
  onEdit: vi.fn(),
  onActivate: vi.fn(),
  onDeactivate: vi.fn(),
};

describe("chartOfAccountColumns", () => {
  it("returns 4 columns", () => {
    const columns = chartOfAccountColumns(mockHandlers);
    expect(columns).toHaveLength(4);
  });

  it("has correct column accessor keys and ids", () => {
    const columns = chartOfAccountColumns(mockHandlers) as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual(["code", "name", "level", "actions"]);
  });

  it("renders cell values correctly for code, name, level", () => {
    const columns = chartOfAccountColumns(mockHandlers) as TestColumnDef[];

    const codeCol = columns.find((c) => c.accessorKey === "code");
    const nameCol = columns.find((c) => c.accessorKey === "name");
    const levelCol = columns.find((c) => c.accessorKey === "level");

    const row = { original: mockChartOfAccount };

    render(<>{codeCol?.cell?.({ row })}</>);
    const codeEl = screen.getByText("11100");
    expect(codeEl).toBeInTheDocument();
    expect(codeEl).toHaveClass("truncate");
    expect(codeEl).toHaveAttribute("title", "11100");

    render(<>{nameCol?.cell?.({ row })}</>);
    const nameEl = screen.getByText("Cash and Cash Equivalents");
    expect(nameEl).toBeInTheDocument();
    expect(nameEl).toHaveClass("truncate");
    expect(nameEl).toHaveAttribute("title", "Cash and Cash Equivalents");

    const { container: levelContainer } = render(<>{levelCol?.cell?.({ row })}</>);
    expect(levelContainer.textContent).toContain("1");
  });

  it("triggers action handlers on click", async () => {
    const user = userEvent.setup();
    const handlers: ChartOfAccountActionHandlers = {
      onView: vi.fn(),
      onEdit: vi.fn(),
      onActivate: vi.fn(),
      onDeactivate: vi.fn(),
    };

    const columns = chartOfAccountColumns(handlers) as TestColumnDef[];
    const actionsCol = columns.find((c) => c.id === "actions");
    const row = { original: mockChartOfAccount };

    render(<>{actionsCol?.cell?.({ row })}</>);

    const viewBtn = screen.getByTestId("action-show");
    await user.click(viewBtn);
    expect(handlers.onView).toHaveBeenCalledWith(mockChartOfAccount);

    const toggleBtn = screen.getByTestId("action-deactivate");
    await user.click(toggleBtn);
    expect(handlers.onDeactivate).toHaveBeenCalledWith(mockChartOfAccount);

    const editBtn = screen.getByTestId("action-edit");
    await user.click(editBtn);
    expect(handlers.onEdit).toHaveBeenCalledWith(mockChartOfAccount);
  });

  it("triggers onActivate when row is inactive", async () => {
    const user = userEvent.setup();
    const handlers: ChartOfAccountActionHandlers = {
      onActivate: vi.fn(),
    };

    const columns = chartOfAccountColumns(handlers) as TestColumnDef[];
    const actionsCol = columns.find((c) => c.id === "actions");
    const row = { original: { ...mockChartOfAccount, active: false } };

    render(<>{actionsCol?.cell?.({ row })}</>);

    const toggleBtn = screen.getByTestId("action-activate");
    await user.click(toggleBtn);
    expect(handlers.onActivate).toHaveBeenCalledWith(row.original);
  });
});
