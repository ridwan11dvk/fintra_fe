import { ChartOfAccountPage } from "@/features/master-data/chart-of-account/pages/chart-of-account.page";
import {
  render,
  screen,
  waitFor,
} from "@tests/unit/utils/render-with-providers";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { mockChartOfAccount } from "../data/chart-of-account.handlers";

const { mockNavigate, mockToast } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockToast: {
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      pathname: "/master-data/chart-of-account",
      search: "",
      hash: "",
      state: null,
      key: "default",
    }),
  };
});

vi.mock("@railfinance/core", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    toast: mockToast,
    useAuth: () => ({
      can: () => true,
      hasResource: () => true,
      permissions: [],
      roles: [],
      user: {},
      token: null,
      isSuperAdmin: false,
      isAuthenticated: true,
      isLoading: false,
      isRefreshing: false,
      error: null,
      logout: vi.fn(),
      scheduleTokenRefresh: vi.fn(),
    }),
    Visibility: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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
    DataTable: ({
      title,
      columns,
    }: {
      title?: string;
      columns?: unknown[];
    }) => (
      <div data-testid="data-table">
        <span>{title}</span>
        <span data-testid="columns-count">{columns?.length}</span>
      </div>
    ),
    ActionButton: ({
      label,
      onClick,
      disabled,
    }: {
      label?: string;
      onClick?: () => void;
      disabled?: boolean;
    }) => (
      <button
        data-testid={`action-btn-${label?.toLowerCase().replace(/\s+/g, "-")}`}
        onClick={onClick}
        disabled={disabled}
      >
        {label}
      </button>
    ),
    AlertBanner: ({
      items,
    }: {
      items?: Array<{ title?: string; description?: string }>;
    }) => (
      <div data-testid="alert-banner">
        {items?.map((item, idx) => (
          <div key={idx}>
            <span>{item.title}</span>
            <span>{item.description}</span>
          </div>
        ))}
      </div>
    ),
  };
});

vi.mock("@railfinance/core/components/modal", () => ({
  ImportModal: ({
    open,
    onOpenChange,
    downloadTemplate,
    mutation,
  }: {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    mutation?: { mutate?: (file: { file: File }) => void };
    downloadTemplate?: () => Promise<Blob>;
    templateFileName?: string;
  }) =>
    open ? (
      <div data-testid="import-modal">
        <button
          data-testid="close-import-btn"
          onClick={() => onOpenChange?.(false)}
        >
          Close Import
        </button>
        <button
          data-testid="download-template-btn"
          onClick={() => downloadTemplate?.()}
        >
          Download Template
        </button>
        <button
          data-testid="trigger-import-btn"
          onClick={() =>
            mutation?.mutate?.({
              file: new File(["dummy"], "coa.xlsx", {
                type: "application/vnd.ms-excel",
              }),
            })
          }
        >
          Execute
        </button>
      </div>
    ) : null,
}));

describe("ChartOfAccountPage", () => {
  it("renders page header and data table", async () => {
    render(<ChartOfAccountPage />);

    expect(screen.getByTestId("page")).toBeInTheDocument();
    expect(screen.getByTestId("page-header")).toBeInTheDocument();
    expect(screen.getByText("Chart of Account")).toBeInTheDocument();
    expect(screen.getByTestId("data-table")).toBeInTheDocument();
  });

  it("navigates to create page when Add button is clicked", async () => {
    const user = userEvent.setup();
    render(<ChartOfAccountPage />);

    const createBtn = screen.getByRole("button", {
      name: /add chart of account/i,
    });
    await user.click(createBtn);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/master-data/chart-of-account/create",
    );
  });

  it("opens import modal when Import Excel button is clicked and allows downloading template", async () => {
    const user = userEvent.setup();
    render(<ChartOfAccountPage />);

    expect(screen.queryByTestId("import-modal")).not.toBeInTheDocument();

    const importBtn = screen.getByRole("button", {
      name: /import excel/i,
    });
    await user.click(importBtn);

    expect(screen.getByTestId("import-modal")).toBeInTheDocument();

    const downloadBtn = screen.getByTestId("download-template-btn");
    await user.click(downloadBtn);

    const closeBtn = screen.getByTestId("close-import-btn");
    await user.click(closeBtn);

    expect(screen.queryByTestId("import-modal")).not.toBeInTheDocument();
  });

  it("shows result modal when import succeeds", async () => {
    const user = userEvent.setup();
    render(<ChartOfAccountPage />);

    const importBtn = screen.getByRole("button", {
      name: /import excel/i,
    });
    await user.click(importBtn);

    const executeBtn = screen.getByTestId("trigger-import-btn");
    await user.click(executeBtn);

    await waitFor(() => {
      expect(
        screen.getByText("Import Completed Successfully"),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText("Import completed successfully"),
    ).toBeInTheDocument();
    expect(screen.getByText("Total Rows")).toBeInTheDocument();

    const closeButtons = screen.getAllByRole("button", { name: /close/i });
    await user.click(closeButtons[closeButtons.length - 1]);
    await waitFor(() => {
      expect(screen.queryByText("Import Completed Successfully")).not.toBeInTheDocument();
    });
  });

  it("shows result modal with error when import fails with 400 error message", async () => {
    server.use(
      http.post("*/master-data/chart-of-accounts/import", () =>
        HttpResponse.json(
          { message: "No data rows found in import file", status: "ERROR" },
          { status: 400 },
        ),
      ),
    );

    const user = userEvent.setup();
    render(<ChartOfAccountPage />);

    const importBtn = screen.getByRole("button", {
      name: /import excel/i,
    });
    await user.click(importBtn);

    const executeBtn = screen.getByTestId("trigger-import-btn");
    await user.click(executeBtn);

    await waitFor(() => {
      expect(
        screen.getByText("Import Completed with Errors"),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText("No data rows found in import file"),
    ).toBeInTheDocument();
  });

  it("shows result modal with row errors and download button when import completes with status WARNING", async () => {
    server.use(
      http.post("*/master-data/chart-of-accounts/import", () =>
        HttpResponse.json({
          message:
            "Chart of Account import completed with warnings - 3 rows imported, 1 rows failed",
          status: "WARNING",
          data: {
            summary: {
              totalRows: 4,
              validRows: 3,
              invalidRows: 1,
              createdRows: 3,
              updatedRows: 0,
              skippedRows: 0,
              dryRun: false,
            },
            rowErrors: [
              {
                rowNumber: 5,
                message: "Level is required",
              },
            ],
            errorReport: {
              fileName: "chart-of-account-import-errors.xlsx",
              contentType:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              base64Content: "mock-base64",
            },
          },
        }),
      ),
    );

    const user = userEvent.setup();
    render(<ChartOfAccountPage />);

    const importBtn = screen.getByRole("button", {
      name: /import excel/i,
    });
    await user.click(importBtn);

    const executeBtn = screen.getByTestId("trigger-import-btn");
    await user.click(executeBtn);

    await waitFor(() => {
      expect(
        screen.getByText("Import Completed with Errors"),
      ).toBeInTheDocument();
    });
    expect(screen.getByText(/Level is required/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /download error report/i }),
    ).toBeInTheDocument();
  });

  it("shows result modal with row errors and download button when import completes with status ERROR on 200 OK", async () => {
    server.use(
      http.post("*/master-data/chart-of-accounts/import", () =>
        HttpResponse.json({
          message: "Chart of Account import failed - all rows are invalid",
          status: "ERROR",
          data: {
            summary: {
              totalRows: 1,
              validRows: 0,
              invalidRows: 1,
              createdRows: 0,
              updatedRows: 0,
              skippedRows: 0,
              dryRun: false,
            },
            rowErrors: [
              {
                rowNumber: 2,
                message: "Level is required",
              },
            ],
            errorReport: {
              fileName: "chart-of-account-import-errors.xlsx",
              contentType:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              base64Content: "mock-base64",
            },
          },
        }),
      ),
    );

    const user = userEvent.setup();
    render(<ChartOfAccountPage />);

    const importBtn = screen.getByRole("button", {
      name: /import excel/i,
    });
    await user.click(importBtn);

    const executeBtn = screen.getByTestId("trigger-import-btn");
    await user.click(executeBtn);

    await waitFor(() => {
      expect(
        screen.getByText("Import Completed with Errors"),
      ).toBeInTheDocument();
    });
    expect(screen.getByText(/Level is required/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /download error report/i }),
    ).toBeInTheDocument();
  });
});
