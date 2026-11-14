import { describe, expect, it } from "vitest";
import { costCenterSchema } from "@/features/master-data/cost-center/data/cost-center.schema";

describe("costCenterSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "I000",
        businessAreaCode: "BA001",
        costCenterCode: "CC-001",
        costCenterName: "Jakarta Head Office Cost Center",
        description: "Head office operations",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(true);
    });

    it("accepts endDate as null", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "I000",
        businessAreaCode: "BA001",
        costCenterCode: "CC-001",
        costCenterName: "Test Cost Center",
        startDate: "2024-01-01",
        endDate: null,
      });

      expect(result.success).toBe(true);
    });

    it("accepts endDate as a valid date string", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "I000",
        businessAreaCode: "BA001",
        costCenterCode: "CC-001",
        costCenterName: "Test Cost Center",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      });

      expect(result.success).toBe(true);
    });

    it("accepts businessAreaCode when omitted", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "I000",
        costCenterCode: "CC-001",
        costCenterName: "Test Cost Center",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("companyCode validation", () => {
    it("rejects empty companyCode", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "",
        businessAreaCode: "BA001",
        costCenterCode: "CC-001",
        costCenterName: "Test",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find(
          (i) => i.path[0] === "companyCode",
        );
        expect(err?.message).toBe("Company code is required");
      }
    });

    it("rejects companyCode exceeding 5 characters", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "A".repeat(6),
        businessAreaCode: "BA001",
        costCenterCode: "CC-001",
        costCenterName: "Test",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(false);
    });

    it("accepts companyCode at exactly 5 characters", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "A".repeat(5),
        businessAreaCode: "BA001",
        costCenterCode: "CC-001",
        costCenterName: "Test",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("businessAreaCode validation", () => {
    it("accepts businessAreaCode when omitted", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "I000",
        costCenterCode: "CC-001",
        costCenterName: "Test",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(true);
    });

    it("rejects businessAreaCode exceeding 5 characters", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "I000",
        businessAreaCode: "B".repeat(6),
        costCenterCode: "CC-001",
        costCenterName: "Test",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(false);
    });

    it("accepts businessAreaCode at exactly 5 characters", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "I000",
        businessAreaCode: "B".repeat(5),
        costCenterCode: "CC-001",
        costCenterName: "Test",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("costCenterCode validation", () => {
    it("rejects empty costCenterCode", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "I000",
        businessAreaCode: "BA001",
        costCenterCode: "",
        costCenterName: "Test",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find(
          (i) => i.path[0] === "costCenterCode",
        );
        expect(err?.message).toBe("Cost center code is required");
      }
    });

    it("rejects costCenterCode exceeding 20 characters", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "I000",
        businessAreaCode: "BA001",
        costCenterCode: "C".repeat(21),
        costCenterName: "Test",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(false);
    });

    it("accepts costCenterCode at exactly 20 characters", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "I000",
        businessAreaCode: "BA001",
        costCenterCode: "C".repeat(20),
        costCenterName: "Test",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("costCenterName validation", () => {
    it("rejects empty costCenterName", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "I000",
        businessAreaCode: "BA001",
        costCenterCode: "CC-001",
        costCenterName: "",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find(
          (i) => i.path[0] === "costCenterName",
        );
        expect(err?.message).toBe("Cost center name is required");
      }
    });

    it("rejects costCenterName exceeding 150 characters", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "I000",
        businessAreaCode: "BA001",
        costCenterCode: "CC-001",
        costCenterName: "A".repeat(151),
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(false);
    });

    it("accepts costCenterName at exactly 150 characters", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "I000",
        businessAreaCode: "BA001",
        costCenterCode: "CC-001",
        costCenterName: "A".repeat(150),
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("description validation", () => {
    it("accepts description when omitted", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "I000",
        businessAreaCode: "BA001",
        costCenterCode: "CC-001",
        costCenterName: "Test",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(true);
    });

    it("rejects description exceeding 255 characters", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "I000",
        businessAreaCode: "BA001",
        costCenterCode: "CC-001",
        costCenterName: "Test",
        description: "A".repeat(256),
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(false);
    });

    it("accepts description at exactly 255 characters", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "I000",
        businessAreaCode: "BA001",
        costCenterCode: "CC-001",
        costCenterName: "Test",
        description: "A".repeat(255),
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("startDate validation", () => {
    it("rejects empty startDate", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "I000",
        businessAreaCode: "BA001",
        costCenterCode: "CC-001",
        costCenterName: "Test",
        startDate: "",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find(
          (i) => i.path[0] === "startDate",
        );
        expect(err?.message).toBe("Start date is required");
      }
    });

    it("rejects startDate when not provided", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "I000",
        businessAreaCode: "BA001",
        costCenterCode: "CC-001",
        costCenterName: "Test",
      });

      expect(result.success).toBe(false);
    });

    it("accepts a valid startDate", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "I000",
        businessAreaCode: "BA001",
        costCenterCode: "CC-001",
        costCenterName: "Test",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("endDate validation", () => {
    it("accepts endDate as null", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "I000",
        businessAreaCode: "BA001",
        costCenterCode: "CC-001",
        costCenterName: "Test",
        startDate: "2024-01-01",
        endDate: null,
      });

      expect(result.success).toBe(true);
    });

    it("accepts endDate as a valid string", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "I000",
        businessAreaCode: "BA001",
        costCenterCode: "CC-001",
        costCenterName: "Test",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      });

      expect(result.success).toBe(true);
    });

    it("accepts endDate when omitted", () => {
      const result = costCenterSchema.safeParse({
        companyCode: "I000",
        businessAreaCode: "BA001",
        costCenterCode: "CC-001",
        costCenterName: "Test",
        startDate: "2024-01-01",
      });

      expect(result.success).toBe(true);
    });
  });
});
