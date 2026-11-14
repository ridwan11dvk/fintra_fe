import type { ClosePaymentResponse } from "@/features/treasury";
import { ClosePaymentDetailModal } from "@/features/treasury/close-payment/components/close-payment-detail-modal";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      formatCurrency: (amount: number, currency: string) => {
        if (currency === "IDR") {
          return `Rp ${amount.toLocaleString("id-ID")}`;
        }
        return `${amount}`;
      },
      formatDate: (date: string, _fmt?: string, _placeholder?: boolean) => {
        return date ?? "";
      },
      cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
      Modal: ({
        open,
        children,
        title,
        className,
      }: {
        open: boolean;
        children: React.ReactNode;
        title?: string;
        className?: string;
      }) =>
        open ? (
          <div data-testid="modal" className={className}>
            <h2 data-testid="modal-title">{title}</h2>
            {children}
          </div>
        ) : null,
      StatusBadge: ({ status, label }: { status: string; label: string }) => (
        <div data-testid={`detail-status-badge-${status}`}>{label}</div>
      ),
      FilePreview: ({
        open,
        onOpenChange,
        filePath,
        title,
      }: {
        open: boolean;
        onOpenChange: (open: boolean) => void;
        filePath: string;
        title?: string;
      }) =>
        open ? (
          <div data-testid="file-preview">
            <span data-testid="file-preview-path">{filePath}</span>
            <span data-testid="file-preview-title">{title}</span>
            <button
              data-testid="file-preview-close"
              onClick={() => onOpenChange(false)}
            >
              Close
            </button>
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

const mockData: ClosePaymentResponse = {
  id: 1,
  custId: "CUST-001",
  name: "PT Example",
  transId: "TRANS-001",
  invoiceNumber: "INV-001",
  ppfNumber: "PPF-001",
  paymentDate: "2025-01-15T10:00:00Z",
  invoiceDate: "2025-01-01",
  printDate: "2025-01-10",
  dueDate: "2025-02-15",
  amount: 10000000,
  paymentAmount: 10000000,
  vatAmount: 1100000,
  whtAmount: 200000,
  bankCode: "BNI",
  bankAccountNumber: "1234567890",
  bankAccountHolder: "PT Example",
  transferReceiptPath: null,
  paymentType: "TRANSFER",
  bankRuleId: 1,
  source: 0,
  paymentStatus: 0,
  postingA8Status: 0,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-02T00:00:00Z",
  createdBy: "admin",
  updatedBy: "editor",
};

describe("ClosePaymentDetailModal", () => {
  it("returns null when no data is provided", () => {
    render(
      <ClosePaymentDetailModal
        open={true}
        onOpenChange={vi.fn()}
        data={undefined}
      />,
    );

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("renders modal with title 'Close Payment Details'", () => {
    render(
      <ClosePaymentDetailModal
        open={true}
        onOpenChange={vi.fn()}
        data={mockData}
      />,
    );

    expect(screen.getByTestId("modal-title")).toHaveTextContent(
      "Close Payment Details",
    );
  });

  describe("Customer Information section", () => {
    it("renders customer information", () => {
      render(
        <ClosePaymentDetailModal
          open={true}
          onOpenChange={vi.fn()}
          data={mockData}
        />,
      );

      expect(screen.getByText("Customer Information")).toBeInTheDocument();
      expect(screen.getByText("CUST-001")).toBeInTheDocument();
      const nameElements = screen.getAllByText("PT Example");
      expect(nameElements.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Transaction References section", () => {
    it("renders transaction references", () => {
      render(
        <ClosePaymentDetailModal
          open={true}
          onOpenChange={vi.fn()}
          data={mockData}
        />,
      );

      expect(screen.getByText("Transaction References")).toBeInTheDocument();
      expect(screen.getByText("TRANS-001")).toBeInTheDocument();
      expect(screen.getByText("INV-001")).toBeInTheDocument();
      expect(screen.getByText("PPF-001")).toBeInTheDocument();
    });
  });

  describe("Dates section", () => {
    it("renders dates with formatDate", () => {
      render(
        <ClosePaymentDetailModal
          open={true}
          onOpenChange={vi.fn()}
          data={mockData}
        />,
      );

      expect(screen.getByText("Dates")).toBeInTheDocument();
      expect(screen.getByText("2025-01-01")).toBeInTheDocument();
      expect(screen.getByText("2025-01-15T10:00:00Z")).toBeInTheDocument();
      expect(screen.getByText("2025-02-15")).toBeInTheDocument();
      expect(screen.getByText("2025-01-10")).toBeInTheDocument();
    });
  });

  describe("Amounts section", () => {
    it("renders amounts with formatCurrency", () => {
      render(
        <ClosePaymentDetailModal
          open={true}
          onOpenChange={vi.fn()}
          data={mockData}
        />,
      );

      expect(screen.getByText("Amounts")).toBeInTheDocument();
      const amountElements = screen.getAllByText("Rp 10.000.000");
      expect(amountElements).toHaveLength(2);
      expect(screen.getByText("Rp 1.100.000")).toBeInTheDocument();
      expect(screen.getByText("Rp 200.000")).toBeInTheDocument();
    });
  });

  describe("Payment Information section", () => {
    it("renders payment info", () => {
      render(
        <ClosePaymentDetailModal
          open={true}
          onOpenChange={vi.fn()}
          data={mockData}
        />,
      );

      expect(screen.getByText("Payment Information")).toBeInTheDocument();
      expect(screen.getByText("BNI")).toBeInTheDocument();
      expect(screen.getByText("1234567890")).toBeInTheDocument();
      const ptElements = screen.getAllByText("PT Example");
      expect(ptElements).toHaveLength(2);
      expect(screen.getByText("TRANSFER")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("shows 'View File' button when transferReceiptPath exists", async () => {
      const dataWithReceipt: ClosePaymentResponse = {
        ...mockData,
        transferReceiptPath: "/uploads/receipt.pdf",
      };

      render(
        <ClosePaymentDetailModal
          open={true}
          onOpenChange={vi.fn()}
          data={dataWithReceipt}
        />,
      );

      expect(screen.getByText("View File")).toBeInTheDocument();
    });

    it("opens FilePreview when View File is clicked", async () => {
      const user = userEvent.setup();
      const dataWithReceipt: ClosePaymentResponse = {
        ...mockData,
        transferReceiptPath: "/uploads/receipt.pdf",
      };

      render(
        <ClosePaymentDetailModal
          open={true}
          onOpenChange={vi.fn()}
          data={dataWithReceipt}
        />,
      );

      await user.click(screen.getByText("View File"));
      expect(screen.getByTestId("file-preview")).toBeInTheDocument();
      expect(screen.getByTestId("file-preview-path")).toHaveTextContent(
        "/uploads/receipt.pdf",
      );
      expect(screen.getByTestId("file-preview-title")).toHaveTextContent(
        "Transfer Receipt",
      );
    });

    it("shows em dash when transferReceiptPath is null", () => {
      render(
        <ClosePaymentDetailModal
          open={true}
          onOpenChange={vi.fn()}
          data={mockData}
        />,
      );

      expect(screen.getByText("—")).toBeInTheDocument();
    });
  });

  describe("Status section", () => {
    it("renders status badges", () => {
      render(
        <ClosePaymentDetailModal
          open={true}
          onOpenChange={vi.fn()}
          data={mockData}
        />,
      );

      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText("Not Generated")).toBeInTheDocument();
      const inactiveBadges = screen.getAllByTestId(
        "detail-status-badge-inactive",
      );
      expect(inactiveBadges).toHaveLength(2);
    });

    it("renders payment status badge for PAID", () => {
      const dataPaid: ClosePaymentResponse = {
        ...mockData,
        paymentStatus: 1,
      };

      render(
        <ClosePaymentDetailModal
          open={true}
          onOpenChange={vi.fn()}
          data={dataPaid}
        />,
      );

      expect(
        screen.getByTestId("detail-status-badge-active"),
      ).toBeInTheDocument();
    });

    it("renders source label", () => {
      render(
        <ClosePaymentDetailModal
          open={true}
          onOpenChange={vi.fn()}
          data={mockData}
        />,
      );

      expect(screen.getByText("Desktop")).toBeInTheDocument();
    });
  });

  describe("Audit Trail section", () => {
    it("renders audit trail information", () => {
      render(
        <ClosePaymentDetailModal
          open={true}
          onOpenChange={vi.fn()}
          data={mockData}
        />,
      );

      expect(screen.getByText("Audit Trail")).toBeInTheDocument();
      expect(screen.getByText("admin")).toBeInTheDocument();
      expect(screen.getByText("editor")).toBeInTheDocument();
    });
  });
});
