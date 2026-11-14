import { Button, Modal } from "@railfinance/core";
import { downloadBase64File } from "@railfinance/core/lib";
import type {
  ImportErrorReport,
  ImportRowError,
  ImportSummary,
} from "@railfinance/core/types";
import { AlertCircle, CheckCircle2, Download } from "lucide-react";

export interface ImportModalResultData {
  status: "SUCCESS" | "WARNING" | "ERROR" | string;
  message: string;
  summary?: ImportSummary;
  rowErrors?: ImportRowError[];
  errorReport?: ImportErrorReport | null;
}

export interface ImportModalResultProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: ImportModalResultData | null;
  title?: string;
}

export function ImportModalResult({
  open,
  onOpenChange,
  result,
  title = "Import Result",
}: Readonly<ImportModalResultProps>) {
  const hasFailed =
    result?.status === "ERROR" ||
    (result?.summary?.invalidRows ?? 0) > 0 ||
    Boolean(result?.rowErrors && result.rowErrors.length > 0);

  const handleDownloadErrorReport = () => {
    const report = result?.errorReport;
    if (!report?.base64Content) return;
    const fileName = report.fileName || "chart_of_account_import_errors.xlsx";
    const contentType =
      report.contentType ||
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    downloadBase64File(report.base64Content, fileName, contentType);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      size="default"
      footer={
        <div className="flex w-full items-center justify-between pt-2">
          <div>
            {result?.errorReport?.base64Content ? (
              <Button
                type="button"
                variant="ghost"
                onClick={handleDownloadErrorReport}
                className="text-primary hover:text-primary hover:bg-primary/10 -ml-2"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Error Report
              </Button>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 px-1 py-2 overflow-auto">
        <div className="border border-dashed rounded-lg p-6 w-full flex flex-col items-center justify-center gap-3 bg-muted/10">
          <div className="p-4 bg-primary/10 rounded-full text-primary">
            {hasFailed ? (
              <AlertCircle className="h-6 w-6" />
            ) : (
              <CheckCircle2 className="h-6 w-6" />
            )}
          </div>
          <div className="mt-1 flex flex-col items-center text-center">
            <p className="text-sm font-semibold text-foreground">
              {hasFailed
                ? "Import Completed with Errors"
                : "Import Completed Successfully"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {result?.message ||
                (hasFailed
                  ? "Some records could not be imported."
                  : "All records have been successfully imported.")}
            </p>
          </div>

          {/* Summary statistics */}
          <div className="grid grid-cols-3 gap-2 w-full pt-4 mt-1 border-t border-border">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-xs text-muted-foreground">Total Rows</span>
              <span className="text-base font-semibold text-foreground">
                {result?.summary?.totalRows ?? 0}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-xs text-muted-foreground">Success</span>
              <span className="text-base font-semibold text-foreground">
                {result?.summary?.validRows ?? 0}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-xs text-muted-foreground">Failed</span>
              <span className="text-base font-semibold text-foreground">
                {result?.summary?.invalidRows ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Error list if any */}
        {result?.rowErrors && result.rowErrors.length > 0 && (
          <div className="w-full flex flex-col gap-1.5 text-left">
            <span className="text-xs font-semibold text-muted-foreground">
              Error Details ({result.rowErrors.length}{" "}
              {result.rowErrors.length === 1 ? "row" : "rows"}):
            </span>
            <div className="max-h-36 overflow-y-auto rounded-md border border-border bg-muted/10 p-2.5 text-xs flex flex-col gap-1.5 divide-y divide-border/40">
              {result.rowErrors.map((err, idx) => (
                <div
                  key={`${err.rowNumber}-${idx}`}
                  className="pt-1.5 first:pt-0 flex items-start gap-1.5"
                >
                  <span className="font-semibold text-foreground whitespace-nowrap">
                    Row {err.rowNumber}:
                  </span>
                  <span className="text-muted-foreground">{err.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default ImportModalResult;

