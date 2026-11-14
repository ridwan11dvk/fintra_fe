export type KbliStatus = "ACTIVE" | "INACTIVE";

export interface KbliRecord {
  id: string;
  code: string;
  businessFieldName: string;
  category: string;
  status: KbliStatus;
}

export type KbliInput = Omit<KbliRecord, "id">;

export interface KbliListParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface KbliListResult {
  items: KbliRecord[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
