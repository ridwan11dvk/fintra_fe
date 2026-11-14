import { describe, expect, it } from "vitest";
import { districtSchema } from "@/features/master-data/district/data/district.schema";

describe("districtSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = districtSchema.safeParse({
        code: "DIST001",
        name: "Bandung City",
        provinceId: 1,
        regencyId: 1,
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts a minimal valid object (name, provinceId, regencyId only)", () => {
      const result = districtSchema.safeParse({
        name: "Bandung City",
        provinceId: 1,
        regencyId: 1,
      });

      expect(result.success).toBe(true);
    });

    it("accepts optional fields as undefined", () => {
      const result = districtSchema.safeParse({
        name: "Test District",
        code: undefined,
        provinceId: 1,
        regencyId: 1,
        isActive: undefined,
      });

      expect(result.success).toBe(true);
    });

    it("accepts empty string for optional code field", () => {
      const result = districtSchema.safeParse({
        name: "Test District",
        code: "",
        provinceId: 1,
        regencyId: 1,
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("defaults isActive to true when not provided", () => {
      const result = districtSchema.safeParse({
        name: "Test District",
        provinceId: 1,
        regencyId: 1,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(true);
      }
    });
  });

  describe("name validation", () => {
    it("rejects empty name", () => {
      const result = districtSchema.safeParse({
        name: "",
        provinceId: 1,
        regencyId: 1,
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find(
          (issue) => issue.path[0] === "name",
        );
        expect(nameError?.message).toBe("District name is required");
      }
    });

    it("rejects name exceeding 100 characters", () => {
      const result = districtSchema.safeParse({
        name: "A".repeat(101),
        provinceId: 1,
        regencyId: 1,
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("accepts name at exactly 100 characters", () => {
      const result = districtSchema.safeParse({
        name: "A".repeat(100),
        provinceId: 1,
        regencyId: 1,
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("code validation", () => {
    it("rejects code exceeding 50 characters", () => {
      const result = districtSchema.safeParse({
        name: "Test District",
        code: "B".repeat(51),
        provinceId: 1,
        regencyId: 1,
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("accepts code at exactly 50 characters", () => {
      const result = districtSchema.safeParse({
        name: "Test District",
        code: "B".repeat(50),
        provinceId: 1,
        regencyId: 1,
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("provinceId validation", () => {
    it("rejects provinceId of 0", () => {
      const result = districtSchema.safeParse({
        name: "Test District",
        provinceId: 0,
        regencyId: 1,
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find(
          (issue) => issue.path[0] === "provinceId",
        );
        expect(error?.message).toBe("Province is required");
      }
    });

    it("rejects negative provinceId", () => {
      const result = districtSchema.safeParse({
        name: "Test District",
        provinceId: -1,
        regencyId: 1,
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("rejects non-integer provinceId", () => {
      const result = districtSchema.safeParse({
        name: "Test District",
        provinceId: 1.5,
        regencyId: 1,
        isActive: true,
      });

      expect(result.success).toBe(false);
    });
  });

  describe("regencyId validation", () => {
    it("rejects regencyId of 0", () => {
      const result = districtSchema.safeParse({
        name: "Test District",
        provinceId: 1,
        regencyId: 0,
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.issues.find(
          (issue) => issue.path[0] === "regencyId",
        );
        expect(error?.message).toBe("Regency is required");
      }
    });

    it("rejects negative regencyId", () => {
      const result = districtSchema.safeParse({
        name: "Test District",
        provinceId: 1,
        regencyId: -1,
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("rejects non-integer regencyId", () => {
      const result = districtSchema.safeParse({
        name: "Test District",
        provinceId: 1,
        regencyId: 1.5,
        isActive: true,
      });

      expect(result.success).toBe(false);
    });
  });

  describe("isActive validation", () => {
    it("accepts isActive as true", () => {
      const result = districtSchema.safeParse({
        name: "Test District",
        provinceId: 1,
        regencyId: 1,
        isActive: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(true);
      }
    });

    it("accepts isActive as false", () => {
      const result = districtSchema.safeParse({
        name: "Test District",
        provinceId: 1,
        regencyId: 1,
        isActive: false,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(false);
      }
    });
  });
});
