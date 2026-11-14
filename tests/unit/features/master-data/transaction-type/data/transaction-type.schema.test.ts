import { describe, expect, it } from "vitest";
import { transactionTypeSchema } from "@/features/master-data/transaction-type/data/transaction-type.schema";

describe("transactionTypeSchema", () => {
  const validPayload = {
    companyCode: "COMP",
    code: "SI",
    name: "Sales Invoice",
    isActive: true,
  };

  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = transactionTypeSchema.safeParse({
        ...validPayload,
        tcode: "FB70",
        description: "Sales Invoice document",
        moduleId: 1,
        docType: "F5",
        docBase: "DOCBASE",
        formType: "FORM-A",
        type: "revenue",
        customerCode: "CUST001",
        taxableItemCode: "TAX001",
        invoiceCode: "INV-001",
        isVatUsed: true,
        hasVirtualPenalty: false,
        isRevenueRecorded: true,
        isAutoBilling: false,
        glRevenue: "410000",
        glPrepaid: "420000",
        glFreight: "430000",
        wwprd: "WWPRD001",
        wwrvc: "WWRVC001",
        vaSource: "VA001",
      });

      expect(result.success).toBe(true);
    });

    it("accepts a minimal valid object (required fields only)", () => {
      const result = transactionTypeSchema.safeParse(validPayload);

      expect(result.success).toBe(true);
    });

    it("accepts empty string for optional fields", () => {
      const result = transactionTypeSchema.safeParse({
        ...validPayload,
        tcode: "",
        description: "",
        docType: "",
        docBase: "",
        formType: "",
        type: "",
        customerCode: "",
        taxableItemCode: "",
        invoiceCode: "",
        glRevenue: "",
        glPrepaid: "",
        glFreight: "",
        wwprd: "",
        wwrvc: "",
        vaSource: "",
      });

      expect(result.success).toBe(true);
    });

    it("accepts isActive as false", () => {
      const result = transactionTypeSchema.safeParse({
        ...validPayload,
        isActive: false,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(false);
      }
    });

    it("accepts type enum values", () => {
      const types = ["revenue", "prepaid", "freight", ""] as const;
      for (const t of types) {
        const result = transactionTypeSchema.safeParse({
          ...validPayload,
          type: t,
        });
        expect(result.success).toBe(true);
      }
    });

    it("accepts boolean flags as undefined", () => {
      const result = transactionTypeSchema.safeParse(validPayload);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isVatUsed).toBeUndefined();
        expect(result.data.hasVirtualPenalty).toBeUndefined();
        expect(result.data.isRevenueRecorded).toBeUndefined();
        expect(result.data.isAutoBilling).toBeUndefined();
      }
    });

    it("accepts moduleId as undefined", () => {
      const result = transactionTypeSchema.safeParse(validPayload);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.moduleId).toBeUndefined();
      }
    });
  });

  describe("companyCode validation", () => {
    it("rejects empty companyCode", () => {
      const result = transactionTypeSchema.safeParse({
        ...validPayload,
        companyCode: "",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path[0] === "companyCode");
        expect(issue?.message).toBe("Company code is required");
      }
    });

    it("rejects companyCode exceeding 100 characters", () => {
      const result = transactionTypeSchema.safeParse({
        ...validPayload,
        companyCode: "A".repeat(101),
      });

      expect(result.success).toBe(false);
    });

    it("accepts companyCode at exactly 100 characters", () => {
      const result = transactionTypeSchema.safeParse({
        ...validPayload,
        companyCode: "A".repeat(100),
      });

      expect(result.success).toBe(true);
    });
  });

  describe("code validation", () => {
    it("rejects empty code", () => {
      const result = transactionTypeSchema.safeParse({
        ...validPayload,
        code: "",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path[0] === "code");
        expect(issue?.message).toBe("Transaction type code is required");
      }
    });

    it("rejects code exceeding 50 characters", () => {
      const result = transactionTypeSchema.safeParse({
        ...validPayload,
        code: "A".repeat(51),
      });

      expect(result.success).toBe(false);
    });

    it("accepts code at exactly 50 characters", () => {
      const result = transactionTypeSchema.safeParse({
        ...validPayload,
        code: "A".repeat(50),
      });

      expect(result.success).toBe(true);
    });
  });

  describe("name validation", () => {
    it("rejects empty name", () => {
      const result = transactionTypeSchema.safeParse({
        ...validPayload,
        name: "",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path[0] === "name");
        expect(issue?.message).toBe("Transaction type name is required");
      }
    });

    it("rejects name exceeding 255 characters", () => {
      const result = transactionTypeSchema.safeParse({
        ...validPayload,
        name: "A".repeat(256),
      });

      expect(result.success).toBe(false);
    });

    it("accepts name at exactly 255 characters", () => {
      const result = transactionTypeSchema.safeParse({
        ...validPayload,
        name: "A".repeat(255),
      });

      expect(result.success).toBe(true);
    });
  });

  describe("description validation", () => {
    it("rejects description exceeding 65535 characters", () => {
      const result = transactionTypeSchema.safeParse({
        ...validPayload,
        description: "A".repeat(65536),
      });

      expect(result.success).toBe(false);
    });

    it("accepts description at exactly 65535 characters", () => {
      const result = transactionTypeSchema.safeParse({
        ...validPayload,
        description: "A".repeat(65535),
      });

      expect(result.success).toBe(true);
    });
  });

  describe("tcode validation", () => {
    it("rejects tcode exceeding 50 characters", () => {
      const result = transactionTypeSchema.safeParse({
        ...validPayload,
        tcode: "A".repeat(51),
      });

      expect(result.success).toBe(false);
    });

    it("accepts tcode at exactly 50 characters", () => {
      const result = transactionTypeSchema.safeParse({
        ...validPayload,
        tcode: "A".repeat(50),
      });

      expect(result.success).toBe(true);
    });
  });

  describe("docType validation", () => {
    it("rejects docType exceeding 50 characters", () => {
      const result = transactionTypeSchema.safeParse({
        ...validPayload,
        docType: "A".repeat(51),
      });

      expect(result.success).toBe(false);
    });
  });

  describe("formType validation", () => {
    it("rejects formType exceeding 255 characters", () => {
      const result = transactionTypeSchema.safeParse({
        ...validPayload,
        formType: "A".repeat(256),
      });

      expect(result.success).toBe(false);
    });
  });

  describe("type validation", () => {
    it("rejects invalid type value", () => {
      const result = transactionTypeSchema.safeParse({
        ...validPayload,
        type: "invalid-type",
      });

      expect(result.success).toBe(false);
    });
  });
});
