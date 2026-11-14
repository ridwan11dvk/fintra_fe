import { describe, expect, it } from "vitest";
import { regencySchema } from "@/features/master-data/regency/data/regency.schema";

describe("regencySchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = regencySchema.safeParse({
        code: "REG001",
        name: "Bandung",
        provinceId: 1,
        isActive: true,
      });
      expect(result.success).toBe(true);
    });

    it("accepts isActive as false", () => {
      const result = regencySchema.safeParse({
        code: "REG001",
        name: "Bandung",
        provinceId: 1,
        isActive: false,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(false);
      }
    });

    it("accepts empty code string", () => {
      const result = regencySchema.safeParse({
        code: "",
        name: "Bandung",
        provinceId: 1,
      });
      expect(result.success).toBe(true);
    });

    it("accepts missing optional fields including code", () => {
      const result = regencySchema.safeParse({
        name: "Bandung",
        provinceId: 1,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.code).toBeUndefined();
        expect(result.data.isActive).toBe(true);
      }
    });
  });

  describe("name validation", () => {
    it("rejects empty name", () => {
      const result = regencySchema.safeParse({
        name: "",
        provinceId: 1,
      });
      expect(result.success).toBe(false);
    });

    it("rejects name exceeding 100 characters", () => {
      const result = regencySchema.safeParse({
        name: "A".repeat(101),
        provinceId: 1,
      });
      expect(result.success).toBe(false);
    });

    it("accepts name at exactly 100 characters", () => {
      const result = regencySchema.safeParse({
        name: "A".repeat(100),
        provinceId: 1,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("code validation", () => {
    it("rejects code exceeding 50 characters", () => {
      const result = regencySchema.safeParse({
        code: "A".repeat(51),
        name: "Bandung",
        provinceId: 1,
      });
      expect(result.success).toBe(false);
    });

    it("accepts code at exactly 50 characters", () => {
      const result = regencySchema.safeParse({
        code: "A".repeat(50),
        name: "Bandung",
        provinceId: 1,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("provinceId validation", () => {
    it("rejects provinceId of 0", () => {
      const result = regencySchema.safeParse({
        name: "Bandung",
        provinceId: 0,
      });
      expect(result.success).toBe(false);
    });
  });
});
