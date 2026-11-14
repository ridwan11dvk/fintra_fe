import { describe, expect, it } from "vitest";
import { taxRateSchema } from "@/features/master-data/tax-rate/data/tax-rate.schema";

describe("taxRateSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = taxRateSchema.safeParse({
        code: "PPN_17",
        name: "PPN 17%",
        description: "Value Added Tax 17%",
        taxType: "PPN",
        ratePercent: 17,
        coefficientNumerator: 17,
        coefficientDenominator: 100,
        isUsedInRkip: true,
        startDate: "2024-01-01",
        endDate: null,
      });
      expect(result.success).toBe(true);
    });

    it("accepts minimal required fields only", () => {
      const result = taxRateSchema.safeParse({
        code: "PPN_17",
        name: "PPN 17%",
        taxType: "PPN",
        ratePercent: 17,
        coefficientNumerator: 17,
        coefficientDenominator: 100,
        startDate: "2024-01-01",
      });
      expect(result.success).toBe(true);
    });

    it("accepts description and isUsedInRkip as optional", () => {
      const result = taxRateSchema.safeParse({
        code: "PPN_17",
        name: "PPN 17%",
        taxType: "PPN",
        ratePercent: 17,
        coefficientNumerator: 17,
        coefficientDenominator: 100,
        startDate: "2024-01-01",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.description).toBeUndefined();
        expect(result.data.isUsedInRkip).toBeUndefined();
      }
    });

    it("accepts endDate as an empty string", () => {
      const result = taxRateSchema.safeParse({
        code: "PPN_17",
        name: "PPN 17%",
        taxType: "PPN",
        ratePercent: 17,
        coefficientNumerator: 17,
        coefficientDenominator: 100,
        startDate: "2024-01-01",
        endDate: "",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("code validation", () => {
    it("rejects empty code", () => {
      const result = taxRateSchema.safeParse({
        code: "",
        name: "PPN 17%",
        taxType: "PPN",
        ratePercent: 17,
        coefficientNumerator: 17,
        coefficientDenominator: 100,
        startDate: "2024-01-01",
      });
      expect(result.success).toBe(false);
    });

    it("rejects code exceeding 50 characters", () => {
      const result = taxRateSchema.safeParse({
        code: "A".repeat(51),
        name: "PPN 17%",
        taxType: "PPN",
        ratePercent: 17,
        coefficientNumerator: 17,
        coefficientDenominator: 100,
        startDate: "2024-01-01",
      });
      expect(result.success).toBe(false);
    });

    it("accepts code at exactly 50 characters", () => {
      const result = taxRateSchema.safeParse({
        code: "A".repeat(50),
        name: "PPN 17%",
        taxType: "PPN",
        ratePercent: 17,
        coefficientNumerator: 17,
        coefficientDenominator: 100,
        startDate: "2024-01-01",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("name validation", () => {
    it("rejects empty name", () => {
      const result = taxRateSchema.safeParse({
        code: "PPN_17",
        name: "",
        taxType: "PPN",
        ratePercent: 17,
        coefficientNumerator: 17,
        coefficientDenominator: 100,
        startDate: "2024-01-01",
      });
      expect(result.success).toBe(false);
    });

    it("rejects name exceeding 255 characters", () => {
      const result = taxRateSchema.safeParse({
        code: "PPN_17",
        name: "A".repeat(256),
        taxType: "PPN",
        ratePercent: 17,
        coefficientNumerator: 17,
        coefficientDenominator: 100,
        startDate: "2024-01-01",
      });
      expect(result.success).toBe(false);
    });

    it("accepts name at exactly 255 characters", () => {
      const result = taxRateSchema.safeParse({
        code: "PPN_17",
        name: "A".repeat(255),
        taxType: "PPN",
        ratePercent: 17,
        coefficientNumerator: 17,
        coefficientDenominator: 100,
        startDate: "2024-01-01",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("description validation", () => {
    it("rejects description exceeding 1000 characters", () => {
      const result = taxRateSchema.safeParse({
        code: "PPN_17",
        name: "PPN 17%",
        description: "A".repeat(1001),
        taxType: "PPN",
        ratePercent: 17,
        coefficientNumerator: 17,
        coefficientDenominator: 100,
        startDate: "2024-01-01",
      });
      expect(result.success).toBe(false);
    });

    it("accepts description at exactly 1000 characters", () => {
      const result = taxRateSchema.safeParse({
        code: "PPN_17",
        name: "PPN 17%",
        description: "A".repeat(1000),
        taxType: "PPN",
        ratePercent: 17,
        coefficientNumerator: 17,
        coefficientDenominator: 100,
        startDate: "2024-01-01",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("taxType validation", () => {
    it("rejects empty taxType", () => {
      const result = taxRateSchema.safeParse({
        code: "PPN_17",
        name: "PPN 17%",
        taxType: "",
        ratePercent: 17,
        coefficientNumerator: 17,
        coefficientDenominator: 100,
        startDate: "2024-01-01",
      });
      expect(result.success).toBe(false);
    });

    it("rejects taxType exceeding 20 characters", () => {
      const result = taxRateSchema.safeParse({
        code: "PPN_17",
        name: "PPN 17%",
        taxType: "A".repeat(21),
        ratePercent: 17,
        coefficientNumerator: 17,
        coefficientDenominator: 100,
        startDate: "2024-01-01",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("ratePercent validation", () => {
    it("rejects negative ratePercent", () => {
      const result = taxRateSchema.safeParse({
        code: "PPN_17",
        name: "PPN 17%",
        taxType: "PPN",
        ratePercent: -1,
        coefficientNumerator: 17,
        coefficientDenominator: 100,
        startDate: "2024-01-01",
      });
      expect(result.success).toBe(false);
    });

    it("rejects ratePercent exceeding 100", () => {
      const result = taxRateSchema.safeParse({
        code: "PPN_17",
        name: "PPN 17%",
        taxType: "PPN",
        ratePercent: 101,
        coefficientNumerator: 17,
        coefficientDenominator: 100,
        startDate: "2024-01-01",
      });
      expect(result.success).toBe(false);
    });

    it("accepts ratePercent at 0", () => {
      const result = taxRateSchema.safeParse({
        code: "PPN_17",
        name: "PPN 17%",
        taxType: "PPN",
        ratePercent: 0,
        coefficientNumerator: 17,
        coefficientDenominator: 100,
        startDate: "2024-01-01",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("coefficientNumerator validation", () => {
    it("rejects coefficientNumerator less than 0.01", () => {
      const result = taxRateSchema.safeParse({
        code: "PPN_17",
        name: "PPN 17%",
        taxType: "PPN",
        ratePercent: 17,
        coefficientNumerator: 0,
        coefficientDenominator: 100,
        startDate: "2024-01-01",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("coefficientDenominator validation", () => {
    it("rejects coefficientDenominator of zero", () => {
      const result = taxRateSchema.safeParse({
        code: "PPN_17",
        name: "PPN 17%",
        taxType: "PPN",
        ratePercent: 17,
        coefficientNumerator: 17,
        coefficientDenominator: 0,
        startDate: "2024-01-01",
      });
      expect(result.success).toBe(false);
    });

    it("rejects coefficientDenominator less than 0.01", () => {
      const result = taxRateSchema.safeParse({
        code: "PPN_17",
        name: "PPN 17%",
        taxType: "PPN",
        ratePercent: 17,
        coefficientNumerator: 17,
        coefficientDenominator: -1,
        startDate: "2024-01-01",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("isUsedInRkip validation", () => {
    it("accepts isUsedInRkip true and false", () => {
      const base = {
        code: "PPN_17",
        name: "PPN 17%",
        taxType: "PPN",
        ratePercent: 17,
        coefficientNumerator: 17,
        coefficientDenominator: 100,
        startDate: "2024-01-01",
      };

      expect(taxRateSchema.safeParse({ ...base, isUsedInRkip: true }).success).toBe(
        true,
      );
      expect(taxRateSchema.safeParse({ ...base, isUsedInRkip: false }).success).toBe(
        true,
      );
    });

    it("rejects non-boolean isUsedInRkip", () => {
      const result = taxRateSchema.safeParse({
        code: "PPN_17",
        name: "PPN 17%",
        taxType: "PPN",
        ratePercent: 17,
        coefficientNumerator: 17,
        coefficientDenominator: 100,
        isUsedInRkip: "yes",
        startDate: "2024-01-01",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("startDate validation", () => {
    it("rejects empty startDate", () => {
      const result = taxRateSchema.safeParse({
        code: "PPN_17",
        name: "PPN 17%",
        taxType: "PPN",
        ratePercent: 17,
        coefficientNumerator: 17,
        coefficientDenominator: 100,
        startDate: "",
      });
      expect(result.success).toBe(false);
    });
  });
});
