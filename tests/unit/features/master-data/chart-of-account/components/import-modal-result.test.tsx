import {
  ImportModalResult,
  type ImportModalResultData,
} from "@/features/master-data/chart-of-account/components/import-modal-result";
import { render, screen } from "@tests/unit/utils/render-with-providers";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const mockDownloadBase64File = vi.fn();

vi.mock("@railfinance/core/lib", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    downloadBase64File: (...args: unknown[]) => mockDownloadBase64File(...args),
  };
});

describe("ImportModalResult", () => {
  it("does not render modal content when open is false", () => {
    render(
      <ImportModalResult
        open={false}
        onOpenChange={vi.fn()}
        result={null}
      />,
    );

    expect(screen.queryByText("Import Result")).not.toBeInTheDocument();
  });

  it("renders success state and summary metrics when import succeeds", () => {
    const successResult: ImportModalResultData = {
      status: "SUCCESS",
      message: "Chart of Account imported successfully",
      summary: {
        totalRows: 15,
        validRows: 15,
        invalidRows: 0,
        createdRows: 15,
        updatedRows: 0,
        skippedRows: 0,
        dryRun: false,
      },
      rowErrors: [],
      errorReport: null,
    };

    render(
      <ImportModalResult
        open={true}
        onOpenChange={vi.fn()}
        result={successResult}
      />,
    );

    expect(screen.getByText("Import Result")).toBeInTheDocument();
    expect(
      screen.getByText("Import Completed Successfully"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Chart of Account imported successfully"),
    ).toBeInTheDocument();
    expect(screen.getByText("Total Rows")).toBeInTheDocument();
    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getAllByText("15")).toHaveLength(2);
    expect(screen.getByText("Failed")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /download error report/i }),
    ).not.toBeInTheDocument();
  });

  it("renders error details and download error report button when failures occur", async () => {
    const user = userEvent.setup();
    const errorResult: ImportModalResultData = {
      status: "WARNING",
      message: "Some rows failed validation",
      summary: {
        totalRows: 5,
        validRows: 3,
        invalidRows: 2,
        createdRows: 3,
        updatedRows: 0,
        skippedRows: 0,
        dryRun: false,
      },
      rowErrors: [
        { rowNumber: 2, message: "Code must be unique" },
        { rowNumber: 4, message: "Name is required" },
      ],
      errorReport: {
        fileName: "coa_errors.xlsx",
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        base64Content: "dGVzdC1lcnJvci1jb250ZW50",
      },
    };

    render(
      <ImportModalResult
        open={true}
        onOpenChange={vi.fn()}
        result={errorResult}
      />,
    );

    expect(screen.getByText("Import Completed with Errors")).toBeInTheDocument();
    expect(screen.getByText("Some rows failed validation")).toBeInTheDocument();
    expect(screen.getByText("Row 2:")).toBeInTheDocument();
    expect(screen.getByText("Code must be unique")).toBeInTheDocument();
    expect(screen.getByText("Row 4:")).toBeInTheDocument();
    expect(screen.getByText("Name is required")).toBeInTheDocument();

    const downloadBtn = screen.getByRole("button", {
      name: /download error report/i,
    });
    expect(downloadBtn).toBeInTheDocument();

    await user.click(downloadBtn);
    expect(mockDownloadBase64File).toHaveBeenCalledWith(
      "dGVzdC1lcnJvci1jb250ZW50",
      "coa_errors.xlsx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
  });

  it("triggers onOpenChange when close button is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <ImportModalResult
        open={true}
        onOpenChange={onOpenChange}
        result={null}
      />,
    );

    const closeButtons = screen.getAllByRole("button", { name: /close/i });
    await user.click(closeButtons[closeButtons.length - 1]);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

