import { describe, expect, it } from "vitest";
import { currencySchema } from "@/features/master-data/currency/data/currency.schema";

describe("currencySchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = currencySchema.safeParse({
        countryId: 1,
        code: "IDR",
        name: "Indonesian Rupiah",
        symbol: "Rp",
        lowestValue: 1.0,
        isPrimary: true,
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts minimal valid object", () => {
      const result = currencySchema.safeParse({
        countryId: 1,
        code: "USD",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isPrimary).toBe(false);
        expect(result.data.isActive).toBe(true);
      }
    });

    it("accepts optional fields omitted", () => {
      const result = currencySchema.safeParse({
        countryId: 1,
        code: "EUR",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("countryId validation", () => {
    it("rejects countryId of 0", () => {
      const result = currencySchema.safeParse({
        countryId: 0,
        code: "IDR",
      });

      expect(result.success).toBe(false);
    });

    it("rejects negative countryId", () => {
      const result = currencySchema.safeParse({
        countryId: -1,
        code: "IDR",
      });

      expect(result.success).toBe(false);
    });

    it("rejects missing countryId", () => {
      const result = currencySchema.safeParse({
        code: "IDR",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("code validation", () => {
    it("rejects code with length 2", () => {
      const result = currencySchema.safeParse({
        countryId: 1,
        code: "ID",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const err = result.error.issues.find((i) => i.path[0] === "code");
        expect(err?.message).toBe(
          "Currency code must be exactly 3 characters",
        );
      }
    });

    it("rejects code with length 4", () => {
      const result = currencySchema.safeParse({
        countryId: 1,
        code: "IDRR",
      });

      expect(result.success).toBe(false);
    });

    it("transforms code to uppercase", () => {
      const result = currencySchema.safeParse({
        countryId: 1,
        code: "idr",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.code).toBe("IDR");
      }
    });
  });

  describe("name validation", () => {
    it("rejects name exceeding 100 characters", () => {
      const result = currencySchema.safeParse({
        countryId: 1,
        code: "IDR",
        name: "A".repeat(101),
      });

      expect(result.success).toBe(false);
    });

    it("accepts name at exactly 100 characters", () => {
      const result = currencySchema.safeParse({
        countryId: 1,
        code: "IDR",
        name: "A".repeat(100),
      });

      expect(result.success).toBe(true);
    });
  });

  describe("symbol validation", () => {
    it("rejects symbol exceeding 10 characters", () => {
      const result = currencySchema.safeParse({
        countryId: 1,
        code: "IDR",
        symbol: "A".repeat(11),
      });

      expect(result.success).toBe(false);
    });

    it("accepts symbol at exactly 10 characters", () => {
      const result = currencySchema.safeParse({
        countryId: 1,
        code: "IDR",
        symbol: "A".repeat(10),
      });

      expect(result.success).toBe(true);
    });
  });

  describe("lowestValue validation", () => {
    it("rejects zero lowestValue", () => {
      const result = currencySchema.safeParse({
        countryId: 1,
        code: "IDR",
        lowestValue: 0,
      });

      expect(result.success).toBe(false);
    });

    it("rejects negative lowestValue", () => {
      const result = currencySchema.safeParse({
        countryId: 1,
        code: "IDR",
        lowestValue: -1,
      });

      expect(result.success).toBe(false);
    });

    it("accepts positive lowestValue", () => {
      const result = currencySchema.safeParse({
        countryId: 1,
        code: "IDR",
        lowestValue: 0.01,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("isPrimary default", () => {
    it("defaults isPrimary to false when not provided", () => {
      const result = currencySchema.safeParse({
        countryId: 1,
        code: "IDR",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isPrimary).toBe(false);
      }
    });
  });

  describe("isActive default", () => {
    it("defaults isActive to true when not provided", () => {
      const result = currencySchema.safeParse({
        countryId: 1,
        code: "IDR",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(true);
      }
    });
  });
});
