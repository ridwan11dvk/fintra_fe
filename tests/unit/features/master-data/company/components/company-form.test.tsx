import { CompanyForm } from "@/features/master-data/company/components/company-form";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockSetFormErrorsFromApi = vi.hoisted(() => vi.fn());

vi.mock("@railfinance/core", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/components/actions", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/components/badges", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/components/data-table", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/components/input", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/components/loader", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/components/modal", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/components/page-header", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/components/page-shell", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/components/visibility", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/hooks", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/lib", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/masterdata", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/types", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/ui/badge", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/ui/button", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/ui/card", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/ui/checkbox", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/ui/dropdown-menu", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/ui/input", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/ui/label", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/ui/pagination", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/ui/popover", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/ui/radio-group", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/ui/select", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/ui/separator", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/ui/table", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/ui/tabs", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});
vi.mock("@railfinance/core/ui/textarea", async () => {
  const actual =
    await vi.importActual<typeof import("@railfinance/core")>(
      "@railfinance/core",
    );
  return {
    ...actual,
    setFormErrorsFromApi: mockSetFormErrorsFromApi,
    useGetModuleOptions: () => ({
      data: {
        data: [
          { value: "1", label: "Accounts Receivable" },
          { value: "2", label: "General Ledger" },
        ],
      },
      isLoading: false,
    }),
  };
});

describe("CompanyForm", () => {
  beforeEach(() => {
    mockSetFormErrorsFromApi.mockClear();
  });

  describe("Create Mode", () => {
    it("renders with code and name fields required", () => {
      const onSubmit = vi.fn();

      render(
        <CompanyForm mode="create" onSubmit={onSubmit} isLoading={false} />,
      );

      expect(screen.getByLabelText(/company code/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
    });

    it("validates required code field", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(
        <CompanyForm mode="create" onSubmit={onSubmit} isLoading={false} />,
      );

      const nameInput = screen.getByLabelText(/company name/i);
      await user.type(nameInput, "Test Company");

      const submitButton = screen.getByRole("button", { name: /save/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/code is required/i)).toBeInTheDocument();
      });
    });

    it("validates required name field", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(
        <CompanyForm mode="create" onSubmit={onSubmit} isLoading={false} />,
      );

      const codeInput = screen.getByLabelText(/company code/i);
      await user.type(codeInput, "COMP001");

      const submitButton = screen.getByRole("button", { name: /save/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      });
    });

    it("validates max length for code field", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(
        <CompanyForm mode="create" onSubmit={onSubmit} isLoading={false} />,
      );

      const codeInput = screen.getByLabelText(/company code/i);
      await user.type(codeInput, "A".repeat(51));

      const nameInput = screen.getByLabelText(/company name/i);
      await user.type(nameInput, "Test Company");

      const submitButton = screen.getByRole("button", { name: /save/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/must not exceed 50 characters/i),
        ).toBeInTheDocument();
      });
    });

    it("accepts maximum length name input", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(
        <CompanyForm mode="create" onSubmit={onSubmit} isLoading={false} />,
      );

      const codeInput = screen.getByLabelText(/company code/i);
      const nameInput = screen.getByLabelText(/company name/i);

      await user.type(codeInput, "COMP001");
      await user.type(nameInput, "A".repeat(100));

      const submitButton = screen.getByRole("button", { name: /save/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled();
      });
    });

    it("submits form with valid data", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(
        <CompanyForm mode="create" onSubmit={onSubmit} isLoading={false} />,
      );

      const codeInput = screen.getByLabelText(/company code/i);
      const nameInput = screen.getByLabelText(/company name/i);
      const addressInput = screen.getByLabelText(/address/i);

      await user.type(codeInput, "COMP001");
      await user.type(nameInput, "Test Company");
      await user.type(addressInput, "123 Test Street");

      const submitButton = screen.getByRole("button", { name: /save/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            code: "COMP001",
            name: "Test Company",
            address: "123 Test Street",
          }),
        );
      });
    });

    it("respects isActive checkbox when unchecked", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(
        <CompanyForm mode="create" onSubmit={onSubmit} isLoading={false} />,
      );

      const codeInput = screen.getByLabelText(/company code/i);
      const nameInput = screen.getByLabelText(/company name/i);
      const activeCheckbox = screen.getByRole("checkbox", { name: /active/i });

      await user.type(codeInput, "COMP001");
      await user.type(nameInput, "Test Company");
      await user.click(activeCheckbox);

      const submitButton = screen.getByRole("button", { name: /save/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            isActive: false,
          }),
        );
      });
    });

    it("shows error when address exceeds 255 characters", async () => {
      const user = userEvent.setup({ delay: null });
      const onSubmit = vi.fn();

      render(
        <CompanyForm mode="create" onSubmit={onSubmit} isLoading={false} />,
      );

      const codeInput = screen.getByLabelText(/company code/i);
      const nameInput = screen.getByLabelText(/company name/i);
      const addressInput = screen.getByLabelText(/address/i);

      await user.type(codeInput, "COMP001");
      await user.type(nameInput, "Test Company");
      await user.type(addressInput, "A".repeat(256));

      const submitButton = screen.getByRole("button", { name: /save/i });
      await user.click(submitButton);

      await waitFor(
        () => {
          expect(
            screen.getByText(/must not exceed 255 characters/i),
          ).toBeInTheDocument();
        },
        { timeout: 10000 },
      );
    }, 15000);

    it("disables submit button when isLoading is true", () => {
      const mockOnSubmit = vi.fn();
      render(
        <CompanyForm mode="create" isLoading={true} onSubmit={mockOnSubmit} />,
      );

      const submitButton = screen.getByRole("button", { name: /saving/i });

      expect(submitButton).toBeDisabled();
    });
  });

  describe("Edit Mode", () => {
    it("pre-fills form with default values in edit mode", () => {
      const onSubmit = vi.fn();
      const defaultValues = {
        id: 1,
        code: "COMP001",
        name: "PT Mitra Utama",
        address: "Jakarta",
        isActive: true,
      };

      render(
        <CompanyForm
          mode="edit"
          onSubmit={onSubmit}
          isLoading={false}
          defaultValues={defaultValues}
        />,
      );

      const codeInput = screen.getByLabelText(
        /company code/i,
      ) as HTMLInputElement;
      const nameInput = screen.getByLabelText(
        /company name/i,
      ) as HTMLInputElement;

      expect(codeInput.value).toBe("COMP001");
      expect(nameInput.value).toBe("PT Mitra Utama");
    });

    it("can update fields in edit mode", async () => {
      const user = userEvent.setup({ delay: null });
      const onSubmit = vi.fn();
      const defaultValues = {
        id: 1,
        code: "COMP001",
        name: "PT Mitra Utama",
        address: "Jakarta",
        isActive: true,
      };

      render(
        <CompanyForm
          mode="edit"
          onSubmit={onSubmit}
          isLoading={false}
          defaultValues={defaultValues}
        />,
      );

      const nameInput = screen.getByLabelText(
        /company name/i,
      ) as HTMLInputElement;

      // Focus and select all text using Ctrl+A, then type replacement
      nameInput.focus();
      await user.keyboard("{Control>}a{/Control}");
      await user.keyboard("PT Mitra Updated");

      const submitButton = screen.getByRole("button", { name: /save/i });
      await user.click(submitButton);

      await waitFor(
        () => {
          expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
              code: "COMP001",
              name: "PT Mitra Updated",
            }),
          );
        },
        { timeout: 10000 },
      );
    }, 15000);

    it("preserves unmodified fields in edit mode", async () => {
      const user = userEvent.setup({ delay: null });
      const onSubmit = vi.fn();
      const defaultValues = {
        id: 1,
        code: "COMP001",
        name: "PT Mitra Utama",
        address: "Jakarta",
        isActive: true,
      };

      render(
        <CompanyForm
          mode="edit"
          onSubmit={onSubmit}
          isLoading={false}
          defaultValues={defaultValues}
        />,
      );

      const addressInput = screen.getByLabelText(
        /address/i,
      ) as HTMLTextAreaElement;

      // Focus and select all text using Ctrl+A, then type replacement
      addressInput.focus();
      await user.keyboard("{Control>}a{/Control}");
      await user.keyboard("Bandung");

      const submitButton = screen.getByRole("button", { name: /save/i });
      await user.click(submitButton);

      await waitFor(
        () => {
          expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
              code: "COMP001",
              name: "PT Mitra Utama",
              address: "Bandung",
            }),
          );
        },
        { timeout: 10000 },
      );
    }, 15000);
  });

  describe("Error Handling", () => {
    it("calls setFormErrorsFromApi when onSubmit throws", async () => {
      const user = userEvent.setup({ delay: null });
      const onSubmit = vi.fn().mockRejectedValue(new Error("API Error"));

      render(
        <CompanyForm mode="create" onSubmit={onSubmit} isLoading={false} />,
      );

      const codeInput = screen.getByLabelText(/company code/i);
      const nameInput = screen.getByLabelText(/company name/i);

      await user.type(codeInput, "COMP001");
      await user.type(nameInput, "Test Company");

      const submitButton = screen.getByRole("button", { name: /save/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSetFormErrorsFromApi).toHaveBeenCalled();
      });
    });
  });

  describe("Child Component Rendering", () => {
    it("renders CompanyDocumentElements in create mode", () => {
      const onSubmit = vi.fn();
      render(
        <CompanyForm mode="create" onSubmit={onSubmit} isLoading={false} />,
      );
      expect(screen.getByText("Company Document Elements")).toBeInTheDocument();
    });

    it("renders CompanyAdditionalDocuments in create mode", () => {
      const onSubmit = vi.fn();
      render(
        <CompanyForm mode="create" onSubmit={onSubmit} isLoading={false} />,
      );
      expect(
        screen.getByText("Company Additional Documents"),
      ).toBeInTheDocument();
    });

    it("does not render document elements section in edit mode", () => {
      const onSubmit = vi.fn();
      render(<CompanyForm mode="edit" onSubmit={onSubmit} isLoading={false} />);
      expect(
        screen.queryByText("Company Document Elements"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Company Additional Documents"),
      ).not.toBeInTheDocument();
    });
  });
});
