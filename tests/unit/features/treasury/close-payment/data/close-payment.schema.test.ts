import { describe, expect, it } from "vitest";
import { closePaymentEditSchema } from "@/features/treasury/close-payment/data/close-payment.schema";

describe("closePaymentEditSchema", () => {
  const validPayload = {
    transId: "TRANS-001",
    paymentDate: "2025-01-15T10:00:00",
    bankCode: "BNI",
    invoiceNumber: "INV-001",
    ppfNumber: "PPF-001",
    bankRuleId: 1,
  };

  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = closePaymentEditSchema.safeParse({
        ...validPayload,
        transferReceiptPath: "receipts/001.pdf",
      });

      expect(result.success).toBe(true);
    });

    it("accepts a minimal valid object (required fields only)", () => {
      const result = closePaymentEditSchema.safeParse(validPayload);

      expect(result.success).toBe(true);
    });

    it("accepts optional transferReceiptPath as undefined", () => {
      const result = closePaymentEditSchema.safeParse(validPayload);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.transferReceiptPath).toBeUndefined();
      }
    });

    it("accepts optional transferReceiptFile as a File instance", () => {
      const file = new File(["dummy"], "receipt.pdf", { type: "application/pdf" });
      const result = closePaymentEditSchema.safeParse({
        ...validPayload,
        transferReceiptFile: file,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.transferReceiptFile).toBeInstanceOf(File);
      }
    });

    it("accepts optional transferReceiptFile as undefined", () => {
      const result = closePaymentEditSchema.safeParse(validPayload);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.transferReceiptFile).toBeUndefined();
      }
    });
  });

  describe("transId validation", () => {
    it("rejects empty transId", () => {
      const result = closePaymentEditSchema.safeParse({
        ...validPayload,
        transId: "",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path[0] === "transId");
        expect(issue?.message).toBe("Transaction ID is required");
      }
    });

    it("rejects transId exceeding 100 characters", () => {
      const result = closePaymentEditSchema.safeParse({
        ...validPayload,
        transId: "A".repeat(101),
      });

      expect(result.success).toBe(false);
    });

    it("accepts transId at exactly 100 characters", () => {
      const result = closePaymentEditSchema.safeParse({
        ...validPayload,
        transId: "A".repeat(100),
      });

      expect(result.success).toBe(true);
    });
  });

  describe("paymentDate validation", () => {
    it("rejects empty paymentDate", () => {
      const result = closePaymentEditSchema.safeParse({
        ...validPayload,
        paymentDate: "",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find(
          (i) => i.path[0] === "paymentDate",
        );
        expect(issue?.message).toBe("Payment date is required");
      }
    });
  });

  describe("bankCode validation", () => {
    it("rejects empty bankCode", () => {
      const result = closePaymentEditSchema.safeParse({
        ...validPayload,
        bankCode: "",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path[0] === "bankCode");
        expect(issue?.message).toBe("Bank code is required");
      }
    });

    it("rejects bankCode exceeding 50 characters", () => {
      const result = closePaymentEditSchema.safeParse({
        ...validPayload,
        bankCode: "A".repeat(51),
      });

      expect(result.success).toBe(false);
    });

    it("accepts bankCode at exactly 50 characters", () => {
      const result = closePaymentEditSchema.safeParse({
        ...validPayload,
        bankCode: "A".repeat(50),
      });

      expect(result.success).toBe(true);
    });
  });

  describe("invoiceNumber validation", () => {
    it("rejects empty invoiceNumber", () => {
      const result = closePaymentEditSchema.safeParse({
        ...validPayload,
        invoiceNumber: "",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find(
          (i) => i.path[0] === "invoiceNumber",
        );
        expect(issue?.message).toBe("Invoice number is required");
      }
    });

    it("rejects invoiceNumber exceeding 100 characters", () => {
      const result = closePaymentEditSchema.safeParse({
        ...validPayload,
        invoiceNumber: "A".repeat(101),
      });

      expect(result.success).toBe(false);
    });

    it("accepts invoiceNumber at exactly 100 characters", () => {
      const result = closePaymentEditSchema.safeParse({
        ...validPayload,
        invoiceNumber: "A".repeat(100),
      });

      expect(result.success).toBe(true);
    });
  });

  describe("ppfNumber validation", () => {
    it("rejects empty ppfNumber", () => {
      const result = closePaymentEditSchema.safeParse({
        ...validPayload,
        ppfNumber: "",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find(
          (i) => i.path[0] === "ppfNumber",
        );
        expect(issue?.message).toBe("PPF number is required");
      }
    });

    it("rejects ppfNumber exceeding 100 characters", () => {
      const result = closePaymentEditSchema.safeParse({
        ...validPayload,
        ppfNumber: "A".repeat(101),
      });

      expect(result.success).toBe(false);
    });

    it("accepts ppfNumber at exactly 100 characters", () => {
      const result = closePaymentEditSchema.safeParse({
        ...validPayload,
        ppfNumber: "A".repeat(100),
      });

      expect(result.success).toBe(true);
    });
  });

  describe("bankRuleId validation", () => {
    it("rejects non-integer bankRuleId (float)", () => {
      const result = closePaymentEditSchema.safeParse({
        ...validPayload,
        bankRuleId: 1.5,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find(
          (i) => i.path[0] === "bankRuleId",
        );
        expect(issue?.message).toBe("Bank rule ID must be an integer");
      }
    });

    it("rejects non-integer bankRuleId (string)", () => {
      const result = closePaymentEditSchema.safeParse({
        ...validPayload,
        bankRuleId: "not-a-number" as unknown as number,
      });

      expect(result.success).toBe(false);
    });

    it("accepts integer bankRuleId", () => {
      const result = closePaymentEditSchema.safeParse({
        ...validPayload,
        bankRuleId: 42,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.bankRuleId).toBe(42);
      }
    });
  });
});
