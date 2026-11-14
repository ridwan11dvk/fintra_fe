import { regencyColumns } from "@/features/master-data/regency/components/regency-columns";
import type { RegencyResponse } from "@/features/master-data/regency/data/regency.types";
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
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);

const mockProvince = {
  id: 1,
  code: "PROV001",
  name: "West Java",
  alias: "Jabar",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

const mockRegency: RegencyResponse = {
  id: 1,
  code: "REG001",
  name: "Bandung",
  provinceId: 1,
  province: mockProvince,
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

const mockRegencyInactive: RegencyResponse = {
  id: 2,
  code: "REG002",
  name: "Surabaya",
  provinceId: 1,
  province: { ...mockProvince, name: "East Java" },
  isActive: false,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

const mockRegencyNoCodeNoProvince: RegencyResponse = {
  id: 3,
  name: "Central Java Regency",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

function TableShell({
  columns,
  data,
}: {
  columns: ColumnDef<RegencyResponse>[];
  data: RegencyResponse[];
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

describe("regencyColumns", () => {
  const onEdit = vi.fn();
  const onDelete = vi.fn();
  const columns = regencyColumns({ onEdit, onDelete });

  it("returns an array of 6 columns", () => {
    expect(columns).toHaveLength(6);
  });

  it("has the correct column ids/accessorKeys", () => {
    const ids = columns.map((col) => col.id || col.accessorKey);
    expect(ids).toEqual([
      "number",
      "code",
      "name",
      "province",
      "isActive",
      "actions",
    ]);
  });

  it("number column has enableSorting: false and enableHiding: false", () => {
    const col = columns[0];
    expect(col.enableSorting).toBe(false);
    expect(col.enableHiding).toBe(false);
  });

  it("actions column has enableSorting: false and enableHiding: false", () => {
    const col = columns[5];
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
      "Province",
      "Status",
      "Actions",
    ]);
  });

  it("renders number cell with row index + 1", () => {
    render(<TableShell columns={columns} data={[mockRegency]} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("renders number column header with 'No.' text", () => {
    render(<TableShell columns={columns} data={[mockRegency]} />);
    expect(screen.getByText("No.")).toBeInTheDocument();
  });

  it("renders code cell with font-mono", () => {
    const { container } = render(
      <TableShell columns={columns} data={[mockRegency]} />,
    );
    const codeEl = container.querySelector(".font-mono");
    expect(codeEl).toBeInTheDocument();
    expect(codeEl).toHaveTextContent("REG001");
  });

  it("renders code cell with '-' when code is missing", () => {
    const { container } = render(
      <TableShell columns={columns} data={[mockRegencyNoCodeNoProvince]} />,
    );
    const codeEl = container.querySelector(".font-mono");
    expect(codeEl).toBeInTheDocument();
    expect(codeEl).toHaveTextContent("-");
  });

  it("renders name cell with font-medium", () => {
    const { container } = render(
      <TableShell columns={columns} data={[mockRegency]} />,
    );
    const nameEl = container.querySelectorAll(".font-medium");
    const nameElArr = Array.from(nameEl);
    const matched = nameElArr.find((el) => el.textContent === "Bandung");
    expect(matched).toBeTruthy();
  });

  it("renders province cell with province name", () => {
    const { container } = render(
      <TableShell columns={columns} data={[mockRegency]} />,
    );
    const tbody = container.querySelector("tbody");
    expect(tbody).toBeInTheDocument();
    const provinceEl = tbody!.querySelector(".text-sm");
    expect(provinceEl).toBeInTheDocument();
    expect(provinceEl).toHaveTextContent("West Java");
  });

  it("renders province cell with '-' when province is missing", () => {
    const { container } = render(
      <TableShell columns={columns} data={[mockRegencyNoCodeNoProvince]} />,
    );
    const tbody = container.querySelector("tbody");
    expect(tbody).toBeInTheDocument();
    const provinceEl = tbody!.querySelector(".text-sm");
    expect(provinceEl).toBeInTheDocument();
    expect(provinceEl).toHaveTextContent("-");
  });

  it("renders isActive cell with active StatusBadge when isActive is true", () => {
    render(<TableShell columns={columns} data={[mockRegency]} />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders isActive cell with inactive StatusBadge when isActive is false", () => {
    render(<TableShell columns={columns} data={[mockRegencyInactive]} />);
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("renders actions column header with 'Actions' text", () => {
    render(<TableShell columns={columns} data={[mockRegency]} />);
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders actions cell with edit and delete buttons", () => {
    render(<TableShell columns={columns} data={[mockRegency]} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("calls onEdit handler when edit button is clicked", async () => {
    const user = userEvent.setup();
    render(<TableShell columns={columns} data={[mockRegency]} />);
    const buttons = screen.getAllByRole("button");
    const editBtn = buttons.find((btn) =>
      btn.querySelector(".lucide-square-pen"),
    );
    expect(editBtn).toBeTruthy();
    await user.click(editBtn!);
    expect(onEdit).toHaveBeenCalledWith(mockRegency);
  });

  it("calls onDelete handler when delete button is clicked", async () => {
    const user = userEvent.setup();
    render(<TableShell columns={columns} data={[mockRegency]} />);
    const buttons = screen.getAllByRole("button");
    const deleteBtn = buttons.find((btn) =>
      btn.querySelector(".lucide-trash-2"),
    );
    expect(deleteBtn).toBeTruthy();
    await user.click(deleteBtn!);
    expect(onDelete).toHaveBeenCalledWith(mockRegency);
  });
});
