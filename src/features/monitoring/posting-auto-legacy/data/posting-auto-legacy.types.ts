/**
 * Posting Auto Legacy Feature Types
 * Aligns with API contract: docs/contract/Monitoring/Monitoring Legacy Integration API Contract.md
 */

// ============================================================================
// LIST ITEM DTO
// ============================================================================

export interface PostingAutoLegacyGroup {
  REVERSAL: string;
  DOC_DATE: string;
  NO_DOK: string;
  ASSIGNMENT: string | null;
  REFERENCE: string | null;
  NO_DOKSAP: string | null;
  POSTING_DATE: string;
  Fiscal_year: number | null;
  virtual_acc: string | null;
  pos_status: number | null;
  pos_tgl: string | null;
  entry_date: string | null;
  status0: string | null;
}

// ============================================================================
// DETAIL DTO (extends invoice detail with id, XREF1, XREF2, BA_ASAL)
// ============================================================================

export interface PostingAutoLegacyDetail {
  id: number;
  FILE_NAME: string | null;
  REVERSAL: string;
  RECORD_NUMBER: number | null;
  TCODE: string;
  PPH: string | null;
  DOC_TYPE: string;
  DOC_DATE: string;
  NO_DOK: string;
  ASSIGNMENT: string | null;
  REFERENCE: string | null;
  NO_DOKSAP: string | null;
  POSTING_DATE: string;
  VALUE_DATE: string | null;
  Fiscal_year: number | null;
  virtual_acc: string | null;
  pos_status: number | null;
  pos_tgl: string | null;
  entry_date: string | null;
  status0: string | null;
  indeks: number | null;
  totalidx: number | null;
  GL_ACCOUNT: string | null;
  ACCOUNT: string;
  AMOUNT: string;
  DEBIT_KREDIT: string;
  BA: string;
  INTERNAL_ORDER: string | null;
  VENDOR: string | null;
  CUSTOMER: string | null;
  SEGMEN: string | null;
  FA: string | null;
  CC: string | null;
  PC: string | null;
  sts_acountfa: string | null;
  ALTERNATIVE_ACC: string | null;
  XREF1: string | null;
  XREF2: string | null;
  BA_ASAL: string | null;
  status1: string | null;
  status2: string | null;
  status3: string | null;
  status4: string | null;
  status5: string | null;
  status6: string | null;
  status7: string | null;
  status8: string | null;
  status9: string | null;
  status10: string | null;
  WWRVC: string | null;
  KNDNR: string | null;
  WWPRD: string | null;
}

// ============================================================================
// REQUEST DTO (extends invoice request with XREF1, XREF2, BA_ASAL)
// ============================================================================

export interface PostingAutoLegacyRequest {
  RECORD_NUMBER: number;
  TCODE: string;
  REVERSAL: string;
  DOC_TYPE: string;
  NO_DOK: string;
  REFERENCE?: string;
  DEBIT_KREDIT: string;
  ACCOUNT: string;
  AMOUNT: string;
  BA: string;
  Fiscal_year: number;
  virtual_acc: string;
  FILE_NAME?: string;
  PPH?: string;
  POSTING_DATE?: string;
  DOC_DATE?: string;
  VALUE_DATE?: string;
  ALTERNATIVE_ACC?: string;
  SEGMEN?: string;
  FA?: string;
  CC?: string;
  PC?: string;
  INTERNAL_ORDER?: string;
  ASSIGNMENT?: string;
  VENDOR?: string;
  CUSTOMER?: string;
  XREF1?: string;
  XREF2?: string;
  BA_ASAL?: string;
  WWRVC?: string;
  KNDNR?: string;
  WWPRD?: string;
  pos_status?: number;
  status0?: string;
  NO_DOKSAP?: string;
}

// ============================================================================
// GENERATE REQUEST
// ============================================================================

export interface PostingGenerateAutoRequest {
  invoice: string;
}

// ============================================================================
// BATCH TYPES
// ============================================================================

export interface BatchPostingItem {
  reversal: string;
  noDok: string;
  reference: string;
}

export interface BatchPostingRequest {
  postings: BatchPostingItem[];
}

export interface SendToSapResponse {
  sap_doc_number: string;
}

export interface BatchSendToSapItem {
  no_dok: string | null;
  message: string;
  sap_doc_number: string;
  invoice: string | null;
}

export interface BatchSendToSapFailedItem {
  no_dok: string | null;
  invoice: string | null;
  reason: string;
}

export interface BatchSendToSapResult {
  successful: BatchSendToSapItem[];
  failed: BatchSendToSapFailedItem[];
  total_processed: number;
}

export interface BatchRegenerateItem {
  no_dok: string | null;
  invoice_id: string | null;
  message: string;
  old_entries: number | null;
  new_entries: number | null;
}

export interface BatchRegenerateResult {
  successful: BatchRegenerateItem[];
  failed: BatchSendToSapFailedItem[];
  total_processed: number;
  total_old_entries: number | null;
  total_new_entries: number | null;
}
