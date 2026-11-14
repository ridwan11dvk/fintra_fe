import { notificationColumns } from "@/features/notification/components/notification-columns";
import { flexRender } from "@tanstack/react-table";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

vi.mock("@railfinance/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@railfinance/core")>();
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
  };
});

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
  onShow: vi.fn(),
  onDelete: vi.fn(),
};

describe("notificationColumns", () => {
  it("returns an array of 7 columns", () => {
    const columns = notificationColumns(mockHandlers);
    expect(columns).toHaveLength(7);
  });

  it("has the correct column ids/accessorKeys", () => {
    const columns = notificationColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const ids = columns.map((col) => col.id ?? col.accessorKey);
    expect(ids).toEqual([
      "number",
      "categoryName",
      "title",
      "channel",
      "isRead",
      "createdAt",
      "actions",
    ]);
  });

  it("number column has enableSorting: false and enableHiding: false", () => {
    const columns = notificationColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => (c.id ?? c.accessorKey) === "number");
    expect(col?.enableSorting).toBe(false);
    expect(col?.enableHiding).toBe(false);
  });

  it("actions column has enableSorting: false and enableHiding: false", () => {
    const columns = notificationColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => (c.id ?? c.accessorKey) === "actions");
    expect(col?.enableSorting).toBe(false);
    expect(col?.enableHiding).toBe(false);
  });

  it("isRead column has enableSorting: false", () => {
    const columns = notificationColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const col = columns.find((c) => (c.id ?? c.accessorKey) === "isRead");
    expect(col?.enableSorting).toBe(false);
  });

  it("each column has a meta.title defined", () => {
    const columns = notificationColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    columns.forEach((col) => expect(col.meta?.title).toBeTruthy());
  });

  it("renders number cell with row index + 1", () => {
    const columns = notificationColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const numberCol = columns.find((c) => c.id === "number");
    expect(numberCol).toBeDefined();
    if (!numberCol?.cell) return;

    render(
      flexRender(numberCol.cell, {
        row: { index: 2, original: {} },
        column: { id: "number" },
        getValue: () => undefined,
        renderValue: () => undefined,
        table: {} as never,
        cell: {} as never,
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders channel badge with channel value", () => {
    const columns = notificationColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const channelCol = columns.find(
      (c) => (c.id ?? c.accessorKey) === "channel",
    );
    expect(channelCol).toBeDefined();
    if (!channelCol?.cell) return;

    render(
      flexRender(channelCol.cell, {
        row: {
          index: 0,
          original: { channel: "EMAIL" },
          getValue: () => "EMAIL",
        },
        column: { id: "channel" },
        getValue: () => "EMAIL",
        renderValue: () => undefined,
        table: {} as never,
        cell: {} as never,
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("EMAIL")).toBeInTheDocument();
  });

  it("renders isRead badge as 'Unread' when false and 'Read' when true", () => {
    const columns = notificationColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const isReadCol = columns.find((c) => (c.id ?? c.accessorKey) === "isRead");
    expect(isReadCol).toBeDefined();
    if (!isReadCol?.cell) return;

    const { container } = render(
      flexRender(isReadCol.cell, {
        row: {
          index: 0,
          original: { isRead: true },
          getValue: () => true,
        },
        column: { id: "isRead" },
        getValue: () => true,
        renderValue: () => undefined,
        table: {} as never,
        cell: {} as never,
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(container.textContent).toContain("Read");

    const { container: container2 } = render(
      flexRender(isReadCol.cell, {
        row: {
          index: 1,
          original: { isRead: false },
          getValue: () => false,
        },
        column: { id: "isRead" },
        getValue: () => false,
        renderValue: () => undefined,
        table: {} as never,
        cell: {} as never,
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(container2.textContent).toContain("Unread");
  });

  it("renders createdAt cell with formatted date", () => {
    const columns = notificationColumns(
      mockHandlers,
    ) as unknown as TestColumnDef[];
    const createdAtCol = columns.find(
      (c) => (c.id ?? c.accessorKey) === "createdAt",
    );
    expect(createdAtCol).toBeDefined();
    if (!createdAtCol?.cell) return;

    const date = "2024-01-15T10:30:00Z";
    render(
      flexRender(createdAtCol.cell, {
        row: {
          index: 0,
          original: { createdAt: date },
          getValue: () => date,
        },
        column: { id: "createdAt" },
        getValue: () => date,
        renderValue: () => undefined,
        table: {} as never,
        cell: {} as never,
        getContext: () => ({}) as never,
      } as never) as React.ReactElement,
    );
    expect(screen.getByText("1/15/2024")).toBeInTheDocument();
  });
});
