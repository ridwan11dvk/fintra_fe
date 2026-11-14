/**
 * Posting Asset Feature Types
 * Aligns with API contract: docs/contract/Monitoring/PostingAsset_API_Contract.md
 */

import type { DebitCreditFlag, PostingStatus, ReversalFlag, SapStatus } from "@railfinance/core/types";

// ============================================================================
// GROUP (LIST) TYPE
// ============================================================================

export interface PostingAssetGroup {
  sapStatus: SapStatus | null;
  postingStatus: PostingStatus;
  reversalFlag: ReversalFlag;
  documentDate: string;
  documentNumber: string;
  reference: string | null;
  assignment: string | null;
  sapDocumentNumber: string | null;
  fiscalYear: number | null;
  virtualAccount: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// DETAIL DTO TYPE
// ============================================================================

export interface PostingAsset {
  id: number;
  fileName: string | null;
  recordNumber: string | null;
  transactionCode: string;
  withholdingTax: string | null;
  reversalFlag: ReversalFlag;
  documentType: string;
  postingDate: string;
  documentDate: string;
  documentNumber: string;
  reference: string | null;
  debitCreditFlag: DebitCreditFlag;
  accountNumber: string;
  alternativeAccount: string | null;
  amount: number | null;
  businessArea: string;
  segment: string;
  fixedAssetNumber: string;
  costCenter: string;
  profitCenter: string;
  internalOrderFlag: string | null;
  assignment: string | null;
  vendor: string | null;
  customer: string | null;
  postingStatus: PostingStatus | null;
  postingTimestamp: string | null;
  sapStatus: SapStatus | null;
  sapDocumentNumber: string | null;
  fiscalYear: number | null;
  virtualAccount: string | null;
  recordIndex: number | null;
  totalIndex: number | null;
  assetAccountFlag: string | null;
  wwrvc: string | null;
  kndnr: string | null;
  wwprd: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

// ============================================================================
// FORM REQUEST TYPE
// ============================================================================

export interface PostingAssetRequest {
  fileName?: string;
  recordNumber?: string;
  transactionCode: string;
  withholdingTax?: string;
  reversalFlag: ReversalFlag;
  documentType: string;
  postingDate?: string;
  documentDate: string;
  documentNumber: string;
  reference?: string;
  debitCreditFlag: DebitCreditFlag;
  accountNumber: string;
  alternativeAccount?: string;
  amount?: number;
  businessArea?: string;
  segment?: string;
  fixedAssetNumber?: string;
  costCenter?: string;
  profitCenter?: string;
  assignment?: string;
  vendor?: string;
  customer?: string;
  fiscalYear?: number;
  sourceBusinessArea?: string;
  virtualAccount?: string;
  wwrvc?: string;
  kndnr?: string;
  wwprd?: string;
  valueDate?: string;
}

// ============================================================================
// STATUS SUMMARY TYPE
// ============================================================================

export interface PostingAssetStatusSummary {
  pendingCount: number;
  postedCount: number;
  errorCount: number;
  sapSuccessCount: number;
  sapErrorCount: number;
  sapCancelCount: number;
}
