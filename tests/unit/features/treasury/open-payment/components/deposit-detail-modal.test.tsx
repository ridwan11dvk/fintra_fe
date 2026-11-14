import { DepositDetailModal, type DepositResponse } from "@/features/treasury";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      formatDate: (date: string, format: string, showTime?: boolean) => {
        if (showTime) {
          const d = new Date(date);
          return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}, ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
        }
        const d = new Date(date);
        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
      },
      formatCurrency: (amount: number) => `Rp${amount.toLocaleString("id-ID")}`,
      FilePreview: ({
        open,
        onOpenChange,
        title,
      }: {
        open?: boolean;
        onOpenChange?: (open: boolean) => void;
        title?: string;
      }) =>
        open ? (
          <div data-testid="file-preview" data-title={title}>
            <button onClick={() => onOpenChange?.(false)}>Close Preview</button>
          </div>
        ) : null,
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/alert-banner", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/cards", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/simple-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dialog", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dropdown-menu", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/field", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/pagination", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/skeleton", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/table", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

const mockDeposit: DepositResponse = {
  id: 1,
  agentCode: "AGT001",
  virtualAccount: "1234567890",
  name: "John Doe",
  referenceNumber: "REF-001",
  depositDate: "2025-06-15T10:00:00Z",
  openingBalance: 5000000,
  amount: 1000000,
  closingBalance: 6000000,
  bankCode: "BANK01",
  documentPath: "/documents/test.pdf",
  sendStatus: 0,
  createdAt: "2025-06-15T10:00:00Z",
  updatedAt: "2025-06-16T12:30:00Z",
  createdBy: "admin",
  updatedBy: "system",
};

describe("DepositDetailModal", () => {
  it("should not render when closed", () => {
    const { container } = render(
      <DepositDetailModal
        deposit={mockDeposit}
        isOpen={false}
        onClose={vi.fn()}
      />,
    );

    expect(container.textContent).not.toContain("Deposit Details");
  });

  it("should render loading skeleton when isLoading is true", () => {
    render(
      <DepositDetailModal
        deposit={undefined}
        isOpen={true}
        isLoading={true}
        onClose={vi.fn()}
      />,
    );

    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should render deposit content when data is provided", () => {
    render(
      <DepositDetailModal
        deposit={mockDeposit}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getAllByRole("heading", { name: "Deposit Details" }).length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText("Complete information for this deposit record"),
    ).toBeInTheDocument();
  });

  it("should display agent information section", () => {
    render(
      <DepositDetailModal
        deposit={mockDeposit}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("Agent Information")).toBeInTheDocument();
    expect(screen.getByText("AGT001")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("REF-001")).toBeInTheDocument();
  });

  it("should display deposit details section", () => {
    render(
      <DepositDetailModal
        deposit={mockDeposit}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getAllByText("Deposit Details").length).toBe(2);
    expect(screen.getByText("Rp1.000.000")).toBeInTheDocument();
    expect(screen.getByText("Rp5.000.000")).toBeInTheDocument();
    expect(screen.getByText("Rp6.000.000")).toBeInTheDocument();
  });

  it("should display bank information section", () => {
    render(
      <DepositDetailModal
        deposit={mockDeposit}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("Bank Information")).toBeInTheDocument();
    expect(screen.getByText("BANK01")).toBeInTheDocument();
  });

  it("should display document section and view button when documentPath exists", () => {
    render(
      <DepositDetailModal
        deposit={mockDeposit}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("Document")).toBeInTheDocument();
    expect(screen.getByText("View Document")).toBeInTheDocument();
  });

  it("should not display document section when documentPath is undefined", () => {
    const depositNoDoc = { ...mockDeposit, documentPath: undefined };
    render(
      <DepositDetailModal
        deposit={depositNoDoc}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    expect(screen.queryByText("Document")).not.toBeInTheDocument();
    expect(screen.queryByText("View Document")).not.toBeInTheDocument();
  });

  it("should open file preview when View Document is clicked", async () => {
    const user = userEvent.setup();
    render(
      <DepositDetailModal
        deposit={mockDeposit}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    await user.click(screen.getByText("View Document"));
    expect(screen.getByTestId("file-preview")).toBeInTheDocument();
    expect(screen.getByTestId("file-preview")).toHaveAttribute(
      "data-title",
      "Deposit Document",
    );
  });

  it("should display status section with send status badge", () => {
    render(
      <DepositDetailModal
        deposit={mockDeposit}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Not Sent")).toBeInTheDocument();
  });

  it("should display Sent badge when sendStatus is 1", () => {
    const depositSent = { ...mockDeposit, sendStatus: 1 as 0 | 1 };
    render(
      <DepositDetailModal
        deposit={depositSent}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("Sent")).toBeInTheDocument();
  });

  it("should display audit information section", () => {
    render(
      <DepositDetailModal
        deposit={mockDeposit}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("Audit Information")).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument();
    expect(screen.getByText("system")).toBeInTheDocument();
  });

  it("should render empty state when no deposit data", () => {
    render(
      <DepositDetailModal
        deposit={undefined}
        isOpen={true}
        isLoading={false}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("No deposit data found")).toBeInTheDocument();
  });

  it("should display dashes for missing optional fields", () => {
    const depositMinimal: DepositResponse = {
      id: 1,
      sendStatus: 0,
      createdAt: "",
      updatedAt: "",
      createdBy: "",
      updatedBy: "",
    };
    render(
      <DepositDetailModal
        deposit={depositMinimal}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getAllByText("-").length).toBeGreaterThan(0);
  });
});
