import { describe, expect, it } from "vitest";
import { bankSchema } from "@/features/master-data/bank/data/bank.schema";

describe("bankSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = bankSchema.safeParse({
        name: "Bank Central Asia",
        code: "BCA",
        color: "#003ea0",
        rtgsCode: "BCAINID31",
        onlineCode: "014",
        bifastCode: "014",
        sknCode: "0140001",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts a minimal valid object (name, code, isActive only)", () => {
      const result = bankSchema.safeParse({
        name: "Bank Mandiri",
        code: "MANDIRI",
        isActive: false,
      });

      expect(result.success).toBe(true);
    });

    it("accepts optional fields as undefined", () => {
      const result = bankSchema.safeParse({
        name: "Test Bank",
        code: "TST",
        isActive: true,
        color: undefined,
        rtgsCode: undefined,
        onlineCode: undefined,
        bifastCode: undefined,
        sknCode: undefined,
      });

      expect(result.success).toBe(true);
    });

    it("accepts empty string for optional color field", () => {
      const result = bankSchema.safeParse({
        name: "Test Bank",
        code: "TST",
        isActive: true,
        color: "",
      });

      expect(result.success).toBe(true);
    });

    it("accepts valid hex color with uppercase letters", () => {
      const result = bankSchema.safeParse({
        name: "Test Bank",
        code: "TST",
        isActive: true,
        color: "#AABBCC",
      });

      expect(result.success).toBe(true);
    });

    it("accepts valid hex color with mixed case letters", () => {
      const result = bankSchema.safeParse({
        name: "Test Bank",
        code: "TST",
        isActive: true,
        color: "#0066Cc",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("name validation", () => {
    it("rejects empty name", () => {
      const result = bankSchema.safeParse({
        name: "",
        code: "BCA",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find(
          (issue) => issue.path[0] === "name",
        );
        expect(nameError?.message).toBe("Bank name is required");
      }
    });

    it("rejects name exceeding 100 characters", () => {
      const result = bankSchema.safeParse({
        name: "A".repeat(101),
        code: "BCA",
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("accepts name at exactly 100 characters", () => {
      const result = bankSchema.safeParse({
        name: "A".repeat(100),
        code: "BCA",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("code validation", () => {
    it("rejects empty code", () => {
      const result = bankSchema.safeParse({
        name: "Bank Central Asia",
        code: "",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const codeError = result.error.issues.find(
          (issue) => issue.path[0] === "code",
        );
        expect(codeError?.message).toBe("Bank code is required");
      }
    });

    it("rejects code exceeding 50 characters", () => {
      const result = bankSchema.safeParse({
        name: "Bank Central Asia",
        code: "B".repeat(51),
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("accepts code at exactly 50 characters", () => {
      const result = bankSchema.safeParse({
        name: "Bank Central Asia",
        code: "B".repeat(50),
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("color validation", () => {
    it("rejects color not in hex format (no hash)", () => {
      const result = bankSchema.safeParse({
        name: "Test Bank",
        code: "TST",
        isActive: true,
        color: "003ea0",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const colorError = result.error.issues.find(
          (issue) => issue.path[0] === "color",
        );
        expect(colorError?.message).toBe(
          "Color must be in hex format (e.g., #0066CC)",
        );
      }
    });

    it("rejects color with invalid characters", () => {
      const result = bankSchema.safeParse({
        name: "Test Bank",
        code: "TST",
        isActive: true,
        color: "#GGGGGG",
      });

      expect(result.success).toBe(false);
    });

    it("rejects color shorter than 7 characters", () => {
      const result = bankSchema.safeParse({
        name: "Test Bank",
        code: "TST",
        isActive: true,
        color: "#00F",
      });

      expect(result.success).toBe(false);
    });

    it("rejects color longer than 7 characters", () => {
      const result = bankSchema.safeParse({
        name: "Test Bank",
        code: "TST",
        isActive: true,
        color: "#00112233",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("isActive validation", () => {
    it("accepts isActive as true", () => {
      const result = bankSchema.safeParse({
        name: "Test Bank",
        code: "TST",
        isActive: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(true);
      }
    });

    it("accepts isActive as false", () => {
      const result = bankSchema.safeParse({
        name: "Test Bank",
        code: "TST",
        isActive: false,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(false);
      }
    });
  });
});
