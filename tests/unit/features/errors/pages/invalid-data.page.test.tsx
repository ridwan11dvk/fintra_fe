import {
  InvalidDataContent,
  InvalidDataPage,
} from "@/features/errors/pages/invalid-data.page";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import { describe, expect, it, vi } from "vitest";

const navigateFn = vi.fn();

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
      Page: ({
        children,
        type,
        title,
      }: {
        children: React.ReactNode;
        type?: string;
        title?: string;
      }) => (
        <div data-testid="page" data-type={type} data-title={title}>
          {children}
        </div>
      ),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);

describe("InvalidDataContent", () => {
  it("renders default title 'Invalid Data' when no title prop", () => {
    render(<InvalidDataContent />);
    expect(screen.getByText("Invalid Data")).toBeInTheDocument();
  });

  it("renders custom title when provided", () => {
    render(<InvalidDataContent title="Custom Error Title" />);
    expect(screen.getByText("Custom Error Title")).toBeInTheDocument();
  });

  it("renders default message when no message prop", () => {
    render(<InvalidDataContent />);
    expect(
      screen.getByText(/The data provided is invalid or incomplete/),
    ).toBeInTheDocument();
  });

  it("renders custom message when provided", () => {
    render(
      <InvalidDataContent message="Please correct your input and try again." />,
    );
    expect(
      screen.getByText("Please correct your input and try again."),
    ).toBeInTheDocument();
  });

  it("renders Go Back button", () => {
    render(<InvalidDataContent />);
    expect(
      screen.getByRole("button", { name: /go back/i }),
    ).toBeInTheDocument();
  });

  it("renders Back to Dashboard button", () => {
    render(<InvalidDataContent />);
    expect(
      screen.getByRole("button", { name: /back to dashboard/i }),
    ).toBeInTheDocument();
  });

  it("calls navigate(-1) when Go Back is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    render(<InvalidDataContent />);
    await user.click(screen.getByRole("button", { name: /go back/i }));
    expect(navigateFn).toHaveBeenCalledWith(-1);
  });

  it("calls navigate('/') when Back to Dashboard is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    render(<InvalidDataContent />);
    await user.click(
      screen.getByRole("button", { name: /back to dashboard/i }),
    );
    expect(navigateFn).toHaveBeenCalledWith("/");
  });
});

describe("InvalidDataPage", () => {
  it("renders within Page with type='base'", () => {
    render(<InvalidDataPage />);
    const layout = screen.getByTestId("page");
    expect(layout).toBeInTheDocument();
    expect(layout).toHaveAttribute("data-type", "base");
  });

  it("passes title prop to Page", () => {
    render(<InvalidDataPage title="Custom Title" />);
    const layout = screen.getByTestId("page");
    expect(layout).toHaveAttribute("data-title", "Custom Title");
  });

  it("renders custom title in content", () => {
    render(<InvalidDataPage title="Override Title" />);
    expect(screen.getByText("Override Title")).toBeInTheDocument();
  });

  it("renders custom message in content", () => {
    render(<InvalidDataPage message="Custom error message" />);
    expect(screen.getByText("Custom error message")).toBeInTheDocument();
  });
});
