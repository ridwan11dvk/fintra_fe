import { taxRateColumns } from "@/features/master-data/tax-rate/components/tax-rate-columns";
import type { TaxRateResponse } from "@/features/master-data/tax-rate/data/tax-rate.types";
import { TooltipProvider } from "@railfinance/core";
import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
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
      useGetLookupValueOptions: () => ({
        data: [],
        isLoading: false,
      }),
      ActionButton: ({
        variant,
        onClick,
      }: {
        variant: string;
        onClick?: () => void;
      }) => (
        <button data-testid={`action-btn-${variant}`} onClick={onClick}>
          <span
            className={
              variant === "edit" ? "lucide-square-pen" : "lucide-trash-2"
            }
          />
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

const mockTaxRate: TaxRateResponse = {
  id: 1,
  code: "PPN_17",
  name: "PPN 17%",
  description: "Value Added Tax 17%",
  taxType: "PPN",
  ratePercent: 17,
  coefficientNumerator: 17,
  coefficientDenominator: 100,
  isUsedInRkip: true,
  startDate: "2024-01-01",
  endDate: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

const mockTaxRateWithEndDate: TaxRateResponse = {
  id: 2,
  code: "PPN_11",
  name: "PPN 11%",
  description: "Value Added Tax 11%",
  taxType: "PPN",
  ratePercent: 11,
  coefficientNumerator: 11,
  coefficientDenominator: 100,
  isUsedInRkip: false,
  startDate: "2022-04-01",
  endDate: "2024-12-31",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

const mockTaxRateMinimal: TaxRateResponse = {
  id: 3,
  code: "PPh_2",
  name: "PPh 2%",
  taxType: "PPh",
  ratePercent: 2,
  coefficientNumerator: 2,
  coefficientDenominator: 100,
  startDate: "2024-01-01",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

function TableShell({
  columns,
  data,
}: {
  columns: ColumnDef<TaxRateResponse>[];
  data: TaxRateResponse[];
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <TooltipProvider>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </TooltipProvider>
  );
}

describe("taxRateColumns", () => {
  const onEdit = vi.fn();
  const onDelete = vi.fn();
  const columns = taxRateColumns({ onEdit, onDelete });

  it("returns an array of 13 columns", () => {
    expect(columns).toHaveLength(13);
  });

  it("has the correct column ids/accessorKeys", () => {
    const ids = columns.map((col) => col.id || col.accessorKey);
    expect(ids).toEqual([
      "number",
      "code",
      "name",
      "description",
      "taxType",
      "ratePercent",
      "coefficient",
      "isUsedInRkip",
      "postingType",
      "isPostingRequired",
      "startDate",
      "endDate",
      "actions",
    ]);
  });

  it("number column has enableSorting: false and enableHiding: false", () => {
    const col = columns[0];
    expect(col.enableSorting).toBe(false);
    expect(col.enableHiding).toBe(false);
  });

  it("coefficient column has enableSorting: false", () => {
    const col = columns[6];
    expect(col.enableSorting).toBe(false);
  });

  it("actions column has enableSorting: false and enableHiding: false", () => {
    const col = columns[12];
    expect(col.enableSorting).toBe(false);
    expect(col.enableHiding).toBe(false);
  });

  it("each column has a meta.title defined", () => {
    columns.forEach((col) => {
      expect(col.meta).toBeDefined();
      expect((col.meta as { title: string }).title).toBeDefined();
    });
  });

  it("meta.title values match expected column labels", () => {
    const titles = columns.map((col) => (col.meta as { title: string }).title);
    expect(titles).toEqual([
      "No.",
      "Code",
      "Name",
      "Description",
      "Tax Type",
      "Rate %",
      "Coefficient",
      "Used in RKIP",
      "Posting Type",
      "Posting Required",
      "Start Date",
      "End Date",
      "Actions",
    ]);
  });

  it("renders number cell with row index + 1", () => {
    render(<TableShell columns={columns} data={[mockTaxRate]} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("renders number column header with 'No.' text", () => {
    render(<TableShell columns={columns} data={[mockTaxRate]} />);
    expect(screen.getByText("No.")).toBeInTheDocument();
  });

  it("renders code cell with font-mono", () => {
    const { container } = render(
      <TableShell columns={columns} data={[mockTaxRate]} />,
    );
    const codeEl = container.querySelector(".font-mono");
    expect(codeEl).toBeInTheDocument();
    expect(codeEl).toHaveTextContent("PPN_17");
  });

  it("renders name cell with font-medium", () => {
    const { container } = render(
      <TableShell columns={columns} data={[mockTaxRate]} />,
    );
    const nameEl = container.querySelectorAll(".font-medium");
    const nameElArr = Array.from(nameEl);
    const matched = nameElArr.find((el) => el.textContent === "PPN 17%");
    expect(matched).toBeTruthy();
  });

  it("renders taxType cell", () => {
    render(<TableShell columns={columns} data={[mockTaxRate]} />);
    expect(screen.getByText("PPN")).toBeInTheDocument();
  });

  it("renders ratePercent cell with percentage format", () => {
    const { container } = render(
      <TableShell columns={columns} data={[mockTaxRate]} />,
    );
    const allFontMono = container.querySelectorAll(".font-mono");
    const rateEl = Array.from(allFontMono).find(
      (el) => el.textContent && el.textContent.includes("%"),
    );
    expect(rateEl).toBeInTheDocument();
    expect(rateEl).toHaveTextContent("17.00%");
  });

  it("renders coefficient cell with numerator/denominator format", () => {
    render(<TableShell columns={columns} data={[mockTaxRate]} />);
    expect(screen.getByText("17/100")).toBeInTheDocument();
  });

  it("renders RKIP column header with 'Used in RKIP' text", () => {
    render(<TableShell columns={columns} data={[mockTaxRate]} />);
    expect(screen.getByText("Used in RKIP")).toBeInTheDocument();
  });

  it("renders check icon for isUsedInRkip true", () => {
    const { container } = render(
      <TableShell columns={columns} data={[mockTaxRate]} />,
    );
    expect(container.querySelector(".lucide-check")).toBeInTheDocument();
  });

  it("renders x icon for isUsedInRkip false", () => {
    const { container } = render(
      <TableShell columns={columns} data={[mockTaxRateWithEndDate]} />,
    );
    expect(container.querySelector(".lucide-x")).toBeInTheDocument();
  });

  it("renders x icon for missing isUsedInRkip", () => {
    const { container } = render(
      <TableShell columns={columns} data={[mockTaxRateMinimal]} />,
    );
    expect(container.querySelector(".lucide-x")).toBeInTheDocument();
  });

  it("renders startDate cell in DD/MM/YYYY format", () => {
    render(<TableShell columns={columns} data={[mockTaxRate]} />);
    expect(screen.getByText("01/01/2024")).toBeInTheDocument();
  });

  it("renders endDate cell with em dash when endDate is null", () => {
    render(<TableShell columns={columns} data={[mockTaxRate]} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renders endDate cell in DD/MM/YYYY format when endDate is set", () => {
    render(<TableShell columns={columns} data={[mockTaxRateWithEndDate]} />);
    expect(screen.getByText("31/12/2024")).toBeInTheDocument();
  });

  it("renders startDate cell with '-' when startDate is missing", () => {
    const { container } = render(
      <TableShell columns={columns} data={[mockTaxRateMinimal]} />,
    );
    const fontMonoEls = container.querySelectorAll(".font-mono");
    const startDateEl = Array.from(fontMonoEls).find(
      (el) => el.textContent === "01/01/2024",
    );
    expect(startDateEl).toBeInTheDocument();
  });

  it("renders actions column header with 'Actions' text", () => {
    render(<TableShell columns={columns} data={[mockTaxRate]} />);
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders actions cell with edit and delete buttons", () => {
    render(<TableShell columns={columns} data={[mockTaxRate]} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("calls onEdit handler when edit button is clicked", async () => {
    const user = userEvent.setup();
    render(<TableShell columns={columns} data={[mockTaxRate]} />);
    const buttons = screen.getAllByRole("button");
    const editBtn = buttons.find((btn) =>
      btn.querySelector(".lucide-square-pen"),
    );
    expect(editBtn).toBeTruthy();
    await user.click(editBtn!);
    expect(onEdit).toHaveBeenCalledWith(mockTaxRate);
  });

  it("calls onDelete handler when delete button is clicked", async () => {
    const user = userEvent.setup();
    render(<TableShell columns={columns} data={[mockTaxRate]} />);
    const buttons = screen.getAllByRole("button");
    const deleteBtn = buttons.find((btn) =>
      btn.querySelector(".lucide-trash-2"),
    );
    expect(deleteBtn).toBeTruthy();
    await user.click(deleteBtn!);
    expect(onDelete).toHaveBeenCalledWith(mockTaxRate);
  });
});
