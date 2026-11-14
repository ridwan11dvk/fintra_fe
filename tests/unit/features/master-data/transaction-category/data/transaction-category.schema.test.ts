import { describe, expect, it } from "vitest";
import { transactionCategorySchema } from "@/features/master-data/transaction-category/data/transaction-category.schema";

describe("transactionCategorySchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = transactionCategorySchema.safeParse({
        name: "Office Supplies",
        description: "Expenses for office supplies",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts a minimal valid object (name and isActive only)", () => {
      const result = transactionCategorySchema.safeParse({
        name: "Travel",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts description as undefined", () => {
      const result = transactionCategorySchema.safeParse({
        name: "Test",
        isActive: true,
        description: undefined,
      });

      expect(result.success).toBe(true);
    });

    it("accepts isActive as false", () => {
      const result = transactionCategorySchema.safeParse({
        name: "Test",
        description: "Test desc",
        isActive: false,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(false);
      }
    });
  });

  describe("name validation", () => {
    it("rejects empty name", () => {
      const result = transactionCategorySchema.safeParse({
        name: "",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find(
          (issue) => issue.path[0] === "name",
        );
        expect(nameError?.message).toBe("Transaction category name is required");
      }
    });

    it("rejects name exceeding 255 characters", () => {
      const result = transactionCategorySchema.safeParse({
        name: "A".repeat(256),
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("accepts name at exactly 255 characters", () => {
      const result = transactionCategorySchema.safeParse({
        name: "A".repeat(255),
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("description validation", () => {
    it("rejects description exceeding 65535 characters", () => {
      const result = transactionCategorySchema.safeParse({
        name: "Test",
        description: "A".repeat(65536),
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("accepts description at exactly 65535 characters", () => {
      const result = transactionCategorySchema.safeParse({
        name: "Test",
        description: "A".repeat(65535),
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("isActive validation", () => {
    it("accepts isActive as true", () => {
      const result = transactionCategorySchema.safeParse({
        name: "Test",
        isActive: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(true);
      }
    });
  });
});
