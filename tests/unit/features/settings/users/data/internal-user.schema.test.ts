import { describe, expect, it } from "vitest";
import { internalUserSchema } from "@/features/settings";

describe("internalUserSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = internalUserSchema.safeParse({
        nipp: "12345",
        costCenterId: "CC001",
        roles: [1, 2],
        status: "active",
        name: "John Doe",
        photo: "https://example.com/photo.jpg",
        email: "john@example.com",
        phoneNumber: "08123456789",
        companyCode: "C001",
        companyName: "Company A",
        positionName: "Developer",
      });
      expect(result.success).toBe(true);
    });

    it("accepts a minimal valid object (required fields only)", () => {
      const result = internalUserSchema.safeParse({
        nipp: "12345",
        name: "John Doe",
        email: "john@example.com",
        companyCode: "C001",
        companyName: "Company A",
        roles: [1],
        status: "active",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("nipp validation", () => {
    it("rejects empty nipp", () => {
      const result = internalUserSchema.safeParse({
        nipp: "",
        roles: [1],
        status: "active",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("roles validation", () => {
    it("rejects empty roles array", () => {
      const result = internalUserSchema.safeParse({
        nipp: "12345",
        roles: [],
        status: "active",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("status validation", () => {
    it("rejects empty status", () => {
      const result = internalUserSchema.safeParse({
        nipp: "12345",
        roles: [1],
        status: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("optional fields", () => {
    it("accepts missing optional fields", () => {
      const result = internalUserSchema.safeParse({
        nipp: "12345",
        name: "John Doe",
        email: "john@example.com",
        companyCode: "C001",
        companyName: "Company A",
        roles: [1],
        status: "active",
      });
      expect(result.success).toBe(true);
    });

    it("accepts null photo", () => {
      const result = internalUserSchema.safeParse({
        nipp: "12345",
        name: "John Doe",
        email: "john@example.com",
        companyCode: "C001",
        companyName: "Company A",
        roles: [1],
        status: "active",
        photo: null,
      });
      expect(result.success).toBe(true);
    });
  });
});
