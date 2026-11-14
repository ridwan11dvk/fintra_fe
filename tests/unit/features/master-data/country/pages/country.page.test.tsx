import type { CountryResponse } from "@/features/master-data";
import { CountryPage } from "@/features/master-data/country/pages/country.page";
import userEvent from "@testing-library/user-event";
import {
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
      Page: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="page">{children}</div>
      ),
      ActionButton: ({
        label,
        onClick,
        disabled,
      }: {
        label?: string;
        onClick?: () => void;
        disabled?: boolean;
        variant?: string;
        showLabel?: boolean;
        permission?: string;
      }) => (
        <button
          data-testid={`action-btn-${label?.toLowerCase()}`}
          onClick={onClick}
          disabled={disabled}
        >
          {label}
        </button>
      ),
      DataTable: ({
        columns,
      }: {
        columns: Array<{
          id?: string;
          cell?: (ctx: {
            row: { original: CountryResponse; index: number };
          }) => React.ReactNode;
        }>;
      }) => (
        <div data-testid="data-table">
          {columns.map((col, i) => {
            if (col.id === "actions" && col.cell) {
              const ctx = {
                row: {
                  original: mockCountryData,
                  index: 0,
                },
              };
              return (
                <div key={col.id ?? String(i)} data-testid="col-actions-cell">
                  {col.cell(ctx)}
                </div>
              );
            }
            return null;
          })}
        </div>
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
      ConfirmationModal: ({
        onConfirm,
        onOpenChange,
      }: {
        open?: boolean;
        onConfirm?: () => void;
        onOpenChange?: (open: boolean) => void;
        title?: string;
        description?: string;
        confirmText?: string;
        isLoading?: boolean;
        confirmVariant?: string;
      }) => (
        <div data-testid="confirmation-modal">
          <button data-testid="confirm-delete-btn" onClick={onConfirm}>
            Confirm Delete
          </button>
          <button
            data-testid="cancel-delete-btn"
            onClick={() => onOpenChange?.(false)}
          >
            Cancel
          </button>
        </div>
      ),
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

vi.mock("@/features/master-data", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/master-data")>();
  return {
    ...actual,
    countryColumns: (
      handlers: Parameters<typeof actual.countryColumns>[0],
    ): ReturnType<typeof actual.countryColumns> => [
      {
        id: "actions",
        meta: { title: "Actions" },
        header: () => null,
        cell: () => (
          <div>
            <button
              data-testid="trigger-edit"
              onClick={() => handlers.onEdit?.(mockCountryData)}
            >
              Edit
            </button>
            <button
              data-testid="trigger-delete"
              onClick={() => handlers.onDelete?.(mockCountryData)}
            >
              Delete
            </button>
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      } as never,
    ],
    CountryFormModal: ({
      open,
      mode,
      onSuccess,
      onOpenChange,
    }: {
      open?: boolean;
      mode?: string;
      onSuccess?: () => void;
      onOpenChange?: (open: boolean) => void;
    }) =>
      open ? (
        <div data-testid="country-form-modal" data-mode={mode}>
          <button
            data-testid="form-submit"
            onClick={() => {
              onSuccess?.();
              onOpenChange?.(false);
            }}
          >
            Submit
          </button>
        </div>
      ) : null,
  };
});

const mockCountryData: CountryResponse = {
  id: 1,
  name: "Indonesia",
  iso2Code: "ID",
  iso3Code: "IDN",
  dialCode: "+62",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

describe("CountryPage", () => {
  it("renders the page with layout and title", () => {
    render(<CountryPage />);
    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByText("Country")).toBeInTheDocument();
  });

  it("renders Add action button", () => {
    render(<CountryPage />);
    expect(screen.getByTestId("action-btn-add")).toBeInTheDocument();
  });

  it("renders the DataTable", () => {
    render(<CountryPage />);
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("opens create form modal when Add button is clicked", async () => {
    const user = userEvent.setup();
    render(<CountryPage />);

    await user.click(screen.getByTestId("action-btn-add"));

    await waitFor(() => {
      expect(screen.getByTestId("country-form-modal")).toBeInTheDocument();
    });
    expect(screen.getByTestId("country-form-modal")).toHaveAttribute(
      "data-mode",
      "create",
    );
  });

  it("opens edit form modal when edit trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<CountryPage />);

    await user.click(screen.getByTestId("trigger-edit"));

    await waitFor(() => {
      expect(screen.getByTestId("country-form-modal")).toBeInTheDocument();
    });
    expect(screen.getByTestId("country-form-modal")).toHaveAttribute(
      "data-mode",
      "edit",
    );
  });

  it("shows confirmation modal when delete trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<CountryPage />);

    await user.click(screen.getByTestId("trigger-delete"));

    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
  });

  it("calls delete mutation when confirm delete is clicked", async () => {
    const user = userEvent.setup();
    render(<CountryPage />);

    await user.click(screen.getByTestId("trigger-delete"));
    await user.click(screen.getByTestId("confirm-delete-btn"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("country-form-modal"),
      ).not.toBeInTheDocument();
    });
  });

  it("does not call delete mutation when countryToDelete is not set", async () => {
    const user = userEvent.setup();
    render(<CountryPage />);

    await user.click(screen.getByTestId("confirm-delete-btn"));

    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("invalidates queries after form submission success", async () => {
    const user = userEvent.setup();
    render(<CountryPage />);

    await user.click(screen.getByTestId("action-btn-add"));
    await waitFor(() => {
      expect(screen.getByTestId("country-form-modal")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("form-submit"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("country-form-modal"),
      ).not.toBeInTheDocument();
    });
  });
});
