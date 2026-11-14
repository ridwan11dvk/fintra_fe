import { VillageFormModal } from "@/features/master-data/village/components/village-form-modal";
import userEvent from "@testing-library/user-event";
import { server } from "@tests/unit/mocks/server";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { http, HttpResponse } from "msw";
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
      useGetProvinceOptions: vi.fn(() => ({ data: mockOptionData })),
      useGetRegencyOptions: vi.fn(() => ({ data: mockRegencyData })),
      useGetDistrictOptions: vi.fn(() => ({ data: mockDistrictData })),
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

const mockOptionData = {
  data: [
    { value: "1", label: "Province A", description: "Province A" },
    { value: "2", label: "Province B", description: "Province B" },
  ],
};

const mockRegencyData = {
  data: [
    { value: "1", label: "Regency X", description: "Regency X" },
    { value: "2", label: "Regency Y", description: "Regency Y" },
  ],
};

const mockDistrictData = {
  data: [
    { value: "1", label: "District M", description: "District M" },
    { value: "2", label: "District N", description: "District N" },
  ],
};

async function selectComboboxOption(
  user: ReturnType<typeof userEvent.setup>,
  placeholder: string,
  optionLabel: string,
) {
  const input = screen.getByPlaceholderText(placeholder);
  await user.click(input);

  const options = await screen.findAllByRole("option");
  const target = options.find((opt) => opt.textContent?.includes(optionLabel));
  if (target) {
    fireEvent.click(target);
  }
  return target;
}

describe("VillageFormModal", () => {
  describe("when open=false", () => {
    it("does not render modal content when closed", () => {
      render(
        <VillageFormModal open={false} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.queryByText("Add Village")).not.toBeInTheDocument();
    });
  });

  describe("create mode", () => {
    it("renders the modal title 'Add Village'", () => {
      render(
        <VillageFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.getByText("Add Village")).toBeInTheDocument();
    });

    it("renders a 'Create' confirm button", () => {
      render(
        <VillageFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(
        screen.getByRole("button", { name: /^create$/i }),
      ).toBeInTheDocument();
    });

    it("renders required fields (name, province, regency, district)", () => {
      render(
        <VillageFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(
        screen.getByPlaceholderText("e.g., Cihampelas"),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Select province"),
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Select regency")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Select district"),
      ).toBeInTheDocument();
    });

    it("shows validation error when submitting empty form", async () => {
      const user = userEvent.setup();
      render(
        <VillageFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(
          screen.getByText("Village name is required"),
        ).toBeInTheDocument();
      });
      expect(screen.getByText("Province is required")).toBeInTheDocument();
      expect(screen.getByText("Regency is required")).toBeInTheDocument();
      expect(screen.getByText("District is required")).toBeInTheDocument();
    });

    it("calls onOpenChange(false) after successful form submission", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <VillageFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await user.type(
        screen.getByPlaceholderText("e.g., Cihampelas"),
        "Cihampelas",
      );
      await selectComboboxOption(user, "Select province", "Province A");
      await selectComboboxOption(user, "Select regency", "Regency X");
      await selectComboboxOption(user, "Select district", "District M");

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("calls onSuccess after successful form submission", async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();
      const onOpenChange = vi.fn();

      render(
        <VillageFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
          onSuccess={onSuccess}
        />,
      );

      await user.type(
        screen.getByPlaceholderText("e.g., Cihampelas"),
        "Cihampelas",
      );
      await selectComboboxOption(user, "Select province", "Province A");
      await selectComboboxOption(user, "Select regency", "Regency X");
      await selectComboboxOption(user, "Select district", "District M");

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("edit mode", () => {
    const defaultValues = {
      id: 1,
      code: "VIL001",
      name: "Cihampelas",
      postalCode: "40141",
      provinceId: 1,
      regencyId: 1,
      districtId: 1,
      district: { id: 1, code: "DIST001", name: "Test District" },
      isActive: true,
      createdAt: "2024-06-01T00:00:00Z",
      updatedAt: "2024-06-01T00:00:00Z",
      createdBy: "admin",
      updatedBy: "admin",
    };

    it("renders the modal title 'Edit Village'", () => {
      render(
        <VillageFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      expect(screen.getByText("Edit Village")).toBeInTheDocument();
    });

    it("renders an 'Update' confirm button", () => {
      render(
        <VillageFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      expect(
        screen.getByRole("button", { name: /^update$/i }),
      ).toBeInTheDocument();
    });

    it("pre-fills the name field with defaultValues", async () => {
      render(
        <VillageFormModal
          open={true}
          onOpenChange={vi.fn()}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      await waitFor(() => {
        const nameInput = screen.getByPlaceholderText(
          "e.g., Cihampelas",
        ) as HTMLInputElement;
        expect(nameInput.value).toBe("Cihampelas");
      });
    });

    it("calls onOpenChange(false) after successful update", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <VillageFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={defaultValues}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("e.g., Cihampelas"),
        ).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText("e.g., Cihampelas");
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Village");

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe("error handling", () => {
    const BASE = "http://localhost:3000";

    it("does not close modal when create mutation fails with server error", async () => {
      server.use(
        http.post(`${BASE}/master/village`, () =>
          HttpResponse.json({ message: "Duplicate entry" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <VillageFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="create"
        />,
      );

      await user.type(
        screen.getByPlaceholderText("e.g., Cihampelas"),
        "Cihampelas",
      );
      await selectComboboxOption(user, "Select province", "Province A");
      await selectComboboxOption(user, "Select regency", "Regency X");
      await selectComboboxOption(user, "Select district", "District M");

      await user.click(screen.getByRole("button", { name: /^create$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(screen.getByText("Add Village")).toBeInTheDocument();
    });

    it("does not close modal when update mutation fails with server error", async () => {
      server.use(
        http.put(`${BASE}/master/village/:id`, () =>
          HttpResponse.json({ message: "Validation failed" }, { status: 422 }),
        ),
      );

      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <VillageFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={{
            id: 1,
            name: "Cihampelas",
            provinceId: 1,
            regencyId: 1,
            districtId: 1,
            isActive: true,
            createdAt: "2024-06-01T00:00:00Z",
            updatedAt: "2024-06-01T00:00:00Z",
            createdBy: "admin",
            updatedBy: "admin",
          }}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByPlaceholderText("e.g., Cihampelas"),
        ).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText("e.g., Cihampelas");
      await user.clear(nameInput);
      await user.type(nameInput, "Updated Village");

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      await waitFor(() => {
        expect(onOpenChange).not.toHaveBeenCalledWith(false);
      });
      expect(screen.getByText("Edit Village")).toBeInTheDocument();
    });
  });

  describe("branch coverage", () => {
    it("does not call updateMutation when mode is edit but defaultValues has no id", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <VillageFormModal
          open={true}
          onOpenChange={onOpenChange}
          mode="edit"
          defaultValues={{
            name: "Cihampelas",
            provinceId: 1,
            regencyId: 1,
            districtId: 1,
            isActive: true,
          }}
        />,
      );

      await user.click(screen.getByRole("button", { name: /^update$/i }));

      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it("toggles isActive checkbox", async () => {
      const user = userEvent.setup();
      render(
        <VillageFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      const checkboxes = screen.getAllByRole("checkbox");
      const activeCheckbox = checkboxes[checkboxes.length - 1];
      expect(activeCheckbox).toHaveAttribute("aria-checked", "true");

      await user.click(activeCheckbox);
      expect(activeCheckbox).toHaveAttribute("aria-checked", "false");

      await user.click(activeCheckbox);
      expect(activeCheckbox).toHaveAttribute("aria-checked", "true");
    });

    it("renders optional fields (code, postalCode)", () => {
      render(
        <VillageFormModal open={true} onOpenChange={vi.fn()} mode="create" />,
      );

      expect(screen.getByPlaceholderText("e.g., VIL001")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("e.g., 40141")).toBeInTheDocument();
    });
  });
});
