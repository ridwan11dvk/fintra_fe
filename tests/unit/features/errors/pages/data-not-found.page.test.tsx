import {
  DataNotFoundContent,
  DataNotFoundPage,
} from "@/features/errors/pages/data-not-found.page";
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

describe("DataNotFoundContent", () => {
  it("renders default title 'No Data Found' when no title prop", () => {
    render(<DataNotFoundContent />);
    expect(screen.getByText("No Data Found")).toBeInTheDocument();
  });

  it("renders custom title when provided", () => {
    render(<DataNotFoundContent title="Custom Data Title" />);
    expect(screen.getByText("Custom Data Title")).toBeInTheDocument();
  });

  it("renders default message when no message prop", () => {
    render(<DataNotFoundContent />);
    expect(
      screen.getByText(/The data you're looking for could not be found/),
    ).toBeInTheDocument();
  });

  it("renders custom message when provided", () => {
    render(
      <DataNotFoundContent message="The requested record does not exist." />,
    );
    expect(
      screen.getByText("The requested record does not exist."),
    ).toBeInTheDocument();
  });

  it("renders Go Back button", () => {
    render(<DataNotFoundContent />);
    expect(
      screen.getByRole("button", { name: /go back/i }),
    ).toBeInTheDocument();
  });

  it("renders Back to Dashboard button", () => {
    render(<DataNotFoundContent />);
    expect(
      screen.getByRole("button", { name: /back to dashboard/i }),
    ).toBeInTheDocument();
  });

  it("calls navigate(-1) when Go Back is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    render(<DataNotFoundContent />);
    await user.click(screen.getByRole("button", { name: /go back/i }));
    expect(navigateFn).toHaveBeenCalledWith(-1);
  });

  it("calls navigate('/') when Back to Dashboard is clicked", async () => {
    const user = (await import("@testing-library/user-event")).default.setup();
    render(<DataNotFoundContent />);
    await user.click(
      screen.getByRole("button", { name: /back to dashboard/i }),
    );
    expect(navigateFn).toHaveBeenCalledWith("/");
  });
});

describe("DataNotFoundPage", () => {
  it("renders within Page with type='base'", () => {
    render(<DataNotFoundPage />);
    const layout = screen.getByTestId("page");
    expect(layout).toBeInTheDocument();
    expect(layout).toHaveAttribute("data-type", "base");
  });

  it("passes title prop to Page", () => {
    render(<DataNotFoundPage title="No Records" />);
    const layout = screen.getByTestId("page");
    expect(layout).toHaveAttribute("data-title", "No Records");
  });

  it("renders custom title in content", () => {
    render(<DataNotFoundPage title="Custom Title" />);
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
  });

  it("renders custom message in content", () => {
    render(<DataNotFoundPage message="No records match your criteria." />);
    expect(
      screen.getByText("No records match your criteria."),
    ).toBeInTheDocument();
  });
});
