import {
  ServerErrorContent,
  ServerErrorPage,
} from "@/features/errors/pages/server-error.page";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const navigateFn = vi.fn();

vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router")>()),
  useNavigate: () => navigateFn,
}));

describe("ServerErrorContent", () => {
  it("renders 500 heading", () => {
    render(<ServerErrorContent />);
    expect(screen.getByText("500")).toBeInTheDocument();
  });

  it("renders 'Server Error' title", () => {
    render(<ServerErrorContent />);
    expect(screen.getByText("Server Error")).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(<ServerErrorContent />);
    expect(
      screen.getByText(/Something went wrong on our end/),
    ).toBeInTheDocument();
  });

  it("renders Go Back button", () => {
    render(<ServerErrorContent />);
    expect(
      screen.getByRole("button", { name: /go back/i }),
    ).toBeInTheDocument();
  });

  it("renders Back to Dashboard button", () => {
    render(<ServerErrorContent />);
    expect(
      screen.getByRole("button", { name: /back to dashboard/i }),
    ).toBeInTheDocument();
  });

  it("calls navigate(-1) when Go Back is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    render(<ServerErrorContent />);
    await user.click(screen.getByRole("button", { name: /go back/i }));
    expect(navigateFn).toHaveBeenCalledWith(-1);
  });

  it("calls navigate('/') when Back to Dashboard is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    render(<ServerErrorContent />);
    await user.click(
      screen.getByRole("button", { name: /back to dashboard/i }),
    );
    expect(navigateFn).toHaveBeenCalledWith("/");
  });
});

describe("ServerErrorPage", () => {
  it("renders content", () => {
    render(<ServerErrorPage />);
    expect(screen.getByText("500")).toBeInTheDocument();
  });
});
