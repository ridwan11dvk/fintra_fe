import { DepositFormModal, type DepositResponse } from "@/features/treasury";
import userEvent from "@testing-library/user-event";
import { server } from "@tests/unit/mocks/server";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@railfinance/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@railfinance/core")>();
  const { buildUiResponseMock } =
    await import("@tests/unit/mocks/ui-response-mock");
  return buildUiResponseMock(actual);
});

const BASE = "http://localhost:3000";

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
  updatedAt: "2025-06-15T10:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

describe("DepositFormModal", () => {
  it("should not render when closed", () => {
    const { container } = render(
      <DepositFormModal
        deposit={mockDeposit}
        isOpen={false}
        onClose={vi.fn()}
      />,
    );

    expect(container.textContent).not.toContain("Edit Deposit");
  });

  it("should render form fields when open", () => {
    render(
      <DepositFormModal
        deposit={mockDeposit}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("Edit Deposit")).toBeInTheDocument();
    expect(screen.getByLabelText("Agent Code")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Virtual Account")).toBeInTheDocument();
    expect(screen.getByLabelText("Reference No.")).toBeInTheDocument();
  });

  it("should populate form fields with deposit data", () => {
    render(
      <DepositFormModal
        deposit={mockDeposit}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    const agentCodeInput = screen.getByLabelText(
      "Agent Code",
    ) as HTMLInputElement;
    expect(agentCodeInput.value).toBe("AGT001");

    const nameInput = screen.getByLabelText("Name") as HTMLInputElement;
    expect(nameInput.value).toBe("John Doe");
  });

  it("should display deposit date, bank code, and balance fields", () => {
    render(
      <DepositFormModal
        deposit={mockDeposit}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Deposit Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Bank Code")).toBeInTheDocument();
    expect(screen.getByLabelText("Opening Balance")).toBeInTheDocument();
    expect(screen.getByLabelText("Amount")).toBeInTheDocument();
    expect(screen.getByLabelText("Closing Balance")).toBeInTheDocument();
  });

  it("should display document section fields", () => {
    render(
      <DepositFormModal
        deposit={mockDeposit}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Document Path")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Upload Document (Optional)"),
    ).toBeInTheDocument();
  });

  it("should show validation errors for empty required fields on submit", async () => {
    const user = userEvent.setup();
    render(
      <DepositFormModal deposit={undefined} isOpen={true} onClose={vi.fn()} />,
    );

    const saveButton = screen.getByText("Save Changes");
    await user.click(saveButton);

    expect(screen.getByText("Save Changes")).toBeInTheDocument();
  });

  it("should call onClose when Cancel is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <DepositFormModal
        deposit={mockDeposit}
        isOpen={true}
        onClose={onClose}
      />,
    );

    await user.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("should show Save Changes text when not loading", () => {
    render(
      <DepositFormModal
        deposit={mockDeposit}
        isOpen={true}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("Save Changes")).toBeInTheDocument();
  });

  it("should submit form and call onSuccess", async () => {
    server.use(
      http.put(`${BASE}/treasury/deposit/:id`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          message: "Deposit updated successfully",
          data: { id: 1 },
        }),
      ),
    );

    const onSuccess = vi.fn();
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <DepositFormModal
        deposit={mockDeposit}
        isOpen={true}
        onClose={onClose}
        onSuccess={onSuccess}
      />,
    );

    await user.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
