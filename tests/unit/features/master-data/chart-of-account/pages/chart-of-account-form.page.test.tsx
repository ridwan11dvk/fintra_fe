import { ChartOfAccountFormPage } from "@/features/master-data/chart-of-account/pages/chart-of-account-form.page";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: undefined }),
  };
});

vi.mock("@railfinance/core", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    Page: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="page">{children}</div>
    ),
    PageHeader: ({
      title,
      actions,
    }: {
      title: string;
      actions?: React.ReactNode;
    }) => (
      <div data-testid="page-header">
        <h1>{title}</h1>
        {actions}
      </div>
    ),
  };
});

describe("ChartOfAccountFormPage (Create mode)", () => {
  it("renders page header and form elements", async () => {
    render(<ChartOfAccountFormPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByText("Add Chart of Account")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter account code/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter chart of account name/i),
    ).toBeInTheDocument();
  });

  it("navigates back to list on Cancel button click when form is not dirty", async () => {
    mockNavigate.mockClear();
    const user = userEvent.setup();
    render(<ChartOfAccountFormPage />);

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/master-data/chart-of-account");
  });

  it("shows unsaved changes modal when Cancel is clicked on a dirty form, and navigates on Discard", async () => {
    mockNavigate.mockClear();
    const user = userEvent.setup();
    render(<ChartOfAccountFormPage />);

    const nameInput = screen.getByPlaceholderText(
      /enter chart of account name/i,
    );
    await user.type(nameInput, "New Account Name");

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelBtn);

    expect(screen.getByText("Unsaved changes")).toBeInTheDocument();

    const discardBtn = screen.getByRole("button", { name: /discard/i });
    await user.click(discardBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/master-data/chart-of-account");
  });
});
