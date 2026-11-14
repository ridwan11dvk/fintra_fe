import { z } from "zod";

/**
 * Close Payment Edit Schema - For editing only specific fields when payment_status = 0
 * Based on PRD section 5.3: Only these fields are editable
 */
export const closePaymentEditSchema = z.object({
  transferReceiptPath: z.string().optional(),
  transferReceiptFile: z.instanceof(File).optional(), // For file upload handling
  transId: z.string().min(1, "Transaction ID is required").max(100),
  paymentDate: z.string().min(1, "Payment date is required"),
  bankCode: z.string().min(1, "Bank code is required").max(50),
  invoiceNumber: z.string().min(1, "Invoice number is required").max(100),
  ppfNumber: z.string().min(1, "PPF number is required").max(100),
  bankRuleId: z.number().int("Bank rule ID must be an integer"),
});

export type ClosePaymentEditFormData = z.output<typeof closePaymentEditSchema>;
