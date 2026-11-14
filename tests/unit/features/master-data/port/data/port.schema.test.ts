import { describe, expect, it } from "vitest";
import { portSchema } from "@/features/master-data/port/data/port.schema";

const validData = {
  customsOfficeId: 1,
  code: "PORT-CGK-001",
  name: "Pelabuhan Soekarno-Hatta Jakarta",
  isActive: true,
};

describe("portSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = portSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("accepts isActive as false", () => {
      const result = portSchema.safeParse({
        ...validData,
        isActive: false,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("customsOfficeId validation", () => {
    it("rejects customsOfficeId as 0", () => {
      const result = portSchema.safeParse({
        ...validData,
        customsOfficeId: 0,
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing customsOfficeId", () => {
      const result = portSchema.safeParse({
        code: "PORT-001",
        name: "Test Port",
        isActive: true,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("code validation", () => {
    it("rejects empty code", () => {
      const result = portSchema.safeParse({
        ...validData,
        code: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects code exceeding 50 characters", () => {
      const result = portSchema.safeParse({
        ...validData,
        code: "A".repeat(51),
      });
      expect(result.success).toBe(false);
    });

    it("accepts code at exactly 50 characters", () => {
      const result = portSchema.safeParse({
        ...validData,
        code: "A".repeat(50),
      });
      expect(result.success).toBe(true);
    });
  });

  describe("name validation", () => {
    it("rejects empty name", () => {
      const result = portSchema.safeParse({
        ...validData,
        name: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects name exceeding 255 characters", () => {
      const result = portSchema.safeParse({
        ...validData,
        name: "A".repeat(256),
      });
      expect(result.success).toBe(false);
    });

    it("accepts name at exactly 255 characters", () => {
      const result = portSchema.safeParse({
        ...validData,
        name: "A".repeat(255),
      });
      expect(result.success).toBe(true);
    });
  });
});
