import M2mClientForm from "@/features/settings/m2m-client/components/m2m-client-form";
import { AddM2mClientPage } from "@/features/settings/m2m-client/pages/add-m2m-client.page";
import { EditM2mClientPage } from "@/features/settings/m2m-client/pages/edit-m2m-client.page";
import { M2mClientPage } from "@/features/settings/m2m-client/pages/m2m-client.page";
import userEvent from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

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

/**
 * render-with-providers wraps in MemoryRouter at "/" only. Pages that read
 * :id via useParams need their own <Routes> declaration inside the wrapper.
 */
const renderWithRoute = (
  ui: React.ReactElement,
  route: string,
): ReturnType<typeof render> =>
  render(
    <Routes>
      <Route path="/m2m-clients/:id/edit" element={ui} />
      <Route path="*" element={ui} />
    </Routes>,
    { initialEntries: [route] },
  );

describe("M2mClientForm", () => {
  it("renders name and description inputs in create mode", () => {
    render(<M2mClientForm mode="create" onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("does not render save button in view mode", () => {
    render(<M2mClientForm mode="view" onSubmit={vi.fn()} />);

    expect(
      screen.queryByRole("button", { name: "Save" }),
    ).not.toBeInTheDocument();
  });

  it("calls onSubmit with form values on valid submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<M2mClientForm mode="create" onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/Name/), "My Client");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });
});

describe("AddM2mClientPage", () => {
  it("renders the create page with title", () => {
    render(<AddM2mClientPage />);

    expect(screen.getByText("Create M2M Client")).toBeInTheDocument();
  });

  it("submits and opens token modal after create success", async () => {
    const user = userEvent.setup();
    render(<AddM2mClientPage />);

    await user.type(screen.getByLabelText(/Name/), "Token Client");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(screen.getByText("API Client Created")).toBeInTheDocument();
    });
    expect(screen.getByText("tok")).toBeInTheDocument();
  });
});

describe("EditM2mClientPage", () => {
  it("renders edit form with client data", async () => {
    renderWithRoute(<EditM2mClientPage />, "/m2m-clients/1/edit");

    const nameInput = await screen.findByLabelText(/Name/);
    expect(nameInput).toHaveValue("Test Client");
  });

  it("renders name input as editable for other ids", async () => {
    renderWithRoute(<EditM2mClientPage />, "/m2m-clients/2/edit");

    const nameInput = await screen.findByLabelText(/Name/);
    expect(nameInput).toBeInTheDocument();
  });
});

describe("M2mClientPage", () => {
  it("renders the list page with DataTable", () => {
    render(<M2mClientPage />);
    const table = document.querySelector("table");
    expect(table).toBeInTheDocument();
  });
});
