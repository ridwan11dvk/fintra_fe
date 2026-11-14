import { partnerColumns } from "@/features/master-data/partner/components/partner-columns";
import { flexRender } from "@tanstack/react-table";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";
import { mockPartner } from "../data/partner.handlers";

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

      Visibility: ({ children }: { children: React.ReactNode }) => (
        <>{children}</>
      ),
      StatusBadge: ({ status }: { status: string }) => (
        <div data-testid={`status-badge-${status}`}>{status}</div>
      ),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/visibility", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dropdown-menu", __railfinanceCoreMock);

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

describe("partnerColumns", () => {
  it("returns an array of 6 columns", () => {
    const columns = partnerColumns(mockHandlers);
    expect(columns).toHaveLength(6);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = partnerColumns(mockHandlers) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "partnerCode",
      "name",
      "companyEmail",
      "companyPhoneNumber",
      "status",
      "actions",
    ]);
  });

  it("renders partnerCode cell with the partner code", () => {
    const columns = partnerColumns(mockHandlers) as unknown as TestColumnDef[];
    const codeCol = columns.find((c) => c.accessorKey === "partnerCode");
    if (!codeCol?.cell) return;

    render(
      flexRender(codeCol.cell, {
        row: { index: 0, original: mockPartner, getValue: () => "TST-001" },
        column: { id: "partnerCode" },
        getValue: () => "TST-001",
        renderValue: () => "TST-001",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("TST-001")).toBeInTheDocument();
  });

  it("renders name cell with partner name", () => {
    const columns = partnerColumns(mockHandlers) as unknown as TestColumnDef[];
    const nameCol = columns.find((c) => c.accessorKey === "name");
    if (!nameCol?.cell) return;

    render(
      flexRender(nameCol.cell, {
        row: {
          index: 0,
          original: mockPartner,
          getValue: () => "PT. Test Partner",
        },
        column: { id: "name" },
        getValue: () => "PT. Test Partner",
        renderValue: () => "PT. Test Partner",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("PT. Test Partner")).toBeInTheDocument();
  });

  it("renders companyEmail cell with partner email", () => {
    const columns = partnerColumns(mockHandlers) as unknown as TestColumnDef[];
    const emailCol = columns.find((c) => c.accessorKey === "companyEmail");
    if (!emailCol?.cell) return;

    render(
      flexRender(emailCol.cell, {
        row: {
          index: 0,
          original: mockPartner,
          getValue: () => "partner@test.com",
        },
        column: { id: "companyEmail" },
        getValue: () => "partner@test.com",
        renderValue: () => "partner@test.com",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("partner@test.com")).toBeInTheDocument();
  });

  it("renders companyEmail cell with dash when email is falsy", () => {
    const columns = partnerColumns(mockHandlers) as unknown as TestColumnDef[];
    const emailCol = columns.find((c) => c.accessorKey === "companyEmail");
    if (!emailCol?.cell) return;

    render(
      flexRender(emailCol.cell, {
        row: {
          index: 0,
          original: { ...mockPartner, companyEmail: null },
          getValue: () => null,
        },
        column: { id: "companyEmail" },
        getValue: () => null,
        renderValue: () => null,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders companyPhoneNumber cell with phone", () => {
    const columns = partnerColumns(mockHandlers) as unknown as TestColumnDef[];
    const phoneCol = columns.find(
      (c) => c.accessorKey === "companyPhoneNumber",
    );
    if (!phoneCol?.cell) return;

    render(
      flexRender(phoneCol.cell, {
        row: {
          index: 0,
          original: mockPartner,
          getValue: () => "021-1234567",
        },
        column: { id: "companyPhoneNumber" },
        getValue: () => "021-1234567",
        renderValue: () => "021-1234567",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("021-1234567")).toBeInTheDocument();
  });

  it("renders companyPhoneNumber cell with dash when phone is falsy", () => {
    const columns = partnerColumns(mockHandlers) as unknown as TestColumnDef[];
    const phoneCol = columns.find(
      (c) => c.accessorKey === "companyPhoneNumber",
    );
    if (!phoneCol?.cell) return;

    render(
      flexRender(phoneCol.cell, {
        row: {
          index: 0,
          original: { ...mockPartner, companyPhoneNumber: null },
          getValue: () => null,
        },
        column: { id: "companyPhoneNumber" },
        getValue: () => null,
        renderValue: () => null,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("renders status badge for active partner", () => {
    const columns = partnerColumns(mockHandlers) as unknown as TestColumnDef[];
    const statusCol = columns.find((c) => c.accessorKey === "status");
    if (!statusCol?.cell) return;

    render(
      flexRender(statusCol.cell, {
        row: { index: 0, original: mockPartner, getValue: () => "ACTIVE" },
        column: { id: "status" },
        getValue: () => "ACTIVE",
        renderValue: () => "ACTIVE",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("status-badge-active")).toBeInTheDocument();
  });

  it("renders status badge for inactive partner", () => {
    const columns = partnerColumns(mockHandlers) as unknown as TestColumnDef[];
    const statusCol = columns.find((c) => c.accessorKey === "status");
    if (!statusCol?.cell) return;

    render(
      flexRender(statusCol.cell, {
        row: {
          index: 0,
          original: { ...mockPartner, status: "INACTIVE" },
          getValue: () => "INACTIVE",
        },
        column: { id: "status" },
        getValue: () => "INACTIVE",
        renderValue: () => "INACTIVE",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("status-badge-inactive")).toBeInTheDocument();
  });

  it("renders actions dropdown with view, edit, delete options", async () => {
    const user = userEvent.setup();
    const columns = partnerColumns(mockHandlers) as unknown as TestColumnDef[];
    const actionsCol = columns.find((c) => c.id === "actions");
    if (!actionsCol?.cell) return;

    render(
      flexRender(actionsCol.cell, {
        row: { index: 0, original: mockPartner, getValue: () => undefined },
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    // Open dropdown
    await user.click(screen.getByRole("button"));
    expect(screen.getByText("View")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls onView when View is clicked", async () => {
    const user = userEvent.setup();
    const handlers = { onView: vi.fn(), onEdit: vi.fn(), onDelete: vi.fn() };
    const columns = partnerColumns(handlers) as unknown as TestColumnDef[];
    const actionsCol = columns.find((c) => c.id === "actions");
    if (!actionsCol?.cell) return;

    render(
      flexRender(actionsCol.cell, {
        row: { index: 0, original: mockPartner, getValue: () => undefined },
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("View"));
    expect(handlers.onView).toHaveBeenCalledWith(mockPartner);
  });

  it("calls onEdit when Edit is clicked", async () => {
    const user = userEvent.setup();
    const handlers = { onView: vi.fn(), onEdit: vi.fn(), onDelete: vi.fn() };
    const columns = partnerColumns(handlers) as unknown as TestColumnDef[];
    const actionsCol = columns.find((c) => c.id === "actions");
    if (!actionsCol?.cell) return;

    render(
      flexRender(actionsCol.cell, {
        row: { index: 0, original: mockPartner, getValue: () => undefined },
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Edit"));
    expect(handlers.onEdit).toHaveBeenCalledWith(mockPartner);
  });

  it("calls onDelete when Delete is clicked", async () => {
    const user = userEvent.setup();
    const handlers = { onView: vi.fn(), onEdit: vi.fn(), onDelete: vi.fn() };
    const columns = partnerColumns(handlers) as unknown as TestColumnDef[];
    const actionsCol = columns.find((c) => c.id === "actions");
    if (!actionsCol?.cell) return;

    render(
      flexRender(actionsCol.cell, {
        row: { index: 0, original: mockPartner, getValue: () => undefined },
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Delete"));
    expect(handlers.onDelete).toHaveBeenCalledWith(mockPartner);
  });

  it("does not render onView option when onView is not provided", async () => {
    const user = userEvent.setup();
    const columns = partnerColumns({
      onEdit: vi.fn(),
      onDelete: vi.fn(),
    }) as unknown as TestColumnDef[];
    const actionsCol = columns.find((c) => c.id === "actions");
    if (!actionsCol?.cell) return;

    render(
      flexRender(actionsCol.cell, {
        row: { index: 0, original: mockPartner, getValue: () => undefined },
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );

    await user.click(screen.getByRole("button"));
    expect(screen.queryByText("View")).not.toBeInTheDocument();
  });
});
