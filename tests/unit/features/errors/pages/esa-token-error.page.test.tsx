import {
  EsaTokenErrorContent,
  EsaTokenErrorPage,
} from "@/features/errors/pages/esa-token-error.page";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const navigateFn = vi.fn();

vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router")>()),
  useNavigate: () => navigateFn,
}));

describe("EsaTokenErrorContent", () => {
  it("renders 'Invalid Token' heading", () => {
    render(<EsaTokenErrorContent />);
    expect(screen.getByText("Invalid Token")).toBeInTheDocument();
  });

  it("renders 'Token Validation Failed' title", () => {
    render(<EsaTokenErrorContent />);
    expect(screen.getByText("Token Validation Failed")).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(<EsaTokenErrorContent />);
    expect(
      screen.getByText(/The token you provided is invalid/),
    ).toBeInTheDocument();
  });

  it("renders the note about ESA server", () => {
    render(<EsaTokenErrorContent />);
    expect(
      screen.getByText(/This error may also occur if the ESA server/),
    ).toBeInTheDocument();
  });

  it("renders Back to Login button", () => {
    render(<EsaTokenErrorContent />);
    expect(
      screen.getByRole("button", { name: /back to login/i }),
    ).toBeInTheDocument();
  });

  it("calls navigate('/login') when Back to Login is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    render(<EsaTokenErrorContent />);
    await user.click(screen.getByRole("button", { name: /back to login/i }));
    expect(navigateFn).toHaveBeenCalledWith("/login");
  });
});

describe("EsaTokenErrorPage", () => {
  it("renders content", () => {
    render(<EsaTokenErrorPage />);
    expect(screen.getByText("Invalid Token")).toBeInTheDocument();
  });
});
