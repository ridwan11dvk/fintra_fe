import {
  UnauthorizeContent,
  UnauthorizePage,
} from "@/features/errors/pages/unauthorize.page";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const navigateFn = vi.fn();

vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router")>()),
  useNavigate: () => navigateFn,
}));

describe("UnauthorizeContent", () => {
  it("renders 401 heading", () => {
    render(<UnauthorizeContent />);
    expect(screen.getByText("401")).toBeInTheDocument();
  });

  it("renders 'Unauthorized Access' title", () => {
    render(<UnauthorizeContent />);
    expect(screen.getByText("Unauthorized Access")).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(<UnauthorizeContent />);
    expect(
      screen.getByText(/You don't have permission to access this resource/),
    ).toBeInTheDocument();
  });

  it("renders Back to Dashboard button", () => {
    render(<UnauthorizeContent />);
    expect(
      screen.getByRole("button", { name: /back to dashboard/i }),
    ).toBeInTheDocument();
  });

  it("renders Go to Login button", () => {
    render(<UnauthorizeContent />);
    expect(
      screen.getByRole("button", { name: /go to login/i }),
    ).toBeInTheDocument();
  });

  it("calls navigate('/') when Back to Dashboard is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    render(<UnauthorizeContent />);
    await user.click(
      screen.getByRole("button", { name: /back to dashboard/i }),
    );
    expect(navigateFn).toHaveBeenCalledWith("/");
  });

  it("calls navigate('/login') when Go to Login is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    render(<UnauthorizeContent />);
    await user.click(screen.getByRole("button", { name: /go to login/i }));
    expect(navigateFn).toHaveBeenCalledWith("/login");
  });
});

describe("UnauthorizePage", () => {
  it("renders content", () => {
    render(<UnauthorizePage />);
    expect(screen.getByText("401")).toBeInTheDocument();
  });
});
