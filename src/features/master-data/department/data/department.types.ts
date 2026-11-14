export type DepartmentStatus = "ACTIVE" | "INACTIVE";

export interface DepartmentRecord {
  id: string;
  name: string;
  code: string;
  parentDepartmentId: string | null;
  status: DepartmentStatus;
}

export type DepartmentInput = Omit<DepartmentRecord, "id">;

export interface DepartmentListParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface DepartmentListResult {
  items: DepartmentRecord[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
