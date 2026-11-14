import { internalUserColumns } from "@/features/settings";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import type { InternalUser } from "@/features/settings";

function TableShell({ columns }: { columns: ColumnDef<InternalUser>[] }) {
  const table = useReactTable({
    data: [
      {
        id: 1, nipp: "12345", name: "John Doe",
        email: "john@example.com", costCenterName: "CC-A",
        rkipInputPeriodUntil: "2024-12-31",
        roles: [{ id: 1, name: "Admin" }],
        twoFactorEnabled: false,
        createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z",
        createdBy: "admin", updatedBy: "admin",
        companyCode: "C001", companyName: "", password: "",
        directorateCode: "", directorateName: "",
        personalAreaCode: "", personalAreaName: "",
        organizationCode: "", organizationName: "",
        jobCode: "", jobName: "", positionCode: "", positionName: "",
        supervisorLevelOnePosition: "", supervisorLevelOnePositionName: "",
        supervisorLevelTwoPosition: "", supervisorLevelTwoPositionName: "",
        costCenterCode: "", businessAreaCode: "", businessAreaName: "",
      } as InternalUser,
    ],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  return (
    <table>
      <thead>
        <tr>
          {table.getAllColumns().map((col) => (
            <th key={col.id}>{col.columnDef.meta?.title as string}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {cell.column.columnDef.cell?.(cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

describe("internalUserColumns", () => {
  it("has 8 columns (select + 7 data/action columns)", () => {
    const columns = internalUserColumns({
      onShow: vi.fn(), onEdit: vi.fn(), onDelete: vi.fn(), onChangeInputDate: vi.fn(),
    });

    const metaTitles = columns.map((c) => (c as ColumnDef<InternalUser>).meta?.title).filter(Boolean);
    expect(metaTitles).toEqual(["Name", "Cost Center", "NIPP", "Email", "Roles", "RKIP Input Limit", "Actions"]);
  });

  it("renders column data correctly", () => {
    const columns = internalUserColumns({
      onShow: vi.fn(), onEdit: vi.fn(), onDelete: vi.fn(), onChangeInputDate: vi.fn(),
    });

    render(<TableShell columns={columns} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("CC-A")).toBeInTheDocument();
    expect(screen.getByText("12345")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });
});
