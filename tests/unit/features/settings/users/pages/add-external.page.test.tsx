import userEvent from "@testing-library/user-event";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const mockNavigate = vi.fn();

const { mockCreateExternalUserMutation } = vi.hoisted(() => ({
  mockCreateExternalUserMutation: vi.fn(),
}));

vi.mock("react-router", async (importOriginal) => {
  const actual: object = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

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
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/actions", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/badges", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/data-table", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/image", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/loader", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/modal", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/multiple-badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-header", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/visibility", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/lib", __railfinanceCoreMock);
vi.mock("@railfinance/core/masterdata", __railfinanceCoreMock);
vi.mock("@railfinance/core/types", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/accordion", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/avatar", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/badge", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/card", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/checkbox", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/dialog", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/field", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/input", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/label", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/radio-group", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/select", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/separator", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/tabs", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/textarea", __railfinanceCoreMock);

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

vi.mock("@/features/settings", async (importOriginal) => {
  const actual: object = await importOriginal();
  return {
    ...actual,
    useCreateExternalUserMutation: () => {
      const mutate = mockCreateExternalUserMutation;
      return { mutate, isPending: false };
    },
    ExternalUserForm: ({
      onSubmit,
    }: {
      onSubmit: (data: Record<string, unknown>) => void;
    }) => (
      <div data-testid="external-user-form">
        <button
          data-testid="submit-form"
          onClick={() =>
            onSubmit({
              userType: "PERSONAL",
              name: "Jane Doe",
              email: "jane@example.com",
              username: "jane_doe",
              roles: [1],
              twoFactorEnabled: false,
              password: "",
              phoneNumber: "",
              photo: "",
              nik: "",
              npwp: "",
              ktpFile: "",
              npwpFile: "",
              address: "",
              companyCode: "",
              responsibleName: "",
              responsibleEmail: "",
              responsibleNik: "",
              responsibleAddress: "",
              purpose: "",
              startDate: "",
              endDate: "",
              otpSecret: "",
            })
          }
        >
          Submit Form
        </button>
      </div>
    ),
  };
});

import { AddExternalUserPage } from "@/features/settings/users/pages/add-external.page";

describe("AddExternalUserPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders page with layout and form", () => {
    render(<AddExternalUserPage />);
    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("external-user-form")).toBeInTheDocument();
  });

  it("calls mutation on form submit", async () => {
    const user = userEvent.setup();
    render(<AddExternalUserPage />);

    await user.click(screen.getByTestId("submit-form"));
    expect(mockCreateExternalUserMutation).toHaveBeenCalled();
  });
});
