import userEvent from "@testing-library/user-event";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MenuList } from "@/features/settings/menu-management/components/menu-list";
import type { NavigationMenuItem } from "@/features/settings/menu-management/data/menu-management.types";

vi.mock("@railfinance/core/ui", () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button type="button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
  Table: ({ children }: any) => <table>{children}</table>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableCell: ({ children, style, className, colSpan }: any) => (
    <td style={style} className={className} colSpan={colSpan}>
      {children}
    </td>
  ),
  TableHead: ({ children, className }: any) => (
    <th className={className}>{children}</th>
  ),
  TableHeader: ({ children }: any) => <thead>{children}</thead>,
  TableRow: ({ children }: any) => <tr>{children}</tr>,
}));

const menus: NavigationMenuItem[] = [
  {
    id: 1,
    code: "DASHBOARD",
    title: "Dashboard",
    url: "/dashboard",
    type: "MENU",
    category: "USER_MENU",
    sortOrder: 1,
    openInNewTab: false,
    children: [
      {
        id: 2,
        code: "OVERVIEW",
        title: "Overview",
        url: "/dashboard/overview",
        type: "SUBMENU",
        category: "USER_MENU",
        sortOrder: 1,
        openInNewTab: false,
        children: [],
      },
    ],
  },
  {
    id: 3,
    code: "SETTINGS",
    title: "Settings",
    url: "/settings",
    type: "MENU",
    category: "USER_MENU",
    sortOrder: 2,
    openInNewTab: false,
    children: [],
  },
];

describe("MenuList", () => {
  it("renders empty state when no menus", () => {
    render(
      <MenuList menus={[]} onAdd={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.getByText("Menu Management")).toBeInTheDocument();
    expect(screen.getByText("No menus found")).toBeInTheDocument();
  });

  it("renders menu rows", () => {
    render(
      <MenuList
        menus={menus}
        onAdd={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("DASHBOARD")).toBeInTheDocument();
    expect(screen.getByText("/dashboard")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.queryByText("Overview")).not.toBeInTheDocument();
  });

  it("calls onAdd when Add Menu button is clicked", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    render(
      <MenuList menus={menus} onAdd={onAdd} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    await user.click(screen.getByRole("button", { name: /add menu/i }));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it("calls onEdit and onDelete with menu id", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <MenuList
        menus={menus}
        onAdd={vi.fn()}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    const dashboardRow = screen.getByText("Dashboard").closest("tr");
    expect(dashboardRow).not.toBeNull();
    const dashboardButtons = within(dashboardRow!).getAllByRole("button");
    await user.click(dashboardButtons[1]);
    expect(onEdit).toHaveBeenCalledWith(1);
    await user.click(dashboardButtons[2]);
    expect(onDelete).toHaveBeenCalledWith(1);

    const settingsRow = screen.getByText("Settings").closest("tr");
    expect(settingsRow).not.toBeNull();
    const settingsButtons = within(settingsRow!).getAllByRole("button");
    await user.click(settingsButtons[0]);
    expect(onEdit).toHaveBeenCalledWith(3);
    await user.click(settingsButtons[1]);
    expect(onDelete).toHaveBeenCalledWith(3);
  });

  it("toggles children visibility when expand button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MenuList
        menus={menus}
        onAdd={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.queryByText("Overview")).not.toBeInTheDocument();

    const dashboardRow = screen.getByText("Dashboard").closest("tr");
    expect(dashboardRow).not.toBeNull();
    const expandButton = within(dashboardRow!).getAllByRole("button")[0];

    await user.click(expandButton);
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("OVERVIEW")).toBeInTheDocument();

    const collapseButton = within(dashboardRow!).getAllByRole("button")[0];
    await user.click(collapseButton);
    expect(screen.queryByText("Overview")).not.toBeInTheDocument();
  });
});
