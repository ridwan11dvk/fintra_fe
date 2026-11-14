import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockUseGetCompanyFilePresignedUrl = vi.hoisted(() => vi.fn());

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      Modal: ({
        open,
        children,
        title,
        cancelText,
      }: {
        open: boolean;
        children?: React.ReactNode;
        title?: string;
        cancelText?: string;
      }) =>
        open ? (
          <div data-testid="modal">
            <h2>{title}</h2>
            <div data-testid="modal-body">{children}</div>
            <button>{cancelText}</button>
          </div>
        ) : null,
      ProgressLoader: () => <div data-testid="loader">Loading...</div>,
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

vi.mock("@/features/master-data/company/data/company.query", () => ({
  useGetCompanyFilePresignedUrl: mockUseGetCompanyFilePresignedUrl,
}));

import { CompanyFilePreviewModal } from "@/features/master-data/company/components/company-file-preview-modal";

const mockFile = {
  id: 1,
  name: "Test Document",
  alias: "TEST",
  filePath: "test-document.pdf",
  isActive: true,
  uploadedDate: "2024-06-01T00:00:00Z",
  createdAt: "2024-06-01T00:00:00Z",
  updatedAt: "2024-06-01T00:00:00Z",
  companyId: 1,
};

const onOpenChange = vi.fn();

describe("CompanyFilePreviewModal", () => {
  beforeEach(() => {
    mockUseGetCompanyFilePresignedUrl.mockReset();
    mockUseGetCompanyFilePresignedUrl.mockImplementation(
      (
        _companyId: number,
        _fileId: number,
        _options: { enabled: boolean },
      ) => ({
        data: { data: "https://example.com/file.pdf" },
        isLoading: false,
        isError: false,
      }),
    );
  });

  it("renders nothing when closed", () => {
    const { container } = render(
      <CompanyFilePreviewModal
        open={false}
        onOpenChange={onOpenChange}
        file={null}
        companyId={1}
      />,
    );
    expect(container.textContent).toBe("");
  });

  it("shows loader when data is loading", () => {
    mockUseGetCompanyFilePresignedUrl.mockImplementation(
      (
        _companyId: number,
        _fileId: number,
        _options: { enabled: boolean },
      ) => ({
        data: undefined,
        isLoading: true,
        isError: false,
      }),
    );
    render(
      <CompanyFilePreviewModal
        open={true}
        onOpenChange={onOpenChange}
        file={mockFile}
        companyId={1}
      />,
    );
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("shows error state when request fails", () => {
    mockUseGetCompanyFilePresignedUrl.mockImplementation(
      (
        _companyId: number,
        _fileId: number,
        _options: { enabled: boolean },
      ) => ({
        data: undefined,
        isLoading: false,
        isError: true,
      }),
    );
    render(
      <CompanyFilePreviewModal
        open={true}
        onOpenChange={onOpenChange}
        file={mockFile}
        companyId={1}
      />,
    );
    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText("Failed to load file")).toBeInTheDocument();
  });

  it("renders file info and PDF embed when fileUrl is available for PDF files", () => {
    mockUseGetCompanyFilePresignedUrl.mockImplementation(
      (
        _companyId: number,
        _fileId: number,
        _options: { enabled: boolean },
      ) => ({
        data: { data: "https://example.com/file.pdf" },
        isLoading: false,
        isError: false,
      }),
    );
    render(
      <CompanyFilePreviewModal
        open={true}
        onOpenChange={onOpenChange}
        file={mockFile}
        companyId={1}
      />,
    );
    expect(screen.getAllByText("Test Document").length).toBeGreaterThan(0);
    expect(screen.getByText("TEST")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    const embed = document.querySelector("embed");
    expect(embed).toBeInTheDocument();
    expect(embed).toHaveAttribute("type", "application/pdf");
  });

  it("renders image preview for image files", () => {
    const imageFile = {
      ...mockFile,
      filePath: "image.jpg",
      name: "Logo Image",
      alias: "LOGO",
    };
    mockUseGetCompanyFilePresignedUrl.mockImplementation(
      (
        _companyId: number,
        _fileId: number,
        _options: { enabled: boolean },
      ) => ({
        data: { data: "https://example.com/image.jpg" },
        isLoading: false,
        isError: false,
      }),
    );
    render(
      <CompanyFilePreviewModal
        open={true}
        onOpenChange={onOpenChange}
        file={imageFile}
        companyId={1}
      />,
    );
    const img = document.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("alt", "Logo Image");
    expect(img).toHaveAttribute("src", "https://example.com/image.jpg");
    expect(screen.getByText("LOGO")).toBeInTheDocument();
  });

  it("shows download fallback for unsupported file types", () => {
    const unsupportedFile = {
      ...mockFile,
      filePath: "document.docx",
      name: "Word Doc",
    };
    mockUseGetCompanyFilePresignedUrl.mockImplementation(
      (
        _companyId: number,
        _fileId: number,
        _options: { enabled: boolean },
      ) => ({
        data: { data: "https://example.com/doc.docx" },
        isLoading: false,
        isError: false,
      }),
    );
    render(
      <CompanyFilePreviewModal
        open={true}
        onOpenChange={onOpenChange}
        file={unsupportedFile}
        companyId={1}
      />,
    );
    expect(
      screen.getByText("Preview not available for this file type"),
    ).toBeInTheDocument();
    const downloadLink = document.querySelector("a");
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute(
      "href",
      "https://example.com/doc.docx",
    );
    expect(downloadLink).toHaveAttribute("download", "Word Doc");
  });

  it("shows Inactive status badge when file is not active", () => {
    const inactiveFile = { ...mockFile, isActive: false };
    mockUseGetCompanyFilePresignedUrl.mockImplementation(
      (
        _companyId: number,
        _fileId: number,
        _options: { enabled: boolean },
      ) => ({
        data: { data: "https://example.com/file.pdf" },
        isLoading: false,
        isError: false,
      }),
    );
    render(
      <CompanyFilePreviewModal
        open={true}
        onOpenChange={onOpenChange}
        file={inactiveFile}
        companyId={1}
      />,
    );
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("shows formatted uploaded date", () => {
    mockUseGetCompanyFilePresignedUrl.mockImplementation(
      (
        _companyId: number,
        _fileId: number,
        _options: { enabled: boolean },
      ) => ({
        data: { data: "https://example.com/file.pdf" },
        isLoading: false,
        isError: false,
      }),
    );
    render(
      <CompanyFilePreviewModal
        open={true}
        onOpenChange={onOpenChange}
        file={mockFile}
        companyId={1}
      />,
    );
    const formattedDate = new Date("2024-06-01T00:00:00Z").toLocaleDateString();
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });
});
