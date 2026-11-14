export type ProcurementType = "DRAFT" | "ACTIVE" | "SUBMITTED" | "APPROVED" | "REJECTED";

export interface ExportProcurementParams {
  search?: string;
  status?: ProcurementType;
}