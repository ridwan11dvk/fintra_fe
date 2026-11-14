import { describe, expect, it } from "vitest";
import { z } from "zod";

const roleSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  moduleId: z.number().optional().nullish(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

describe("roleSchema (inline from role-form.tsx)", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = roleSchema.safeParse({
        name: "Admin",
        moduleId: 1,
        description: "Administrator role",
      });

      expect(result.success).toBe(true);
    });

    it("accepts a minimal valid object (name only)", () => {
      const result = roleSchema.safeParse({
        name: "Viewer",
      });

      expect(result.success).toBe(true);
    });

    it("accepts optional fields as undefined", () => {
      const result = roleSchema.safeParse({
        name: "Test Role",
        moduleId: undefined,
        description: undefined,
      });

      expect(result.success).toBe(true);
    });

    it("accepts moduleId as null", () => {
      const result = roleSchema.safeParse({
        name: "Test Role",
        moduleId: null,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("name validation", () => {
    it("rejects name that is too short (< 2 characters)", () => {
      const result = roleSchema.safeParse({
        name: "A",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find(
          (issue) => issue.path[0] === "name",
        );
        expect(nameError?.message).toBe("Name must be at least 2 characters");
      }
    });

    it("rejects name exceeding 100 characters", () => {
      const result = roleSchema.safeParse({
        name: "A".repeat(101),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find(
          (issue) => issue.path[0] === "name",
        );
        expect(nameError?.message).toMatch(/100 characters/i);
      }
    });

    it("accepts name at exactly 100 characters", () => {
      const result = roleSchema.safeParse({
        name: "A".repeat(100),
      });

      expect(result.success).toBe(true);
    });

    it("accepts name at exactly 2 characters", () => {
      const result = roleSchema.safeParse({
        name: "AB",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("description validation", () => {
    it("rejects description exceeding 500 characters", () => {
      const result = roleSchema.safeParse({
        name: "Test",
        description: "A".repeat(501),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const descError = result.error.issues.find(
          (issue) => issue.path[0] === "description",
        );
        expect(descError?.message).toMatch(/500 characters/i);
      }
    });

    it("accepts description at exactly 500 characters", () => {
      const result = roleSchema.safeParse({
        name: "Test",
        description: "A".repeat(500),
      });

      expect(result.success).toBe(true);
    });

    it("accepts description as empty string", () => {
      const result = roleSchema.safeParse({
        name: "Test",
        description: "",
      });

      expect(result.success).toBe(true);
    });
  });
});
