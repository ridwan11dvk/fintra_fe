/**
 * Close Payment Response - Full close payment object with metadata
 */
export interface ClosePaymentResponse {
  id: number;
  custId: string;
  name: string;
  transId: string;
  invoiceNumber: string;
  ppfNumber: string;
  paymentDate: string;
  invoiceDate: string;
  printDate: string;
  dueDate: string;
  amount: number;
  paymentAmount: number;
  vatAmount: number;
  whtAmount: number;
  bankCode: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  transferReceiptPath?: string;
  paymentType: string;
  bankRuleId: number;
  source: 0 | 1; // 0 = DESKTOP, 1 = COLLECTION_WEB
  paymentStatus: 0 | 1; // 0 = UNPAID, 1 = PAID
  postingA8Status: 0 | 1 | 2 | 5; // 0 = NOT_GENERATED, 1 = PARTIAL, 2 = SUCCESS, 5 = FAILED
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

/**
 * Close Payment Edit Request - Payload for edit operations (only specific fields)
 * As per PRD section 5.3, only these fields are editable when payment_status = 0
 */
export interface ClosePaymentEditRequest {
  transferReceiptPath?: string;
  transferReceiptFile?: File; // For file upload handling
  transId: string;
  paymentDate: string;
  bankCode: string;
  invoiceNumber: string;
  ppfNumber: string;
  bankRuleId: number;
}

/**
 * Enumerations and constants
 */
export const PAYMENT_STATUS = {
  UNPAID: 0 as const,
  PAID: 1 as const,
} as const;

export const POSTING_A8_STATUS = {
  NOT_GENERATED: 0 as const,
  PARTIAL: 1 as const,
  SUCCESS: 2 as const,
  FAILED: 5 as const,
} as const;

export const PAYMENT_SOURCE = {
  DESKTOP: 0 as const,
  COLLECTION_WEB: 1 as const,
} as const;

export const PAYMENT_TYPE = [
  "TRANSFER",
  "CASH",
  "CHECK",
  "GIRO",
  "DEBIT_CARD",
  "CREDIT_CARD",
  "E_WALLET",
  "OTHER",
] as const;

export const PAYMENT_STATUS_LABELS: Record<0 | 1, string> = {
  0: "Unpaid",
  1: "Paid",
} as const;

export const POSTING_A8_STATUS_LABELS: Record<0 | 1 | 2 | 5, string> = {
  0: "Not Generated",
  1: "Partial",
  2: "Success",
  5: "Failed",
} as const;

export const PAYMENT_SOURCE_LABELS: Record<0 | 1, string> = {
  0: "Desktop",
  1: "Web Portal",
} as const;
