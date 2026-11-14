import { describe, expect, it } from "vitest";
import { taxableItemSchema } from "@/features/master-data/taxable-item/data/taxable-item.schema";

describe("taxableItemSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = taxableItemSchema.safeParse({
        code: "GOODS-001",
        altCode: "ALT-001",
        fullCode: "GOODS-CATEGORY-001",
        fullAltCode: "ALT-CATEGORY-001",
        name: "Electronic Goods",
        level: 1,
        parentId: null,
        type: "GOODS",
        moduleId: 1,
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts a minimal valid object (name and type only)", () => {
      const result = taxableItemSchema.safeParse({
        name: "Services",
        type: "SERVICE",
      });

      expect(result.success).toBe(true);
    });

    it("accepts optional fields as undefined", () => {
      const result = taxableItemSchema.safeParse({
        name: "Test Item",
        type: "GOODS",
        code: undefined,
        altCode: undefined,
        fullCode: undefined,
        fullAltCode: undefined,
        level: undefined,
        parentId: undefined,
        moduleId: undefined,
      });

      expect(result.success).toBe(true);
    });

    it("defaults isActive to true when not provided", () => {
      const result = taxableItemSchema.safeParse({
        name: "Test Item",
        type: "SERVICE",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(true);
      }
    });

    it("accepts empty string for code fields (transformed to undefined)", () => {
      const result = taxableItemSchema.safeParse({
        name: "Test Item",
        type: "GOODS",
        code: "",
        altCode: "",
        fullCode: "",
        fullAltCode: "",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.code).toBeUndefined();
        expect(result.data.altCode).toBeUndefined();
        expect(result.data.fullCode).toBeUndefined();
        expect(result.data.fullAltCode).toBeUndefined();
      }
    });
  });

  describe("name validation", () => {
    it("rejects empty name", () => {
      const result = taxableItemSchema.safeParse({
        name: "",
        type: "GOODS",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find(
          (issue) => issue.path[0] === "name",
        );
        expect(nameError?.message).toBe("Taxable item name is required");
      }
    });

    it("rejects name exceeding 100 characters", () => {
      const result = taxableItemSchema.safeParse({
        name: "A".repeat(101),
        type: "GOODS",
      });

      expect(result.success).toBe(false);
    });

    it("accepts name at exactly 100 characters", () => {
      const result = taxableItemSchema.safeParse({
        name: "A".repeat(100),
        type: "GOODS",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("type validation", () => {
    it("rejects invalid type value", () => {
      const result = taxableItemSchema.safeParse({
        name: "Test",
        type: "INVALID",
      });

      expect(result.success).toBe(false);
    });

    it("accepts SERVICE type", () => {
      const result = taxableItemSchema.safeParse({
        name: "Test",
        type: "SERVICE",
      });

      expect(result.success).toBe(true);
    });

    it("accepts GOODS type", () => {
      const result = taxableItemSchema.safeParse({
        name: "Test",
        type: "GOODS",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("code validation", () => {
    it("rejects code exceeding 50 characters", () => {
      const result = taxableItemSchema.safeParse({
        name: "Test",
        type: "GOODS",
        code: "A".repeat(51),
      });

      expect(result.success).toBe(false);
    });

    it("accepts code at exactly 50 characters", () => {
      const result = taxableItemSchema.safeParse({
        name: "Test",
        type: "GOODS",
        code: "A".repeat(50),
      });

      expect(result.success).toBe(true);
    });
  });

  describe("altCode validation", () => {
    it("rejects altCode exceeding 50 characters", () => {
      const result = taxableItemSchema.safeParse({
        name: "Test",
        type: "GOODS",
        altCode: "A".repeat(51),
      });

      expect(result.success).toBe(false);
    });
  });

  describe("fullCode validation", () => {
    it("rejects fullCode exceeding 100 characters", () => {
      const result = taxableItemSchema.safeParse({
        name: "Test",
        type: "GOODS",
        fullCode: "A".repeat(101),
      });

      expect(result.success).toBe(false);
    });
  });

  describe("fullAltCode validation", () => {
    it("rejects fullAltCode exceeding 100 characters", () => {
      const result = taxableItemSchema.safeParse({
        name: "Test",
        type: "GOODS",
        fullAltCode: "A".repeat(101),
      });

      expect(result.success).toBe(false);
    });
  });

  describe("level validation", () => {
    it("rejects level as 0", () => {
      const result = taxableItemSchema.safeParse({
        name: "Test",
        type: "GOODS",
        level: 0,
      });

      expect(result.success).toBe(false);
    });

    it("rejects negative level", () => {
      const result = taxableItemSchema.safeParse({
        name: "Test",
        type: "GOODS",
        level: -1,
      });

      expect(result.success).toBe(false);
    });

    it("accepts positive level", () => {
      const result = taxableItemSchema.safeParse({
        name: "Test",
        type: "GOODS",
        level: 3,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("parentId validation", () => {
    it("rejects parentId as 0", () => {
      const result = taxableItemSchema.safeParse({
        name: "Test",
        type: "GOODS",
        parentId: 0,
      });

      expect(result.success).toBe(false);
    });

    it("accepts null parentId", () => {
      const result = taxableItemSchema.safeParse({
        name: "Test",
        type: "GOODS",
        parentId: null,
      });

      expect(result.success).toBe(true);
    });

    it("accepts positive parentId", () => {
      const result = taxableItemSchema.safeParse({
        name: "Test",
        type: "GOODS",
        parentId: 5,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("moduleId validation", () => {
    it("rejects moduleId as 0", () => {
      const result = taxableItemSchema.safeParse({
        name: "Test",
        type: "GOODS",
        moduleId: 0,
      });

      expect(result.success).toBe(false);
    });
  });

  describe("isActive validation", () => {
    it("accepts isActive as true", () => {
      const result = taxableItemSchema.safeParse({
        name: "Test",
        type: "GOODS",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts isActive as false", () => {
      const result = taxableItemSchema.safeParse({
        name: "Test",
        type: "GOODS",
        isActive: false,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(false);
      }
    });
  });
});
