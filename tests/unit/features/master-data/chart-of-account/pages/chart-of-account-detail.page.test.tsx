import { ChartOfAccountDetailPage } from "@/features/master-data/chart-of-account/pages/chart-of-account-detail.page";
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
    useParams: () => ({ id: "1" }),
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

describe("ChartOfAccountDetailPage", () => {
  it("renders detail view with chart of account data", async () => {
    render(<ChartOfAccountDetailPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByText("View Chart of Account")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Cash and Cash Equivalents")).toBeInTheDocument();
    });
    expect(screen.getByText("11100")).toBeInTheDocument();
  });

  it("navigates back to list when Back button is clicked", async () => {
    const user = userEvent.setup();
    render(<ChartOfAccountDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Cash and Cash Equivalents")).toBeInTheDocument();
    });

    const backBtn = screen.getByRole("button", { name: /back/i });
    await user.click(backBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/master-data/chart-of-account");
  });

  it("navigates to edit page when Edit button is clicked", async () => {
    const user = userEvent.setup();
    render(<ChartOfAccountDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Cash and Cash Equivalents")).toBeInTheDocument();
    });

    const editBtn = screen.getByRole("button", { name: /edit/i });
    await user.click(editBtn);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/master-data/chart-of-account/1/edit",
    );
  });
});
