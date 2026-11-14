import { CompanyAdditionalDocuments } from "@/features/master-data/company/components/company-additional-documents";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
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
      }) => (
        <button
          data-testid={`action-btn-${label ?? variant}`}
          onClick={onClick}
          disabled={disabled}
        >
          {label ?? variant}
        </button>
      ),
      OfflineDataTable: ({
        title,
        columns,
        data,
      }: {
        title: string;
        columns: Array<{
          id?: string;
          accessorKey?: string;
          cell?: (info: {
            row: { index: number; original: Record<string, unknown> };
          }) => React.ReactNode;
        }>;
        data: Array<Record<string, unknown>>;
      }) => (
        <div data-testid="offline-data-table">
          <span>{title}</span>
          <span data-testid="data-count">{data.length}</span>
          {columns.map((col) => (
            <div key={col.id ?? col.accessorKey}>
              <span>{col.id ?? col.accessorKey}</span>
              {col.id === "fileSize" && data[0] && (
                <span data-testid="file-size-cell">
                  {col.cell?.({
                    row: { index: 0, original: data[0] },
                  })}
                </span>
              )}
              {col.id === "actions" && data[0] && (
                <div data-testid="actions-cell">
                  {col.cell?.({
                    row: { index: 0, original: data[0] },
                  })}
                </div>
              )}
            </div>
          ))}
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

vi.mock(
  "@/features/master-data/company/components/company-file-form-modal",
  () => ({
    default: ({
      open,
      onOpenChange,
      mode,
      onSuccess,
    }: {
      open: boolean;
      onOpenChange: (open: boolean) => void;
      mode: string;
      onSuccess?: (data?: unknown) => void;
    }) =>
      open ? (
        <div data-testid="company-file-form-modal" data-mode={mode}>
          <button
            data-testid="modal-success"
            onClick={() => {
              onSuccess?.({ name: "Test", alias: "TEST" });
              onOpenChange(false);
            }}
          >
            Success
          </button>
          <button
            data-testid="modal-success-empty"
            onClick={() => {
              onSuccess?.();
              onOpenChange(false);
            }}
          >
            Success Empty
          </button>
        </div>
      ) : null,
    CompanyFileFormModal: ({
      open,
      onOpenChange,
      mode,
      onSuccess,
    }: {
      open: boolean;
      onOpenChange: (open: boolean) => void;
      mode: string;
      onSuccess?: (data?: unknown) => void;
    }) =>
      open ? (
        <div data-testid="company-file-form-modal" data-mode={mode}>
          <button
            data-testid="modal-success"
            onClick={() => {
              onSuccess?.({ name: "Test", alias: "TEST" });
              onOpenChange(false);
            }}
          >
            Success
          </button>
          <button
            data-testid="modal-success-empty"
            onClick={() => {
              onSuccess?.();
              onOpenChange(false);
            }}
          >
            Success Empty
          </button>
        </div>
      ) : null,
  }),
);

const mockFiles = [
  {
    id: "1",
    name: "License Document",
    alias: "LICENSE",
    fileName: "license.pdf",
    fileSize: 2 * 1024 * 1024,
  },
  {
    id: "2",
    name: "Certification",
    alias: "CERT",
    fileName: "cert.pdf",
    fileSize: 5 * 1024 * 1024,
  },
];

const defaultProps = {
  additionalFiles: mockFiles,
  fileModalOpen: false,
  selectedFileForEdit: null,
  isLoading: false,
  onOpenAddFileModal: vi.fn(),
  onOpenEditFileModal: vi.fn(),
  onRemoveAdditionalFile: vi.fn(),
  onFileModalOpenChange: vi.fn(),
  onFileModalSuccess: vi.fn(),
};

describe("CompanyAdditionalDocuments", () => {
  it("renders the card with title and description", () => {
    render(<CompanyAdditionalDocuments {...defaultProps} />);
    expect(
      screen.getByText("Company Additional Documents"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/attach company additional documents/i),
    ).toBeInTheDocument();
  });

  it("renders add action button", () => {
    render(<CompanyAdditionalDocuments {...defaultProps} />);
    const addBtn = screen.getByTestId("action-btn-add");
    expect(addBtn).toBeInTheDocument();
  });

  it("calls onOpenAddFileModal when add button is clicked", async () => {
    const user = userEvent.setup();
    const onOpenAddFileModal = vi.fn();
    render(
      <CompanyAdditionalDocuments
        {...defaultProps}
        onOpenAddFileModal={onOpenAddFileModal}
      />,
    );
    await user.click(screen.getByTestId("action-btn-add"));
    expect(onOpenAddFileModal).toHaveBeenCalledOnce();
  });

  it("renders offline data table with file count", () => {
    render(<CompanyAdditionalDocuments {...defaultProps} />);
    expect(screen.getByTestId("offline-data-table")).toBeInTheDocument();
    expect(screen.getByTestId("data-count").textContent).toBe("2");
  });

  it("renders file size in MB format", () => {
    render(<CompanyAdditionalDocuments {...defaultProps} />);
    expect(screen.getByTestId("file-size-cell")).toBeInTheDocument();
  });

  it("renders edit action button and calls onOpenEditFileModal", async () => {
    const user = userEvent.setup();
    const onOpenEditFileModal = vi.fn();
    render(
      <CompanyAdditionalDocuments
        {...defaultProps}
        onOpenEditFileModal={onOpenEditFileModal}
      />,
    );
    const actionsCell = screen.getByTestId("actions-cell");
    expect(actionsCell).toBeInTheDocument();
    const editBtn = actionsCell.querySelector('button[data-testid*="edit"]');
    if (editBtn) {
      await user.click(editBtn);
      expect(onOpenEditFileModal).toHaveBeenCalledWith(mockFiles[0]);
    }
  });

  it("renders delete action button and calls onRemoveAdditionalFile", async () => {
    const user = userEvent.setup();
    const onRemoveAdditionalFile = vi.fn();
    render(
      <CompanyAdditionalDocuments
        {...defaultProps}
        onRemoveAdditionalFile={onRemoveAdditionalFile}
      />,
    );
    const actionsCell = screen.getByTestId("actions-cell");
    const deleteBtn = actionsCell.querySelector(
      'button[data-testid*="delete"]',
    );
    if (deleteBtn) {
      await user.click(deleteBtn);
      expect(onRemoveAdditionalFile).toHaveBeenCalledWith(mockFiles[0].id);
    }
  });

  it("shows CompanyFileFormModal when fileModalOpen is true", () => {
    render(
      <CompanyAdditionalDocuments {...defaultProps} fileModalOpen={true} />,
    );
    expect(screen.getByTestId("company-file-form-modal")).toBeInTheDocument();
    expect(screen.getByTestId("company-file-form-modal")).toHaveAttribute(
      "data-mode",
      "create",
    );
  });

  it("shows CompanyFileFormModal in edit mode when selectedFileForEdit is set", () => {
    render(
      <CompanyAdditionalDocuments
        {...defaultProps}
        fileModalOpen={true}
        selectedFileForEdit={mockFiles[0]}
      />,
    );
    expect(screen.getByTestId("company-file-form-modal")).toHaveAttribute(
      "data-mode",
      "edit",
    );
  });

  it("disables add button when isLoading is true", () => {
    render(<CompanyAdditionalDocuments {...defaultProps} isLoading={true} />);
    expect(screen.getByTestId("action-btn-add")).toBeDisabled();
  });

  it("calls onFileModalSuccess when modal succeeds", async () => {
    const user = userEvent.setup();
    const onFileModalSuccess = vi.fn();
    const onFileModalOpenChange = vi.fn();
    render(
      <CompanyAdditionalDocuments
        {...defaultProps}
        fileModalOpen={true}
        onFileModalSuccess={onFileModalSuccess}
        onFileModalOpenChange={onFileModalOpenChange}
      />,
    );
    await user.click(screen.getByTestId("modal-success"));
    expect(onFileModalSuccess).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Test", alias: "TEST" }),
    );
  });

  it("renders Attached Files title in datatable", () => {
    render(<CompanyAdditionalDocuments {...defaultProps} />);
    expect(screen.getByText("Attached Files")).toBeInTheDocument();
  });

  it("renders correct number of columns in datatable", () => {
    render(<CompanyAdditionalDocuments {...defaultProps} />);
    const columns = ["name", "alias", "fileName", "fileSize", "actions"];
    columns.forEach((col) => {
      expect(screen.getByText(col)).toBeInTheDocument();
    });
  });

  it("shows 0.00 MB when fileSize is undefined", () => {
    const filesWithoutSize = [
      { ...mockFiles[0], fileSize: undefined },
      ...mockFiles.slice(1),
    ];
    render(
      <CompanyAdditionalDocuments
        {...defaultProps}
        additionalFiles={filesWithoutSize}
      />,
    );
    expect(screen.getByTestId("file-size-cell")).toHaveTextContent("0.00 MB");
  });

  it("does not call onFileModalSuccess when modal succeeds with no data", async () => {
    const user = userEvent.setup();
    const onFileModalSuccess = vi.fn();
    render(
      <CompanyAdditionalDocuments
        {...defaultProps}
        fileModalOpen={true}
        onFileModalSuccess={onFileModalSuccess}
      />,
    );
    await user.click(screen.getByTestId("modal-success-empty"));
    expect(onFileModalSuccess).not.toHaveBeenCalled();
  });
});
