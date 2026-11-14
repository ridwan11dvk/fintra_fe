import { describe, expect, it } from "vitest";
import { partnerTypeSchema } from "@/features/master-data/partner-type/data/partner-type.schema";

const validData = {
  code: "DS",
  name: "Domestic Supplier",
  partnerLegalityId: 1,
  isActive: true,
  integratedToErp: false,
};

describe("partnerTypeSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = partnerTypeSchema.safeParse({
        ...validData,
        parentId: null,
        description: "Local domestic supplier",
      });
      expect(result.success).toBe(true);
    });

    it("accepts minimal valid object", () => {
      const result = partnerTypeSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("accepts undefined optional fields", () => {
      const result = partnerTypeSchema.safeParse({
        ...validData,
        parentId: undefined,
        description: undefined,
      });
      expect(result.success).toBe(true);
    });

    it("accepts empty string for description", () => {
      const result = partnerTypeSchema.safeParse({
        ...validData,
        description: "",
      });
      expect(result.success).toBe(true);
    });

    it("accepts valid number for parentId", () => {
      const result = partnerTypeSchema.safeParse({
        ...validData,
        parentId: 5,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("code validation", () => {
    it("rejects empty code", () => {
      const result = partnerTypeSchema.safeParse({
        ...validData,
        code: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects code exceeding 50 characters", () => {
      const result = partnerTypeSchema.safeParse({
        ...validData,
        code: "A".repeat(51),
      });
      expect(result.success).toBe(false);
    });

    it("accepts code at exactly 50 characters", () => {
      const result = partnerTypeSchema.safeParse({
        ...validData,
        code: "A".repeat(50),
      });
      expect(result.success).toBe(true);
    });
  });

  describe("name validation", () => {
    it("rejects empty name", () => {
      const result = partnerTypeSchema.safeParse({
        ...validData,
        name: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects name exceeding 255 characters", () => {
      const result = partnerTypeSchema.safeParse({
        ...validData,
        name: "A".repeat(256),
      });
      expect(result.success).toBe(false);
    });

    it("accepts name at exactly 255 characters", () => {
      const result = partnerTypeSchema.safeParse({
        ...validData,
        name: "A".repeat(255),
      });
      expect(result.success).toBe(true);
    });
  });

  describe("partnerLegalityId validation", () => {
    it("rejects partnerLegalityId as 0", () => {
      const result = partnerTypeSchema.safeParse({
        ...validData,
        partnerLegalityId: 0,
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing partnerLegalityId", () => {
      const result = partnerTypeSchema.safeParse({
        code: "DS",
        name: "Domestic Supplier",
        isActive: true,
        integratedToErp: false,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("parentId validation", () => {
    it("accepts null parentId", () => {
      const result = partnerTypeSchema.safeParse({
        ...validData,
        parentId: null,
      });
      expect(result.success).toBe(true);
    });

    it("accepts undefined parentId", () => {
      const result = partnerTypeSchema.safeParse({
        ...validData,
        parentId: undefined,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("description validation", () => {
    it("rejects description exceeding 16000 characters", () => {
      const result = partnerTypeSchema.safeParse({
        ...validData,
        description: "A".repeat(16001),
      });
      expect(result.success).toBe(false);
    });

    it("accepts description at exactly 16000 characters", () => {
      const result = partnerTypeSchema.safeParse({
        ...validData,
        description: "A".repeat(16000),
      });
      expect(result.success).toBe(true);
    });
  });

  describe("isActive default", () => {
    it("defaults isActive to true when not provided", () => {
      const result = partnerTypeSchema.parse(validData);
      expect(result.isActive).toBe(true);
    });

    it("accepts isActive as false", () => {
      const result = partnerTypeSchema.parse({
        ...validData,
        isActive: false,
      });
      expect(result.isActive).toBe(false);
    });
  });

  describe("integratedToErp default", () => {
    it("defaults integratedToErp to false when not provided", () => {
      const result = partnerTypeSchema.parse(validData);
      expect(result.integratedToErp).toBe(false);
    });

    it("accepts integratedToErp as true", () => {
      const result = partnerTypeSchema.parse({
        ...validData,
        integratedToErp: true,
      });
      expect(result.integratedToErp).toBe(true);
    });
  });
});
