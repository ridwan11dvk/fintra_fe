import { NotFoundContent, NotFoundPage } from "@/features/errors/pages/not-found.page";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const navigateFn = vi.fn();

vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router")>()),
  useNavigate: () => navigateFn,
}));

describe("NotFoundContent", () => {
  it("renders 404 heading", () => {
    render(<NotFoundContent />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders Page Not Found title", () => {
    render(<NotFoundContent />);
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(<NotFoundContent />);
    expect(
      screen.getByText(/The page you're looking for doesn't exist/),
    ).toBeInTheDocument();
  });

  it("renders Go Back button", () => {
    render(<NotFoundContent />);
    expect(
      screen.getByRole("button", { name: /go back/i }),
    ).toBeInTheDocument();
  });

  it("renders Back to Dashboard button", () => {
    render(<NotFoundContent />);
    expect(
      screen.getByRole("button", { name: /back to dashboard/i }),
    ).toBeInTheDocument();
  });

  it("calls navigate(-1) when Go Back is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    render(<NotFoundContent />);
    await user.click(screen.getByRole("button", { name: /go back/i }));
    expect(navigateFn).toHaveBeenCalledWith(-1);
  });

  it("calls navigate('/') when Back to Dashboard is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    render(<NotFoundContent />);
    await user.click(
      screen.getByRole("button", { name: /back to dashboard/i }),
    );
    expect(navigateFn).toHaveBeenCalledWith("/");
  });
});

describe("NotFoundPage", () => {
  it("renders content", () => {
    render(<NotFoundPage />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });
});
