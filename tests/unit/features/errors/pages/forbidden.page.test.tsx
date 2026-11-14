import {
  ForbiddenContent,
  ForbiddenPage,
} from "@/features/errors/pages/forbidden.page";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const navigateFn = vi.fn();
const logoutFn = vi.fn();

vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router")>()),
  useNavigate: () => navigateFn,
}));

async function __railfinanceCoreMock(
  importOriginal: () => Promise<Record<string, unknown>>,
) {
    const actual = await importOriginal();
    return {
      ...actual,
      useAuth: () => ({
        logout: logoutFn,
      }),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/hooks", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);

describe("ForbiddenContent", () => {
  it("renders 403 heading", () => {
    render(<ForbiddenContent />);
    expect(screen.getByText("403")).toBeInTheDocument();
  });

  it("renders Forbidden Access title", () => {
    render(<ForbiddenContent />);
    expect(screen.getByText("Forbidden Access")).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(<ForbiddenContent />);
    expect(
      screen.getByText(/You do not have permission to access this resource/),
    ).toBeInTheDocument();
  });

  it("renders Back to Dashboard button", () => {
    render(<ForbiddenContent />);
    expect(
      screen.getByRole("button", { name: /back to dashboard/i }),
    ).toBeInTheDocument();
  });

  it("renders Go Back button", () => {
    render(<ForbiddenContent />);
    expect(
      screen.getByRole("button", { name: /go back/i }),
    ).toBeInTheDocument();
  });

  it("renders Re-login button", () => {
    render(<ForbiddenContent />);
    expect(
      screen.getByRole("button", { name: /re-login/i }),
    ).toBeInTheDocument();
  });

  it("calls navigate('/') when Back to Dashboard is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    render(<ForbiddenContent />);
    await user.click(
      screen.getByRole("button", { name: /back to dashboard/i }),
    );
    expect(navigateFn).toHaveBeenCalledWith("/");
  });

  it("calls navigate(-1) when Go Back is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    render(<ForbiddenContent />);
    await user.click(screen.getByRole("button", { name: /go back/i }));
    expect(navigateFn).toHaveBeenCalledWith(-1);
  });

  it("calls logout() when Re-login is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    render(<ForbiddenContent />);
    await user.click(screen.getByRole("button", { name: /re-login/i }));
    expect(logoutFn).toHaveBeenCalledOnce();
  });
});

describe("ForbiddenPage", () => {
  it("renders content", () => {
    render(<ForbiddenPage />);
    expect(screen.getByText("403")).toBeInTheDocument();
  });
});
