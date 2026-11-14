export type CashflowGroupStatus = "ACTIVE" | "INACTIVE";

export type CashflowType = "RECIPIENT" | "PROVIDER";

export interface CashflowGroupResponse {
  id: number;
  code: string;
  name: string;
  cashflowGroupId: string;
  cashflowGroupName: string;
  cashflowType: CashflowType;
  exception: string;
  description: string;
  status: CashflowGroupStatus;
  canDelete: boolean;
}

export interface CashflowGroupRequest {
  code: string;
  name: string;
  cashflowGroupId: string;
  cashflowGroupName?: string;
  cashflowType: CashflowType;
  exception: string;
  description: string;
}
