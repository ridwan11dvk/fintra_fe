import { describe, expect, it } from "vitest";
import { provinceSchema } from "@/features/master-data/province/data/province.schema";

describe("provinceSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = provinceSchema.safeParse({
        code: "PROV001",
        name: "West Java",
        alias: "Jabar",
        isActive: true,
      });
      expect(result.success).toBe(true);
    });

    it("accepts isActive as false", () => {
      const result = provinceSchema.safeParse({
        code: "PROV001",
        name: "West Java",
        isActive: false,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(false);
      }
    });

    it("accepts empty code string", () => {
      const result = provinceSchema.safeParse({
        code: "",
        name: "West Java",
      });
      expect(result.success).toBe(true);
    });

    it("accepts missing optional fields", () => {
      const result = provinceSchema.safeParse({
        name: "West Java",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.code).toBeUndefined();
        expect(result.data.alias).toBeUndefined();
        expect(result.data.isActive).toBe(true);
      }
    });
  });

  describe("name validation", () => {
    it("rejects empty name", () => {
      const result = provinceSchema.safeParse({
        name: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects name exceeding 100 characters", () => {
      const result = provinceSchema.safeParse({
        name: "A".repeat(101),
      });
      expect(result.success).toBe(false);
    });

    it("accepts name at exactly 100 characters", () => {
      const result = provinceSchema.safeParse({
        name: "A".repeat(100),
      });
      expect(result.success).toBe(true);
    });
  });

  describe("code validation", () => {
    it("rejects code exceeding 50 characters", () => {
      const result = provinceSchema.safeParse({
        code: "A".repeat(51),
        name: "West Java",
      });
      expect(result.success).toBe(false);
    });

    it("accepts code at exactly 50 characters", () => {
      const result = provinceSchema.safeParse({
        code: "A".repeat(50),
        name: "West Java",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("alias validation", () => {
    it("rejects alias exceeding 100 characters", () => {
      const result = provinceSchema.safeParse({
        code: "PROV001",
        name: "West Java",
        alias: "A".repeat(101),
      });
      expect(result.success).toBe(false);
    });

    it("accepts alias at exactly 100 characters", () => {
      const result = provinceSchema.safeParse({
        code: "PROV001",
        name: "West Java",
        alias: "A".repeat(100),
      });
      expect(result.success).toBe(true);
    });
  });
});
