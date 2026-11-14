import { externalUserColumns } from "@/features/settings";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";
import { getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import type { ExternalUser } from "@/features/settings";

function TableShell({ columns }: { columns: ColumnDef<ExternalUser>[] }) {
  const table = useReactTable({
    data: [
      {
        id: 1, userType: "PERSONAL", name: "Jane Doe",
        email: "jane@example.com", username: "jane_doe",
        phoneNumber: "08123456789", twoFactorEnabled: false,
        roles: [{ id: 2, name: "User" }],
        createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-01-01T00:00:00Z",
        createdBy: "admin", updatedBy: "admin",
      } as ExternalUser,
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

describe("externalUserColumns", () => {
  it("has select, username, name, email, roles, and actions columns", () => {
    const columns = externalUserColumns({
      onShow: vi.fn(), onEdit: vi.fn(), onDelete: vi.fn(),
    });

    const metaTitles = columns.map((c) => (c as ColumnDef<ExternalUser>).meta?.title).filter(Boolean);
    expect(metaTitles).toEqual(["Username", "Name", "Email", "Roles", "Actions"]);
  });

  it("renders all columns correctly with data", () => {
    const columns = externalUserColumns({
      onShow: vi.fn(), onEdit: vi.fn(), onDelete: vi.fn(),
    });

    render(<TableShell columns={columns} />);

    expect(screen.getByText("jane_doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("User")).toBeInTheDocument();
  });
});
