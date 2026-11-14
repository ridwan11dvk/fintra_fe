import {
  UnderConstructionContent,
  UnderConstructionPage,
} from "@/features/errors/pages/under-construction.page";
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
      }: {
        children: React.ReactNode;
        type?: string;
      }) => (
        <div data-testid="page" data-type={type}>
          {children}
        </div>
      ),
    };
}
vi.mock("@railfinance/core", __railfinanceCoreMock);
vi.mock("@railfinance/core/components/page-shell", __railfinanceCoreMock);
vi.mock("@railfinance/core/ui/button", __railfinanceCoreMock);

describe("UnderConstructionContent", () => {
  it("renders 'Coming Soon' heading", () => {
    render(<UnderConstructionContent />);
    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
  });

  it("renders 'Under Construction' title", () => {
    render(<UnderConstructionContent />);
    expect(screen.getByText("Under Construction")).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(<UnderConstructionContent />);
    expect(
      screen.getByText(/This page is currently under construction/),
    ).toBeInTheDocument();
  });

  it("renders Go Back button", () => {
    render(<UnderConstructionContent />);
    expect(
      screen.getByRole("button", { name: /go back/i }),
    ).toBeInTheDocument();
  });

  it("renders Back to Dashboard button", () => {
    render(<UnderConstructionContent />);
    expect(
      screen.getByRole("button", { name: /back to dashboard/i }),
    ).toBeInTheDocument();
  });

  it("calls navigate(-1) when Go Back is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    render(<UnderConstructionContent />);
    await user.click(screen.getByRole("button", { name: /go back/i }));
    expect(navigateFn).toHaveBeenCalledWith(-1);
  });

  it("calls navigate('/') when Back to Dashboard is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    render(<UnderConstructionContent />);
    await user.click(
      screen.getByRole("button", { name: /back to dashboard/i }),
    );
    expect(navigateFn).toHaveBeenCalledWith("/");
  });
});

describe("UnderConstructionPage", () => {
  it("renders within Page with type='base'", () => {
    render(<UnderConstructionPage />);
    const layout = screen.getByTestId("page");
    expect(layout).toBeInTheDocument();
    expect(layout).toHaveAttribute("data-type", "base");
  });

  it("renders 'Coming Soon' heading inside the layout", () => {
    render(<UnderConstructionPage />);
    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
  });
});
