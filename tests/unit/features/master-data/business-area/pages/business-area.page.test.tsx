import type { BusinessAreaResponse } from "@/features/master-data/business-area/data/business-area.types";
import { BusinessAreaPage } from "@/features/master-data/business-area/pages/business-area.page";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

const mockBusinessAreaData = {
  id: 1,
  companyCode: "PT ABC",
  name: "Business Area Jakarta",
  baCode: "BA-JKT-01",
  branchCode: "BR-001",
  email: "ba.jakarta@ptabc.com",
  taxEmail: "tax.jakarta@ptabc.com",
  nitku: "0012345678",
  npwp: "123456789012345",
  clientId: "CLIENT_001",
  clientSecret: "SECRET_001",
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
} satisfies BusinessAreaResponse;

const mockedBusinessAreaService = vi.hoisted(() => ({
  listBusinessAreas: vi.fn(),
  exportBusinessAreas: vi
    .fn()
    .mockResolvedValue(
      new Blob(["excel-data"], { type: "application/vnd.ms-excel" }),
    ),
  downloadImportTemplate: vi
    .fn()
    .mockResolvedValue(
      new Blob(["template-data"], { type: "application/vnd.ms-excel" }),
    ),
}));

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    // Route toast calls through the mocked `sonner` module so tests can
    // assert on them (@railfinance/ui bundles its own sonner internally).
    const { toast } = await import("sonner");
    return {
      ...actual,
      toast,
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
          data-testid={`action-btn-${label?.toLowerCase() ?? "action"}`}
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
            row: { original: BusinessAreaResponse; index: number };
          }) => React.ReactNode;
        }>;
      }) => (
        <div data-testid="data-table">
          {columns.map((col, index) => {
            if (col.id === "actions" && col.cell) {
              const ctx = {
                row: {
                  original: mockBusinessAreaData,
                  index: 0,
                },
              };
              return (
                <div key={col.id ?? String(index)} data-testid="col-actions-cell">
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
        open,
        title,
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
        <div>
          <button data-testid="force-confirm-delete-btn" onClick={onConfirm}>
            Force Confirm
          </button>
          {open ? (
            <div data-testid="confirmation-modal">
              <h2>{title}</h2>
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
          ) : null}
        </div>
      ),
      ImportModal: ({
        open,
        onOpenChange,
        downloadTemplate,
        mutation,
      }: {
        open?: boolean;
        onOpenChange?: (open: boolean) => void;
        mutation?: { mutate?: (file: File) => void };
        downloadTemplate?: () => Promise<Blob>;
        templateFileName?: string;
      }) =>
        open ? (
          <div data-testid="import-modal">
            <button
              data-testid="close-import-btn"
              onClick={() => onOpenChange?.(false)}
            >
              Close Import
            </button>
            <button
              data-testid="download-template-btn"
              onClick={() => downloadTemplate?.()}
            >
              Download Template
            </button>
            <button
              data-testid="trigger-import-btn"
              onClick={() => {
                const file = new File(["test"], "business-areas.xlsx", {
                  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                mutation?.mutate?.(file);
              }}
            >
              Import
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

vi.mock("@/features/master-data", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/master-data")>();
  return {
    ...actual,
    businessAreaColumns: (
      handlers: Parameters<typeof actual.businessAreaColumns>[0],
    ): ReturnType<typeof actual.businessAreaColumns> => [
      {
        id: "actions",
        meta: { title: "Actions" },
        header: () => null,
        cell: () => (
          <div>
            <button
              data-testid="trigger-edit"
              onClick={() => handlers.onEdit?.(mockBusinessAreaData)}
            >
              Edit
            </button>
            <button
              data-testid="trigger-delete"
              onClick={() => handlers.onDelete?.(mockBusinessAreaData)}
            >
              Delete
            </button>
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    BusinessAreaFormModal: ({
      open,
      mode,
      onSuccess,
      onOpenChange,
      defaultValues,
    }: {
      open?: boolean;
      mode?: string;
      onSuccess?: () => void;
      onOpenChange?: (open: boolean) => void;
      defaultValues?: Partial<BusinessAreaResponse>;
    }) =>
      open ? (
        <div data-testid="business-area-form-modal" data-mode={mode}>
          <div data-testid="form-default-name">{defaultValues?.name}</div>
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
    useDeleteBusinessAreaMutation: (options?: { onSuccess?: () => void }) => ({
      mutate: () => options?.onSuccess?.(),
      isPending: false,
    }),
    useImportBusinessAreasMutation: (options?: { onSuccess?: () => void }) => ({
      mutate: () => options?.onSuccess?.(),
      isPending: false,
    }),
    businessAreaService: mockedBusinessAreaService,
  };
});

globalThis.URL.createObjectURL = vi.fn(() => "blob:mock-url");
globalThis.URL.revokeObjectURL = vi.fn();

describe("BusinessAreaPage", () => {
  it("renders the page with layout and title", () => {
    render(<BusinessAreaPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Business Area" }),
    ).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    render(<BusinessAreaPage />);

    expect(screen.getByTestId("action-btn-export")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-import")).toBeInTheDocument();
    expect(screen.getByTestId("action-btn-add")).toBeInTheDocument();
  });

  it("opens the create form modal when Add is clicked", async () => {
    const user = userEvent.setup();

    render(<BusinessAreaPage />);

    await user.click(screen.getByTestId("action-btn-add"));

    expect(screen.getByTestId("business-area-form-modal")).toBeInTheDocument();
    expect(screen.getByTestId("form-default-name")).toHaveTextContent("");
  });

  it("opens the edit form modal when row edit is clicked", async () => {
    const user = userEvent.setup();

    render(<BusinessAreaPage />);

    await user.click(screen.getByTestId("trigger-edit"));

    expect(screen.getByTestId("business-area-form-modal")).toBeInTheDocument();
    expect(screen.getByTestId("form-default-name")).toHaveTextContent(
      "Business Area Jakarta",
    );
  });

  it("opens the delete confirmation modal and confirms delete", async () => {
    const user = userEvent.setup();

    render(<BusinessAreaPage />);

    await user.click(screen.getByTestId("trigger-delete"));

    expect(screen.getByTestId("confirmation-modal")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Delete Business Area" }),
    ).toBeInTheDocument();

    await user.click(screen.getByTestId("confirm-delete-btn"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("confirmation-modal"),
      ).not.toBeInTheDocument();
    });
  });

  it("ignores delete confirmation when no row is selected", async () => {
    const user = userEvent.setup();

    render(<BusinessAreaPage />);

    await user.click(screen.getByTestId("force-confirm-delete-btn"));

    expect(screen.queryByTestId("confirmation-modal")).not.toBeInTheDocument();
  });

  it("exports business areas when export is clicked", async () => {
    const user = userEvent.setup();

    render(<BusinessAreaPage />);

    await user.click(screen.getByTestId("action-btn-export"));

    await waitFor(() => {
      expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
    });
  });

  it("opens import modal and downloads template", async () => {
    const user = userEvent.setup();

    render(<BusinessAreaPage />);

    await user.click(screen.getByTestId("action-btn-import"));

    expect(screen.getByTestId("import-modal")).toBeInTheDocument();

    await user.click(screen.getByTestId("download-template-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("import-modal")).toBeInTheDocument();
    });
  });

  it("runs the import success callback", async () => {
    const user = userEvent.setup();

    render(<BusinessAreaPage />);

    await user.click(screen.getByTestId("action-btn-import"));
    await user.click(screen.getByTestId("trigger-import-btn"));

    expect(screen.getByTestId("import-modal")).toBeInTheDocument();
  });

  it("shows export error handling when export fails", async () => {
    const { toast } = await import("sonner");
    mockedBusinessAreaService.exportBusinessAreas.mockRejectedValueOnce(
      new Error("boom"),
    );

    const user = userEvent.setup();

    render(<BusinessAreaPage />);

    await user.click(screen.getByTestId("action-btn-export"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to export data");
    });
  });

  it("submits create form and closes the modal", async () => {
    const user = userEvent.setup();

    render(<BusinessAreaPage />);

    await user.click(screen.getByTestId("action-btn-add"));
    await user.click(screen.getByTestId("form-submit"));

    await waitFor(() => {
      expect(
        screen.queryByTestId("business-area-form-modal"),
      ).not.toBeInTheDocument();
    });
  });
});
