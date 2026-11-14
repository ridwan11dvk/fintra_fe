/**
 * Posting Auto Feature Types
 * Aligns with API contract: docs/contract/Monitoring/PostingAuto_API_Contract.md
 */

import type { DebitCreditFlag, PostingStatus, ReversalFlag, SapStatus } from "@railfinance/core/types";

// ============================================================================
// GROUP (LIST) TYPE
// ============================================================================

export interface PostingAutoGroup {
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

export interface PostingAuto {
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
  statusMessage1: string | null;
  statusMessage2: string | null;
  statusMessage3: string | null;
  statusMessage4: string | null;
  statusMessage5: string | null;
  statusMessage6: string | null;
  statusMessage7: string | null;
  statusMessage8: string | null;
  statusMessage9: string | null;
  statusMessage10: string | null;
  assetAccountFlag: string | null;
  recordIndex: number | null;
  totalIndex: number | null;
  virtualAccount: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

// ============================================================================
// FORM REQUEST TYPE
// ============================================================================

export interface PostingAutoRequest {
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

export interface PostingAutoStatusSummary {
  pendingCount: number;
  postedCount: number;
  errorCount: number;
  sapSuccessCount: number;
  sapErrorCount: number;
  sapCancelCount: number;
}
