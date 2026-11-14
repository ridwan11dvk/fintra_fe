// Response type is single-sourced from @railfinance/ui
export type { TermOfPaymentResponse } from "@railfinance/core/masterdata";

/**
 * TermOfPaymentRequest - Payload for create and update operations
 */
export interface TermOfPaymentRequest {
  code: string;
  name: string;
  description?: string;
  numberOfDays: number;
  calculationType: string;
  discount?: number | null;
  discountType?: string | null;
  isActive: boolean;
}
