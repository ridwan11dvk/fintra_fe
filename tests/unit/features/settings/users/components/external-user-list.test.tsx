import type { ExternalUser } from "@/features/settings";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockExternalUser = vi.hoisted(
  (): ExternalUser => ({
    id: 1,
    userType: "PERSONAL",
    name: "Jane Doe",
    email: "jane@example.com",
    username: "jane_doe",
    phoneNumber: "08123456789",
    twoFactorEnabled: false,
    roles: [{ id: 2, name: "User" }],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    createdBy: "admin",
    updatedBy: "admin",
  }),
);

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

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
      DataTable: ({
        columns,
        title,
        search,
      }: {
        columns: unknown[];
        title?: string;
        search?: { placeholder?: string };
      }) => {
        const actionsCol = (
          columns as Array<{
            id?: string;
            cell?: (ctx: unknown) => React.ReactNode;
          }>
        ).find((c) => c.id === "actions");
        return (
          <div data-testid="data-table">
            <span data-testid="table-title">{title}</span>
            <span data-testid="columns-count">{columns?.length}</span>
            {search && (
              <span data-testid="search-placeholder">{search.placeholder}</span>
            )}
            {actionsCol?.cell && (
              <div data-testid="actions-cell">
                {actionsCol.cell({
                  row: { original: mockExternalUser, index: 0 },
                } as never)}
              </div>
            )}
          </div>
        );
      },
      ConfirmationModal: ({
        open,
        onConfirm,
        onOpenChange,
        title,
        description,
        confirmText,
      }: {
        open?: boolean;
        onConfirm?: () => void;
        onOpenChange?: (open: boolean) => void;
        title?: string;
        description?: string;
        confirmText?: string;
      }) =>
        open ? (
          <div data-testid="confirmation-modal">
            <span data-testid="modal-title">{title}</span>
            <span data-testid="modal-desc">{description}</span>
            <button data-testid="confirm-delete" onClick={onConfirm}>
              {confirmText ?? "Confirm"}
            </button>
            <button
              data-testid="cancel-delete"
              onClick={() => onOpenChange?.(false)}
            >
              Cancel
            </button>
          </div>
        ) : null,
      EllipsisAction: ({
        actions,
      }: {
        actions: Array<{ label: string; onClick: () => void }>;
      }) => (
        <div data-testid="ellipsis-action">
          {actions.map((action) => (
            <button
              key={action.label}
              data-testid={`action-btn-${action.label.toLowerCase()}`}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
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

import { ExternalUserList } from "@/features/settings/users/components/external-user-list";

describe("ExternalUserList", () => {
  it("renders DataTable with correct title and search placeholder", () => {
    render(<ExternalUserList />);

    expect(screen.getByTestId("data-table")).toBeInTheDocument();
    expect(screen.getByTestId("table-title")).toHaveTextContent(
      "All External Users",
    );
    expect(screen.getByTestId("search-placeholder")).toHaveTextContent(
      "Search by name, email, or username",
    );
  });

  it("renders 6 columns (select + 5 data/action columns)", () => {
    render(<ExternalUserList />);

    expect(screen.getByTestId("columns-count")).toHaveTextContent("6");
  });

  it("renders show, edit, and delete action buttons", () => {
    render(<ExternalUserList />);

    expect(screen.getByTestId("action-btn-show")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-edit")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-delete")).toBeInTheDocument();
  });

  it("navigates to detail page on show click", async () => {
    const user = userEvent.setup();
    render(<ExternalUserList />);

    await user.click(screen.getByTestId("action-btn-show"));

    expect(mockNavigate).toHaveBeenCalledWith("/setting/user/external/1");
  });

  it("navigates to edit page on edit click", async () => {
    const user = userEvent.setup();
    render(<ExternalUserList />);

    await user.click(screen.getByTestId("action-btn-edit"));

    expect(mockNavigate).toHaveBeenCalledWith("/setting/user/external/1/edit");
  });

  it("opens delete confirmation modal on delete click", async () => {
    const user = userEvent.setup();
    render(<ExternalUserList />);

    await user.click(screen.getByTestId("action-btn-delete"));

    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
  });

  it("shows correct title and description in delete modal", async () => {
    const user = userEvent.setup();
    render(<ExternalUserList />);

    await user.click(screen.getByTestId("action-btn-delete"));

    expect(screen.getByTestId("modal-title")).toHaveTextContent("Delete User");
    expect(screen.getByTestId("modal-desc")).toHaveTextContent(
      'Are you sure you want to delete the user "Jane Doe"? This action cannot be undone.',
    );
    expect(screen.getByTestId("confirm-delete")).toHaveTextContent("Delete");
  });

  it("deletes and closes modal when confirm is clicked", async () => {
    const user = userEvent.setup();
    render(<ExternalUserList />);

    await user.click(screen.getByTestId("action-btn-delete"));
    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();

    await user.click(screen.getByTestId("confirm-delete"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("confirmation-modal"),
      ).not.toBeInTheDocument();
    });
  });

  it("closes delete modal on cancel", async () => {
    const user = userEvent.setup();
    render(<ExternalUserList />);

    await user.click(screen.getByTestId("action-btn-delete"));
    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();

    await user.click(screen.getByTestId("cancel-delete"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("confirmation-modal"),
      ).not.toBeInTheDocument();
    });
  });
});
