/**
 * Deposit Response - Full deposit object with metadata
 */
export interface DepositResponse {
  id: number;
  agentCode?: string;
  virtualAccount?: string;
  name?: string;
  referenceNumber?: string;
  depositDate?: string;
  openingBalance?: number;
  amount?: number;
  closingBalance?: number;
  bankCode?: string;
  documentPath?: string;
  sendStatus: 0 | 1; // 0 = NOT_SENT, 1 = SENT
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

/**
 * Deposit Edit Request - Payload for edit operations
 * As per PRD section 5.3, all fields are editable
 */
export interface DepositEditRequest {
  agentCode?: string;
  virtualAccount?: string;
  name?: string;
  referenceNumber?: string;
  depositDate?: string; // ISO datetime format
  openingBalance?: number;
  amount?: number;
  closingBalance?: number;
  bankCode?: string;
  documentPath?: string;
  documentFile?: File; // For file upload handling
}

/**
 * Send Status Update Request
 */
export interface SendStatusUpdateRequest {
  sendStatus: 0 | 1;
}

/**
 * Deposit Summary Data
 */
export interface DepositSummary {
  totalDeposits: number;
  totalNotSent: number;
  totalSent: number;
  totalAmount: number;
}

/**
 * Count by Send Status
 */
export interface CountByStatusResponse {
  notSent: number;
  sent: number;
}

/**
 * Enumerations and constants
 */
export const SEND_STATUS = {
  NOT_SENT: 0 as const,
  SENT: 1 as const,
} as const;

export const SEND_STATUS_LABELS: Record<0 | 1, string> = {
  0: "Not Sent",
  1: "Sent",
} as const;

export const SEND_STATUS_COLORS: Record<0 | 1, string> = {
  0: "bg-yellow-100 text-yellow-800",
  1: "bg-green-100 text-green-800",
} as const;
