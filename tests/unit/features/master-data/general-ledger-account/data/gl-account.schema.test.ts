import { describe, expect, it } from "vitest";
import { glAccountSchema } from "@/features/master-data/general-ledger-account/data/gl-account.schema";

describe("glAccountSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        baCode: "BA001",
        account: "61101",
        name: "Kas di Loket",
        description: "Revenue from Product Sales",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(true);
    });

    it("accepts a minimal valid object (required fields only)", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(true);
    });

    it("accepts optional description as undefined", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        startDate: "2024-01-01",
        description: undefined,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("companyCode validation", () => {
    it("rejects empty companyCode", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "",
        account: "61101",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find(
          (issue) => issue.path[0] === "companyCode",
        );
        expect(err?.message).toBe("Company code is required");
      }
    });

    it("rejects companyCode exceeding 5 characters", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "A".repeat(6),
        account: "61101",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(false);
    });

    it("accepts companyCode at exactly 5 characters", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "A".repeat(5),
        account: "61101",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("baCode validation", () => {
    it("accepts baCode when omitted", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(true);
    });

    it("rejects baCode exceeding 5 characters", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        baCode: "B".repeat(6),
        account: "61101",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(false);
    });

    it("accepts baCode at exactly 5 characters", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        baCode: "B".repeat(5),
        account: "61101",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("name validation", () => {
    it("rejects name exceeding 100 characters", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        name: "A".repeat(101),
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(false);
    });

    it("accepts name at exactly 100 characters", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        name: "A".repeat(100),
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("account validation", () => {
    it("rejects empty account", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find(
          (issue) => issue.path[0] === "account",
        );
        expect(err?.message).toBe("Account code is required");
      }
    });

    it("rejects account exceeding 20 characters", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "A".repeat(21),
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(false);
    });

    it("accepts account at exactly 20 characters", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "A".repeat(20),
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("description validation", () => {
    it("accepts description as empty string", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        startDate: "2024-01-01",
        description: "",
      });

      expect(result.success).toBe(true);
    });

    it("rejects description exceeding 255 characters", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        startDate: "2024-01-01",
        description: "A".repeat(256),
      });

      expect(result.success).toBe(false);
    });

    it("accepts description at exactly 255 characters", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        startDate: "2024-01-01",
        description: "A".repeat(255),
      });

      expect(result.success).toBe(true);
    });
  });

  describe("commitmentItem validation", () => {
    it("accepts commitmentItem with valid value", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        startDate: "2024-01-01",
        commitmentItem: "CMT-001",
      });

      expect(result.success).toBe(true);
    });

    it("accepts commitmentItem as undefined", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        startDate: "2024-01-01",
        commitmentItem: undefined,
      });

      expect(result.success).toBe(true);
    });

    it("rejects commitmentItem exceeding 100 characters", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        startDate: "2024-01-01",
        commitmentItem: "A".repeat(101),
      });

      expect(result.success).toBe(false);
    });

    it("accepts commitmentItem at exactly 100 characters", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        startDate: "2024-01-01",
        commitmentItem: "A".repeat(100),
      });

      expect(result.success).toBe(true);
    });
  });

  describe("operationalCostComponent validation", () => {
    it("accepts operationalCostComponent with valid value", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        startDate: "2024-01-01",
        operationalCostComponent: "OPR-001",
      });

      expect(result.success).toBe(true);
    });

    it("accepts operationalCostComponent as undefined", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        startDate: "2024-01-01",
        operationalCostComponent: undefined,
      });

      expect(result.success).toBe(true);
    });

    it("rejects operationalCostComponent exceeding 100 characters", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        startDate: "2024-01-01",
        operationalCostComponent: "A".repeat(101),
      });

      expect(result.success).toBe(false);
    });

    it("accepts operationalCostComponent at exactly 100 characters", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        startDate: "2024-01-01",
        operationalCostComponent: "A".repeat(100),
      });

      expect(result.success).toBe(true);
    });
  });

  describe("imoCostComponent validation", () => {
    it("accepts imoCostComponent with valid value", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        startDate: "2024-01-01",
        imoCostComponent: "IMO-001",
      });

      expect(result.success).toBe(true);
    });

    it("accepts imoCostComponent as undefined", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        startDate: "2024-01-01",
        imoCostComponent: undefined,
      });

      expect(result.success).toBe(true);
    });

    it("rejects imoCostComponent exceeding 100 characters", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        startDate: "2024-01-01",
        imoCostComponent: "A".repeat(101),
      });

      expect(result.success).toBe(false);
    });

    it("accepts imoCostComponent at exactly 100 characters", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        startDate: "2024-01-01",
        imoCostComponent: "A".repeat(100),
      });

      expect(result.success).toBe(true);
    });
  });

  describe("startDate validation", () => {
    it("rejects empty startDate", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        startDate: "",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find(
          (issue) => issue.path[0] === "startDate",
        );
        expect(err?.message).toBe("Start date is required");
      }
    });

    it("rejects startDate when not provided", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
      });

      expect(result.success).toBe(false);
    });

    it("accepts a valid startDate", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("endDate validation", () => {
    it("accepts endDate as null", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        startDate: "2024-01-01",
        endDate: null,
      });

      expect(result.success).toBe(true);
    });

    it("accepts endDate as a valid string", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      });

      expect(result.success).toBe(true);
    });

    it("accepts endDate when omitted", () => {
      const result = glAccountSchema.safeParse({
        companyCode: "COMP1",
        account: "61101",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(true);
    });
  });
});
