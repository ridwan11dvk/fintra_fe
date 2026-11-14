export type CashflowCategoryStatus = "ACTIVE" | "INACTIVE";

export interface CashflowCategoryResponse {
  id: number;
  code: string;
  name: string;
  description: string;
  status: CashflowCategoryStatus;
}

export interface CashflowCategoryRequest {
  code: string;
  name: string;
  description: string;
}
