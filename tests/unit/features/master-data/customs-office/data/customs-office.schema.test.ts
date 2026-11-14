import { describe, expect, it } from "vitest";
import { customsOfficeSchema } from "@/features/master-data/customs-office/data/customs-office.schema";

describe("customsOfficeSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = customsOfficeSchema.safeParse({
        code: "KPPBC-001",
        name: "Kantor Pengawasan dan Pelayanan Bea dan Cukai Jakarta",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts a minimal valid object", () => {
      const result = customsOfficeSchema.safeParse({
        code: "KPPBC_002",
        name: "KPPBC Surabaya",
        isActive: false,
      });

      expect(result.success).toBe(true);
    });

    it("accepts code with underscores and hyphens", () => {
      const result = customsOfficeSchema.safeParse({
        code: "KPPBC_003-XYZ",
        name: "Test Office",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts code with numbers only", () => {
      const result = customsOfficeSchema.safeParse({
        code: "00123",
        name: "Numeric Code Office",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("code validation", () => {
    it("rejects empty code", () => {
      const result = customsOfficeSchema.safeParse({
        code: "",
        name: "Test Office",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const codeError = result.error.issues.find(
          (issue) => issue.path[0] === "code",
        );
        expect(codeError?.message).toBe("Customs office code is required");
      }
    });

    it("rejects code exceeding 50 characters", () => {
      const result = customsOfficeSchema.safeParse({
        code: "C".repeat(51),
        name: "Test Office",
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("accepts code at exactly 50 characters", () => {
      const result = customsOfficeSchema.safeParse({
        code: "C".repeat(50),
        name: "Test Office",
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("rejects code with lowercase letters", () => {
      const result = customsOfficeSchema.safeParse({
        code: "kppbc-001",
        name: "Test Office",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const codeError = result.error.issues.find(
          (issue) => issue.path[0] === "code",
        );
        expect(codeError?.message).toBe(
          "Code can only contain uppercase letters, numbers, underscores, and hyphens",
        );
      }
    });

    it("rejects code with special characters like @ and #", () => {
      const result = customsOfficeSchema.safeParse({
        code: "KPPBC@001#",
        name: "Test Office",
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("rejects code with spaces", () => {
      const result = customsOfficeSchema.safeParse({
        code: "KPPBC 001",
        name: "Test Office",
        isActive: true,
      });

      expect(result.success).toBe(false);
    });
  });

  describe("name validation", () => {
    it("rejects empty name", () => {
      const result = customsOfficeSchema.safeParse({
        code: "KPPBC-001",
        name: "",
        isActive: true,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find(
          (issue) => issue.path[0] === "name",
        );
        expect(nameError?.message).toBe("Customs office name is required");
      }
    });

    it("rejects name exceeding 255 characters", () => {
      const result = customsOfficeSchema.safeParse({
        code: "KPPBC-001",
        name: "N".repeat(256),
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("accepts name at exactly 255 characters", () => {
      const result = customsOfficeSchema.safeParse({
        code: "KPPBC-001",
        name: "N".repeat(255),
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("isActive validation", () => {
    it("accepts isActive as true", () => {
      const result = customsOfficeSchema.safeParse({
        code: "KPPBC-001",
        name: "Test Office",
        isActive: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(true);
      }
    });

    it("accepts isActive as false", () => {
      const result = customsOfficeSchema.safeParse({
        code: "KPPBC-001",
        name: "Test Office",
        isActive: false,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isActive).toBe(false);
      }
    });

    it("rejects isActive when missing", () => {
      const result = customsOfficeSchema.safeParse({
        code: "KPPBC-001",
        name: "Test Office",
      });

      expect(result.success).toBe(false);
    });

    it("rejects isActive when it is a string instead of boolean", () => {
      const result = customsOfficeSchema.safeParse({
        code: "KPPBC-001",
        name: "Test Office",
        isActive: "true",
      });

      expect(result.success).toBe(false);
    });
  });
});
