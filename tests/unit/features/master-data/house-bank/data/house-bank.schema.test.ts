import { describe, expect, it } from "vitest";
import { houseBankSchema } from "@/features/master-data/house-bank/data/house-bank.schema";

describe("houseBankSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "BCA",
        companyCode: "FINTRA",
        currencyCode: "IDR",
        accountId: "HB-BCA-001",
        accountNumber: "1234567890",
        accountName: "PT Fintra - BCA Operasional",
        erpCode: "ERP-BCA1",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts a minimal valid object", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "MANDIRI",
        companyCode: "FINTRA",
        currencyCode: "IDR",
        accountId: "HB-001",
        accountNumber: "9876543210",
        accountName: "PT Fintra - Mandiri",
        isActive: false,
      });

      expect(result.success).toBe(true);
    });

    it("accepts optional erpCode as undefined", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "BCA",
        companyCode: "FINTRA",
        currencyCode: "IDR",
        accountId: "HB-BCA-001",
        accountNumber: "1234567890",
        accountName: "PT Fintra - BCA Operasional",
        erpCode: undefined,
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("bankCode validation", () => {
    it("rejects empty bankCode", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "",
        companyCode: "FINTRA",
        currencyCode: "IDR",
        accountId: "HB-001",
        accountNumber: "1234567890",
        accountName: "Test",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "bankCode");
        expect(err?.message).toBe("Bank is required");
      }
    });

    it("rejects bankCode exceeding 50 characters", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "B".repeat(51),
        companyCode: "FINTRA",
        currencyCode: "IDR",
        accountId: "HB-001",
        accountNumber: "1234567890",
        accountName: "Test",
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("accepts bankCode at exactly 50 characters", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "B".repeat(50),
        companyCode: "FINTRA",
        currencyCode: "IDR",
        accountId: "HB-001",
        accountNumber: "1234567890",
        accountName: "Test",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("companyCode validation", () => {
    it("rejects empty companyCode", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "BCA",
        companyCode: "",
        currencyCode: "IDR",
        accountId: "HB-001",
        accountNumber: "1234567890",
        accountName: "Test",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "companyCode");
        expect(err?.message).toBe("Company code is required");
      }
    });

    it("rejects companyCode exceeding 50 characters", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "BCA",
        companyCode: "C".repeat(51),
        currencyCode: "IDR",
        accountId: "HB-001",
        accountNumber: "1234567890",
        accountName: "Test",
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("accepts companyCode at exactly 50 characters", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "BCA",
        companyCode: "C".repeat(50),
        currencyCode: "IDR",
        accountId: "HB-001",
        accountNumber: "1234567890",
        accountName: "Test",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("currencyCode validation", () => {
    it("rejects empty currencyCode", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "BCA",
        companyCode: "FINTRA",
        currencyCode: "",
        accountId: "HB-001",
        accountNumber: "1234567890",
        accountName: "Test",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "currencyCode");
        expect(err?.message).toBe("Currency code is required");
      }
    });

    it("rejects currencyCode exceeding 10 characters", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "BCA",
        companyCode: "FINTRA",
        currencyCode: "TOOLONGCODE",
        accountId: "HB-001",
        accountNumber: "1234567890",
        accountName: "Test",
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("accepts currencyCode at exactly 10 characters", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "BCA",
        companyCode: "FINTRA",
        currencyCode: "CURCODE123",
        accountId: "HB-001",
        accountNumber: "1234567890",
        accountName: "Test",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("accountId validation", () => {
    it("rejects empty accountId", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "BCA",
        companyCode: "FINTRA",
        currencyCode: "IDR",
        accountId: "",
        accountNumber: "1234567890",
        accountName: "Test",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "accountId");
        expect(err?.message).toBe("Account ID is required");
      }
    });

    it("rejects accountId exceeding 100 characters", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "BCA",
        companyCode: "FINTRA",
        currencyCode: "IDR",
        accountId: "A".repeat(101),
        accountNumber: "1234567890",
        accountName: "Test",
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("accepts accountId at exactly 100 characters", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "BCA",
        companyCode: "FINTRA",
        currencyCode: "IDR",
        accountId: "A".repeat(100),
        accountNumber: "1234567890",
        accountName: "Test",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("accountNumber validation", () => {
    it("rejects empty accountNumber", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "BCA",
        companyCode: "FINTRA",
        currencyCode: "IDR",
        accountId: "HB-001",
        accountNumber: "",
        accountName: "Test",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "accountNumber");
        expect(err?.message).toBe("Account number is required");
      }
    });

    it("rejects accountNumber exceeding 50 characters", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "BCA",
        companyCode: "FINTRA",
        currencyCode: "IDR",
        accountId: "HB-001",
        accountNumber: "A".repeat(51),
        accountName: "Test",
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("accepts accountNumber at exactly 50 characters", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "BCA",
        companyCode: "FINTRA",
        currencyCode: "IDR",
        accountId: "HB-001",
        accountNumber: "A".repeat(50),
        accountName: "Test",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("accountName validation", () => {
    it("rejects empty accountName", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "BCA",
        companyCode: "FINTRA",
        currencyCode: "IDR",
        accountId: "HB-001",
        accountNumber: "1234567890",
        accountName: "",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "accountName");
        expect(err?.message).toBe("Account name is required");
      }
    });

    it("rejects accountName exceeding 100 characters", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "BCA",
        companyCode: "FINTRA",
        currencyCode: "IDR",
        accountId: "HB-001",
        accountNumber: "1234567890",
        accountName: "A".repeat(101),
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("accepts accountName at exactly 100 characters", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "BCA",
        companyCode: "FINTRA",
        currencyCode: "IDR",
        accountId: "HB-001",
        accountNumber: "1234567890",
        accountName: "A".repeat(100),
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("erpCode validation", () => {
    it("rejects erpCode exceeding 50 characters", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "BCA",
        companyCode: "FINTRA",
        currencyCode: "IDR",
        accountId: "HB-001",
        accountNumber: "1234567890",
        accountName: "Test",
        erpCode: "E".repeat(51),
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "erpCode");
        expect(err?.message).toBe("ERP code must not exceed 50 characters");
      }
    });

    it("accepts erpCode at exactly 50 characters", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "BCA",
        companyCode: "FINTRA",
        currencyCode: "IDR",
        accountId: "HB-001",
        accountNumber: "1234567890",
        accountName: "Test",
        erpCode: "E".repeat(50),
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("isActive validation", () => {
    it("accepts isActive as true", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "BCA",
        companyCode: "FINTRA",
        currencyCode: "IDR",
        accountId: "HB-001",
        accountNumber: "1234567890",
        accountName: "Test",
        isActive: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(true);
      }
    });

    it("accepts isActive as false", () => {
      const result = houseBankSchema.safeParse({
        bankCode: "BCA",
        companyCode: "FINTRA",
        currencyCode: "IDR",
        accountId: "HB-001",
        accountNumber: "1234567890",
        accountName: "Test",
        isActive: false,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(false);
      }
    });
  });
});
