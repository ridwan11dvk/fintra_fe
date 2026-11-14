import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockNavigate = vi.fn();

vi.mock("react-router", async (importOriginal) => {
  const actual: object = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

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
      Page: ({
        children,
        title,
      }: {
        children: React.ReactNode;
        title?: string;
      }) => (
        <div data-testid="page">
          <div data-testid="layout-title">{title}</div>
          {children}
        </div>
      ),
      ActionButton: ({
        onClick,
        label,
        variant,
        showLabel,
      }: {
        onClick?: () => void;
        label?: string;
        variant?: string;
        showLabel?: boolean;
      }) => (
        <button data-testid={`action-btn-${variant}`} onClick={onClick}>
          {showLabel ? label : variant}
        </button>
      ),
      ActionButton: ({
        onClick,
        label,
        variant,
        showLabel,
      }: {
        onClick?: () => void;
        label?: string;
        variant?: string;
        showLabel?: boolean;
      }) => (
        <button data-testid={`action-btn-${variant}`} onClick={onClick}>
          {showLabel ? label : variant}
        </button>
      ),

      Tabs: ({
        children,
        defaultValue,
      }: {
        children: React.ReactNode;
        defaultValue?: string;
      }) => (
        <div data-testid="tabs" data-default={defaultValue}>
          {children}
        </div>
      ),
      TabsList: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="tabs-list">{children}</div>
      ),
      TabsTrigger: ({
        children,
        value,
      }: {
        children: React.ReactNode;
        value?: string;
      }) => <button data-testid={`tab-${value}`}>{children}</button>,
      TabsContent: ({
        children,
        value,
      }: {
        children: React.ReactNode;
        value?: string;
      }) => <div data-testid={`tab-content-${value}`}>{children}</div>,
      RadioGroup: ({
        children,
        value,
        onValueChange,
      }: {
        children: React.ReactNode;
        value?: string;
        onValueChange?: (v: string) => void;
      }) => {
        radioOnValueChange = onValueChange;
        return (
          <div data-testid="radio-group" data-value={value}>
            {children}
          </div>
        );
      },
      RadioGroupItem: ({ value }: { value?: string }) => (
        <button
          data-testid={`radio-${value}`}
          data-value={value}
          onClick={() => radioOnValueChange?.(value || "")}
        />
      ),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
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

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

let radioOnValueChange: ((v: string) => void) | undefined;

import React from "react";

vi.mock("@/features/settings", async (importOriginal) => {
  const actual: object = await importOriginal();
  return {
    ...actual,
    InternalUserList: () => (
      <div data-testid="internal-user-list">Internal Users</div>
    ),
    ExternalUserList: () => (
      <div data-testid="external-user-list">External Users</div>
    ),
  };
});

import { UserPage } from "@/features/settings/users/pages/user.page";

describe("UserPage", () => {
  it("renders page with layout and title", () => {
    render(<UserPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("layout-title")).toHaveTextContent(
      "User Management",
    );
  });

  it("renders heading and subtitle", () => {
    render(<UserPage />);

    const headings = screen.getAllByText("User Management");
    expect(headings.length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText(
        "Manage internal and external users of the application.",
      ),
    ).toBeInTheDocument();
  });

  it("renders tabs with Internal and External user sections", () => {
    render(<UserPage />);

    expect(screen.getByTestId("tab-internal")).toHaveTextContent(
      "Internal Users",
    );
    expect(screen.getByTestId("tab-external")).toHaveTextContent(
      "External Users",
    );
    expect(screen.getByTestId("tab-content-internal")).toBeInTheDocument();
    expect(screen.getByTestId("tab-content-external")).toBeInTheDocument();
  });

  it("shows InternalUserList by default", () => {
    render(<UserPage />);

    expect(screen.getByTestId("internal-user-list")).toBeInTheDocument();
  });

  it("renders Add User button", () => {
    render(<UserPage />);

    expect(screen.getByTestId("action-btn-add")).toBeInTheDocument();
  });

  it("opens user type selection modal on Add User click", async () => {
    const user = userEvent.setup();
    render(<UserPage />);

    expect(
      screen.queryByText("Select the user type to continue."),
    ).not.toBeInTheDocument();

    await user.click(screen.getByTestId("action-btn-add"));

    expect(screen.getByText("Add New User")).toBeInTheDocument();
    expect(
      screen.getByText("Select the user type to continue."),
    ).toBeInTheDocument();
  });

  it("shows radio buttons for Internal and External user types", async () => {
    const user = userEvent.setup();
    render(<UserPage />);

    await user.click(screen.getByTestId("action-btn-add"));

    expect(screen.getByTestId("radio-internal")).toBeInTheDocument();
    expect(screen.getByTestId("radio-external")).toBeInTheDocument();
    expect(screen.getByText("Internal User")).toBeInTheDocument();
    expect(screen.getByText("External User")).toBeInTheDocument();
  });

  it("navigates to internal user create page on Continue when internal selected", async () => {
    const user = userEvent.setup();
    render(<UserPage />);

    await user.click(screen.getByTestId("action-btn-add"));
    await user.click(screen.getByTestId("radio-internal"));
    await user.click(screen.getByText("Continue"));

    expect(mockNavigate).toHaveBeenCalledWith("/setting/user/internal/add");
  });

  it("navigates to external user create page on Continue when external selected", async () => {
    const user = userEvent.setup();
    render(<UserPage />);

    await user.click(screen.getByTestId("action-btn-add"));
    await user.click(screen.getByTestId("radio-external"));
    await user.click(screen.getByText("Continue"));

    expect(mockNavigate).toHaveBeenCalledWith("/setting/user/external/add");
  });

  it("closes modal when Cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<UserPage />);

    await user.click(screen.getByTestId("action-btn-add"));
    expect(screen.getByText("Add New User")).toBeInTheDocument();

    await user.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(screen.queryByText("Add New User")).not.toBeInTheDocument();
    });
  });
});
