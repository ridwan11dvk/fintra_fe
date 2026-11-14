import { describe, expect, it } from "vitest";
import { companyTaxSchema } from "@/features/master-data/company-tax/data/company-tax.schema";

describe("companyTaxSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = companyTaxSchema.safeParse({
        companyCode: "PT. ABC",
        taxRateId: 1,
        glAccount: "2103",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      });

      expect(result.success).toBe(true);
    });

    it("accepts a minimal valid object (required fields only)", () => {
      const result = companyTaxSchema.safeParse({
        companyCode: "PT. ABC",
        taxRateId: 1,
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(true);
    });

    it("accepts optional fields as undefined", () => {
      const result = companyTaxSchema.safeParse({
        companyCode: "PT. ABC",
        taxRateId: 1,
        startDate: "2024-01-01",
        glAccount: undefined,
        endDate: undefined,
      });

      expect(result.success).toBe(true);
    });

    it("accepts empty string for glAccount", () => {
      const result = companyTaxSchema.safeParse({
        companyCode: "PT. ABC",
        taxRateId: 1,
        startDate: "2024-01-01",
        glAccount: "",
        endDate: "",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("companyCode validation", () => {
    it("rejects empty companyCode", () => {
      const result = companyTaxSchema.safeParse({
        companyCode: "",
        taxRateId: 1,
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

    it("rejects companyCode exceeding 50 characters", () => {
      const result = companyTaxSchema.safeParse({
        companyCode: "A".repeat(51),
        taxRateId: 1,
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(false);
    });

    it("accepts companyCode at exactly 50 characters", () => {
      const result = companyTaxSchema.safeParse({
        companyCode: "A".repeat(50),
        taxRateId: 1,
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("taxRateId validation", () => {
    it("rejects undefined taxRateId", () => {
      const result = companyTaxSchema.safeParse({
        companyCode: "PT. ABC",
        taxRateId: undefined,
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find(
          (issue) => issue.path[0] === "taxRateId",
        );
        expect(err?.message).toBe("Tax rate is required");
      }
    });

    it("rejects zero taxRateId", () => {
      const result = companyTaxSchema.safeParse({
        companyCode: "PT. ABC",
        taxRateId: 0,
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(false);
    });

    it("rejects negative taxRateId", () => {
      const result = companyTaxSchema.safeParse({
        companyCode: "PT. ABC",
        taxRateId: -1,
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("glAccount validation", () => {
    it("rejects glAccount exceeding 50 characters", () => {
      const result = companyTaxSchema.safeParse({
        companyCode: "PT. ABC",
        taxRateId: 1,
        startDate: "2024-01-01",
        glAccount: "A".repeat(51),
      });

      expect(result.success).toBe(false);
    });

    it("accepts glAccount at exactly 50 characters", () => {
      const result = companyTaxSchema.safeParse({
        companyCode: "PT. ABC",
        taxRateId: 1,
        startDate: "2024-01-01",
        glAccount: "A".repeat(50),
      });

      expect(result.success).toBe(true);
    });
  });

  describe("startDate validation", () => {
    it("rejects empty startDate", () => {
      const result = companyTaxSchema.safeParse({
        companyCode: "PT. ABC",
        taxRateId: 1,
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
  });
});
