export type ProfitCenterStatus = "ACTIVE" | "INACTIVE";

export interface ProfitCenterRecord {
  /** Numeric Payable record ID; absent for local fixtures. */
  backendId?: number;
  profitCenterId: string;
  profitCenterName: string;
  parentProfitCenterId: string;
  segmentId: string;
  segmentName?: string;
  businessUnitId: string;
  responsiblePerson: string;
  status: ProfitCenterStatus;
}

export type ProfitCenterInput = Omit<ProfitCenterRecord, "segmentName">;

export interface ProfitCenterListParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ProfitCenterListResult {
  items: ProfitCenterRecord[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
