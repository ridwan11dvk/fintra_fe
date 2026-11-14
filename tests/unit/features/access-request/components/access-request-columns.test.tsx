import type { AccessRequestResponse } from "@/features/access-request";
import { accessRequestColumns } from "@/features/access-request/components/access-request-columns";
import { flexRender } from "@tanstack/react-table";
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
          {variant}
        </button>
      ),

      Badge: ({
        variant,
        children,
      }: {
        variant?: string;
        children: React.ReactNode;
      }) => <span data-testid={`badge-${variant ?? "default"}`}>{children}</span>,
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/access-request", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/image", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/multiple-badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/visibility", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/accordion", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/avatar", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dialog", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/field", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/radio-group", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/tabs", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

type TestColumnDef = {
  id?: string;
  accessorKey?: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  meta?: { title: string };
  size?: number;
  cell?: React.ComponentType<never>;
  header?: React.ComponentType<never> | ((ctx: never) => React.ReactNode);
};

const mockRow: AccessRequestResponse = {
  id: 1,
  userId: 10,
  userType: "INTERNAL",
  userName: "John Doe",
  userNipp: "NIPP001",
  status: "PENDING",
  moduleNames: "Finance, Procurement",
  requestNotes: "Need access",
  requestedAt: "2024-06-01T08:00:00Z",
  approvedAt: null,
  responseNotes: null,
  approvedBy: null,
};

const mockHandlers = {
  onView: vi.fn(),
};

describe("accessRequestColumns", () => {
  it("returns an array of 7 columns", () => {
    const columns = accessRequestColumns(mockHandlers);
    expect(columns).toHaveLength(7);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = accessRequestColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "userType",
      "userName",
      "userNipp",
      "moduleNames",
      "requestedAt",
      "status",
      "actions",
    ]);
  });

  it("renders userType header text", () => {
    const columns = accessRequestColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns[0];
    if (!col.header) return;
    render(flexRender(col.header, {} as never) as React.ReactElement);
    expect(screen.getByText("User Type")).toBeInTheDocument();
  });

  it("renders userType cell with Badge", () => {
    const columns = accessRequestColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns[0];
    if (!col.cell) return;
    render(
      flexRender(col.cell, {
        row: { index: 0, original: mockRow },
        column: { id: "userType" },
        getValue: () => "INTERNAL",
        renderValue: () => "INTERNAL",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("INTERNAL")).toBeInTheDocument();
  });

  it("renders userName cell with the user name", () => {
    const columns = accessRequestColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns[1];
    if (!col.cell) return;
    render(
      flexRender(col.cell, {
        row: { index: 0, original: mockRow },
        column: { id: "userName" },
        getValue: () => "John Doe",
        renderValue: () => "John Doe",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders userNipp cell with NIPP value", () => {
    const columns = accessRequestColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns[2];
    if (!col.cell) return;
    render(
      flexRender(col.cell, {
        row: { index: 0, original: mockRow },
        column: { id: "userNipp" },
        getValue: () => "NIPP001",
        renderValue: () => "NIPP001",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("NIPP001")).toBeInTheDocument();
  });

  it("renders moduleNames cell with badges for each module", () => {
    const columns = accessRequestColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns[3];
    if (!col.cell) return;
    render(
      flexRender(col.cell, {
        row: { index: 0, original: mockRow },
        column: { id: "moduleNames" },
        getValue: () => "Finance, Procurement",
        renderValue: () => "Finance, Procurement",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Finance")).toBeInTheDocument();
    expect(screen.getByText("Procurement")).toBeInTheDocument();
  });

  it("handles empty moduleNames gracefully", () => {
    const columns = accessRequestColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns[3];
    if (!col.cell) return;
    render(
      flexRender(col.cell, {
        row: {
          index: 0,
          original: { ...mockRow, moduleNames: "" },
        },
        column: { id: "moduleNames" },
        getValue: () => "",
        renderValue: () => "",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.queryByTestId("badge-outline")).not.toBeInTheDocument();
  });

  it("renders requestedAt cell with formatted date", () => {
    const columns = accessRequestColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns[4];
    if (!col.cell) return;
    render(
      flexRender(col.cell, {
        row: { index: 0, original: mockRow },
        column: { id: "requestedAt" },
        getValue: () => "2024-06-01T08:00:00Z",
        renderValue: () => "2024-06-01T08:00:00Z",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText(/1 Jun 2024/)).toBeInTheDocument();
  });

  it("renders status header text", () => {
    const columns = accessRequestColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns[5];
    if (!col.header) return;
    render(flexRender(col.header, {} as never) as React.ReactElement);
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders PENDING status badge", () => {
    const columns = accessRequestColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns[5];
    if (!col.cell) return;
    render(
      flexRender(col.cell, {
        row: { index: 0, original: { ...mockRow, status: "PENDING" } },
        column: { id: "status" },
        getValue: () => "PENDING",
        renderValue: () => "PENDING",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("renders APPROVED status badge", () => {
    const columns = accessRequestColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns[5];
    if (!col.cell) return;
    render(
      flexRender(col.cell, {
        row: { index: 0, original: { ...mockRow, status: "APPROVED" } },
        column: { id: "status" },
        getValue: () => "APPROVED",
        renderValue: () => "APPROVED",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });

  it("renders REJECTED status badge", () => {
    const columns = accessRequestColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns[5];
    if (!col.cell) return;
    render(
      flexRender(col.cell, {
        row: { index: 0, original: { ...mockRow, status: "REJECTED" } },
        column: { id: "status" },
        getValue: () => "REJECTED",
        renderValue: () => "REJECTED",
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("Rejected")).toBeInTheDocument();
  });

  it("renders actions column with show button", () => {
    const columns = accessRequestColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns[6];
    if (!col.cell) return;
    render(
      flexRender(col.cell, {
        row: { index: 0, original: mockRow },
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByTestId("action-btn-show")).toBeInTheDocument();
  });

  it("calls onView handler when show button is clicked", async () => {
    const user = userEvent.setup();
    const columns = accessRequestColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns[6];
    if (!col.cell) return;
    render(
      flexRender(col.cell, {
        row: { index: 0, original: mockRow },
        column: { id: "actions" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {},
        cell: {},
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    await user.click(screen.getByTestId("action-btn-show"));
    expect(mockHandlers.onView).toHaveBeenCalledWith(mockRow);
  });

  it("actions column has size 50", () => {
    const columns = accessRequestColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns[6];
    expect(col.size).toBe(50);
  });
});
