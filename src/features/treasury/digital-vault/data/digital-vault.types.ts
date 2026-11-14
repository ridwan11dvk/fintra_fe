/**
 * Digital Vault Feature Types
 * Aligns with API contract: docs/contract/Treasury/DigitalVault_API_Contract.md
 */

// ============================================================================
// SHARED UNION TYPES
// ============================================================================

export type VaultBillingType =
  | "DEPOSIT"
  | "CREDIT"
  | "COMPLETE"
  | "INQUIRY"
  | "-";

export type VaultPaymentStatus = 0 | 1;

export type VaultPostingA8Status = 1 | 2 | 5 | null;

export type VaultDepositType = 1 | 2 | 3;

// ============================================================================
// STATION SUMMARY LIST
// ============================================================================

export interface VaultStationSummary {
  stationName: string;
  companyCode: string;
  closureCount: number;
  totalClosureAmount: number;
  totalDepositAmount: number;
  totalCreditAmount: number;
  totalCompleteAmount: number;
}

export interface VaultStationSummaryTotal {
  totalAllClosureAmount: number;
  totalAllDepositAmount: number;
  totalAllCreditAmount: number;
  totalAllCompleteAmount: number;
}

// ============================================================================
// CLOSURE DETAIL
// ============================================================================

export interface VaultStationClosureDetail {
  id: number;
  virtualAccountNumber: string;
  stationName: string;
  companyCode: string;
  closureNumber: string;
  closureDate: string; // YYYY-MM-DD
  depositDate: string | null; // ISO 8601 datetime
  closureAmount: number;
  totalDepositAmount: number;
  bankCode: string;
  billingType: VaultBillingType;
  paymentStatus: VaultPaymentStatus; // 0=OPEN, 1=COMPLETE
  postingA8Status: VaultPostingA8Status; // 1=INPROGRESS, 2=SUCCESS, 5=FAILED, null=NOT POSTED
}

// ============================================================================
// TRANSACTION DETAIL
// ============================================================================

export interface VaultTransactionItem {
  id: number;
  depositDate: string; // ISO 8601 datetime
  depositAmount: number;
  billingType: Exclude<VaultBillingType, "-">;
  transactionId: string;
  machineCode: string;
  machineName: string;
}

export interface VaultTransactionDetail {
  id: number;
  virtualAccountNumber: string;
  stationName: string;
  companyCode: string;
  closureNumber: string;
  closureDate: string; // YYYY-MM-DD
  closureAmount: number;
  depositType: VaultDepositType; // 1=Digital Vault, 2=Teller, 3=BRILink
  latestBillingType: VaultBillingType;
  latestDepositDate: string | null; // ISO 8601 datetime
  totalDepositAmount: number; // sum of CREDIT items only
  bankCode: string;
  paymentStatus: VaultPaymentStatus;
  postingA8Status: VaultPostingA8Status;
  depositDetails: VaultTransactionItem[]; // sorted by creation time DESC
}
