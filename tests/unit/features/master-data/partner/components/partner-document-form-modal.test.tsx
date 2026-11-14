import { PartnerDocumentFormModal } from "@/features/master-data/partner/components/partner-document-form-modal";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/master-data", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/features/master-data")>();
  return {
    ...actual,
    useListPartnerDocReferences: () => ({ data: undefined, isLoading: false }),
    useUploadPartnerDocumentMutation: ({
      onSuccess,
    }: {
      onSuccess?: () => void;
    }) => ({
      mutate: (_data: unknown) => {
        onSuccess?.();
      },
      isPending: false,
    }),
    useUpdatePartnerDocumentMutation: ({
      onSuccess,
    }: {
      onSuccess?: () => void;
    }) => ({
      mutate: (_data: unknown) => {
        onSuccess?.();
      },
      isPending: false,
    }),
  };
});

vi.mock("@railfinance/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@railfinance/core")>();
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
  };
});

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

const mockPartner = {
  id: 1,
  name: "PT. Test",
  partnerCode: "TST-001",
  companyCode: "COMP-001",
  countryId: 1,
  partnerCategoryId: 1,
  partnerTypeId: 1,
  partnerSubTypeId: 1,
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  createdBy: "admin",
  updatedBy: "admin",
};

const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
  mode: "create" as const,
  partner: mockPartner,
};

describe("PartnerDocumentFormModal - closed state", () => {
  it("does not render when open=false", () => {
    render(<PartnerDocumentFormModal {...defaultProps} open={false} />);
    expect(
      screen.queryByText("Upload Partner Document"),
    ).not.toBeInTheDocument();
  });
});

describe("PartnerDocumentFormModal - create mode", () => {
  it("renders the title 'Upload Partner Document'", () => {
    render(<PartnerDocumentFormModal {...defaultProps} />);
    expect(screen.getByText("Upload Partner Document")).toBeInTheDocument();
  });

  it("renders the Document Number input", () => {
    render(<PartnerDocumentFormModal {...defaultProps} />);
    expect(screen.getByLabelText(/document number/i)).toBeInTheDocument();
  });

  it("renders the Document Date input", () => {
    render(<PartnerDocumentFormModal {...defaultProps} />);
    expect(screen.getByLabelText(/document date/i)).toBeInTheDocument();
  });

  it("renders Active checkbox", () => {
    render(<PartnerDocumentFormModal {...defaultProps} />);
    expect(screen.getByLabelText(/active/i)).toBeInTheDocument();
  });

  it("renders file upload input", () => {
    render(<PartnerDocumentFormModal {...defaultProps} />);
    const fileInputs = document.querySelectorAll('input[type="file"]');
    expect(fileInputs.length).toBeGreaterThan(0);
  });

  it("does not call onSuccess when no file is selected", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(
      <PartnerDocumentFormModal
        {...defaultProps}
        defaultValues={{ documentName: "Contract" }}
        onSuccess={onSuccess}
      />,
    );

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("calls onSuccess after successful upload with file", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <PartnerDocumentFormModal
        {...defaultProps}
        mode="edit"
        defaultValues={{ id: 5, documentName: "Contract" }}
        onSuccess={onSuccess}
        onOpenChange={onOpenChange}
      />,
    );

    const file = new File(["content"], "test.pdf", { type: "application/pdf" });
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    if (fileInput) await user.upload(fileInput, file);

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  it("renders the Confirm button for submission", () => {
    render(<PartnerDocumentFormModal {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /confirm/i }),
    ).toBeInTheDocument();
  });
});

describe("PartnerDocumentFormModal - edit mode", () => {
  const editValues = {
    id: 1,
    documentName: "Contract",
    documentNumber: "DOC-001",
    isActive: true,
  };

  it("renders 'Edit Partner Document' title in edit mode", () => {
    render(
      <PartnerDocumentFormModal
        {...defaultProps}
        mode="edit"
        defaultValues={editValues}
      />,
    );
    expect(screen.getByText("Edit Partner Document")).toBeInTheDocument();
  });

  it("pre-fills document number in edit mode", () => {
    render(
      <PartnerDocumentFormModal
        {...defaultProps}
        mode="edit"
        defaultValues={editValues}
      />,
    );
    const input = screen.getByLabelText(/document number/i) as HTMLInputElement;
    expect(input.value).toBe("DOC-001");
  });

  it("calls onOpenChange(false) after successful update", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <PartnerDocumentFormModal
        {...defaultProps}
        mode="edit"
        defaultValues={editValues}
        onOpenChange={onOpenChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it("does not call mutate when no id in edit mode", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <PartnerDocumentFormModal
        {...defaultProps}
        mode="edit"
        defaultValues={{ documentName: "No ID Doc" }}
        onOpenChange={onOpenChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});

describe("PartnerDocumentFormModal - local mode", () => {
  it("calls onSuccess with data directly in local mode (edit)", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <PartnerDocumentFormModal
        {...defaultProps}
        mode="edit"
        isLocalMode={true}
        defaultValues={{ id: 10, documentName: "Contract" }}
        onSuccess={onSuccess}
        onOpenChange={onOpenChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("uses existing id when editing in local mode", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(
      <PartnerDocumentFormModal
        {...defaultProps}
        mode="edit"
        isLocalMode={true}
        defaultValues={{ id: 42, documentName: "Existing Doc" }}
        onSuccess={onSuccess}
      />,
    );

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
