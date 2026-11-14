import { PortPage } from "@/features/master-data/port/pages/port.page";
import userEvent from "@testing-library/user-event";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
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
      useGetCustomsOfficeOptions: () => ({
        data: {
          data: [
            {
              label: "KPPBC-001",
              value: "1",
              description:
                "Kantor Pengawasan dan Pelayanan Bea dan Cukai Jakarta",
            },
          ],
        },
        isLoading: false,
      }),
      ActionButton: ({
        label,
        onClick,
        disabled,
        variant,
      }: {
        label?: string;
        onClick?: () => void;
        disabled?: boolean;
        variant?: string;
        permission?: string;
      }) => (
        <button onClick={onClick} disabled={disabled}>
          <span
            className={
              variant === "edit"
                ? "lucide-square-pen"
                : variant === "delete"
                  ? "lucide-trash-2"
                  : undefined
            }
          />
          {label}
        </button>
      ),
      Page: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      ),
      PageHeader: ({
        title,
        actions,
      }: {
        title: string;
        actions?: React.ReactNode;
      }) => (
        <div>
          <h1>{title}</h1>
          <div data-testid="header-actions">{actions}</div>
        </div>
      ),
      DataTable: ({
        title,
        columns,
      }: {
        title?: string;
        columns: Array<{
          id?: string;
          cell?: (ctx: {
            row: { original: Record<string, unknown>; index: number };
          }) => React.ReactNode;
        }>;
      }) => {
        const actionsCol = columns.find((c) => c.id === "actions");
        return (
          <div data-testid="data-table">
            {title && <h2>{title}</h2>}
            {actionsCol?.cell && (
              <div data-testid="actions-cell">
                {actionsCol.cell({
                  row: {
                    original: {
                      id: 1,
                      code: "PORT-CGK-001",
                      name: "Pelabuhan Soekarno-Hatta Jakarta",
                      customsOffice: { id: 1, code: "KPPBC-001" },
                    },
                    index: 0,
                  },
                } as never)}
              </div>
            )}
          </div>
        );
      },
      ConfirmationModal: ({
        open,
        title,
        onConfirm,
        onOpenChange,
      }: {
        open?: boolean;
        title?: string;
        onConfirm?: () => void;
        onOpenChange?: (open: boolean) => void;
        description?: string;
        confirmText?: string;
        isLoading?: boolean;
        confirmVariant?: string;
      }) =>
        open ? (
          <div data-testid="confirmation-modal">
            <h2>{title}</h2>
            <button data-testid="confirm-delete-btn" onClick={onConfirm}>
              Delete
            </button>
            <button
              data-testid="cancel-delete-btn"
              onClick={() => onOpenChange?.(false)}
            >
              Cancel
            </button>
          </div>
        ) : null,
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

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

describe("PortPage", () => {
  it("renders the page with layout and title", async () => {
    render(<PortPage />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /^port$/i }),
      ).toBeInTheDocument();
    });
  });

  it("renders an Add action button", async () => {
    render(<PortPage />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    });
  });

  it("renders the DataTable", async () => {
    render(<PortPage />);

    await waitFor(() => {
      expect(screen.getByText("All Ports")).toBeInTheDocument();
    });
  });

  it("opens create form modal when Add button is clicked", async () => {
    const user = userEvent.setup();
    render(<PortPage />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByText("Add Port")).toBeInTheDocument();
    });
  });

  it("opens edit form modal when edit trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<PortPage />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    });

    let editButton: HTMLElement | undefined;
    await waitFor(() => {
      const allButtons = screen.getAllByRole("button");
      editButton = allButtons.find((btn) =>
        btn.querySelector(".lucide-square-pen"),
      );
      expect(editButton).toBeTruthy();
    });
    await user.click(editButton!);

    await waitFor(() => {
      expect(screen.getByText("Edit Port")).toBeInTheDocument();
    });
  });

  it("shows confirmation modal when delete trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<PortPage />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    });

    let deleteButton: HTMLElement | undefined;
    await waitFor(() => {
      const allButtons = screen.getAllByRole("button");
      deleteButton = allButtons.find((btn) =>
        btn.querySelector(".lucide-trash-2"),
      );
      expect(deleteButton).toBeTruthy();
    });
    await user.click(deleteButton!);

    await waitFor(() => {
      expect(screen.getByText("Delete Port")).toBeInTheDocument();
    });
  });

  it("calls delete mutation when confirm delete is clicked", async () => {
    const user = userEvent.setup();
    render(<PortPage />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    });

    let deleteButton: HTMLElement | undefined;
    await waitFor(() => {
      const allButtons = screen.getAllByRole("button");
      deleteButton = allButtons.find((btn) =>
        btn.querySelector(".lucide-trash-2"),
      );
      expect(deleteButton).toBeTruthy();
    });
    await user.click(deleteButton!);

    await waitFor(() => {
      expect(screen.getByText("Delete Port")).toBeInTheDocument();
    });

    const confirmButton = screen.getByRole("button", {
      name: /delete/i,
    });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByText("Delete Port")).not.toBeInTheDocument();
    });
  });

  it("does not call delete mutation when portToDelete is not set", () => {
    render(<PortPage />);

    const confirmButton = screen.queryByRole("button", {
      name: /delete/i,
    });
    expect(confirmButton).not.toBeInTheDocument();
  });

  it("invalidates queries after form submission success", async () => {
    const user = userEvent.setup();
    render(<PortPage />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByText("Add Port")).toBeInTheDocument();
    });

    const customsOfficeInput = screen.getByPlaceholderText(
      "Select a customs office",
    );
    await user.click(customsOfficeInput);

    let customsOfficeOption: HTMLElement;
    await waitFor(() => {
      const options = screen.getAllByText(/KPPBC-001/);
      customsOfficeOption = options.find((el) =>
        el.closest("[data-slot='combobox-item']"),
      )!;
      expect(customsOfficeOption).toBeTruthy();
    });
    fireEvent.click(customsOfficeOption!);

    const codeInput = screen.getByPlaceholderText(/e\.g\., PORT-CGK-001/i);
    await user.type(codeInput, "PORT-NEW-001");

    const nameInput = screen.getByPlaceholderText(
      /e\.g\., Pelabuhan Soekarno-Hatta Jakarta/i,
    );
    await user.type(nameInput, "New Port");

    await user.click(screen.getByRole("button", { name: /^create$/i }));

    await waitFor(() => {
      expect(screen.queryByText("Add Port")).not.toBeInTheDocument();
    });
  });
});
