import { describe, expect, it } from "vitest";
import { partnerCategorySchema } from "@/features/master-data/partner-category/data/partner-category.schema";

describe("partnerCategorySchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = partnerCategorySchema.safeParse({
        name: "Supplier",
        description: "Supplier category",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts a minimal valid object (name only)", () => {
      const result = partnerCategorySchema.safeParse({
        name: "Customer",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts optional fields as undefined", () => {
      const result = partnerCategorySchema.safeParse({
        name: "Vendor",
        description: undefined,
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts empty string for description", () => {
      const result = partnerCategorySchema.safeParse({
        name: "Vendor",
        description: "",
        isActive: false,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("name validation", () => {
    it("rejects empty name", () => {
      const result = partnerCategorySchema.safeParse({
        name: "",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find(
          (issue) => issue.path[0] === "name",
        );
        expect(nameError?.message).toBe(
          "Partner Category name is required",
        );
      }
    });

    it("rejects name exceeding 255 characters", () => {
      const result = partnerCategorySchema.safeParse({
        name: "A".repeat(256),
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("accepts name at exactly 255 characters", () => {
      const result = partnerCategorySchema.safeParse({
        name: "A".repeat(255),
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("description validation", () => {
    it("rejects description exceeding 16000 characters", () => {
      const result = partnerCategorySchema.safeParse({
        name: "Test",
        description: "A".repeat(16001),
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("accepts description at exactly 16000 characters", () => {
      const result = partnerCategorySchema.safeParse({
        name: "Test",
        description: "A".repeat(16000),
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("isActive validation", () => {
    it("defaults isActive to true when not provided", () => {
      const result = partnerCategorySchema.safeParse({
        name: "Test",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(true);
      }
    });

    it("accepts isActive as true", () => {
      const result = partnerCategorySchema.safeParse({
        name: "Test",
        isActive: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(true);
      }
    });

    it("accepts isActive as false", () => {
      const result = partnerCategorySchema.safeParse({
        name: "Test",
        isActive: false,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(false);
      }
    });
  });
});
