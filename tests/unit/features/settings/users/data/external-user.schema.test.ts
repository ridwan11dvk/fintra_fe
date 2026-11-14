import { describe, expect, it } from "vitest";
import { externalUserSchema } from "@/features/settings";

describe("externalUserSchema", () => {
  describe("valid data", () => {
    it("accepts a fully populated valid object", () => {
      const result = externalUserSchema.safeParse({
        userType: "PERSONAL",
        name: "John Doe",
        email: "john@example.com",
        username: "johndoe",
        password: "password123",
        roles: [1, 2],
        phoneNumber: "08123456789",
        photo: "https://example.com/photo.jpg",
        nik: "1234567890123456",
        npwp: "12.345.678.9-012.345",
        ktpFile: "https://example.com/ktp.pdf",
        npwpFile: "https://example.com/npwp.pdf",
        address: "Jl. Example No. 123",
        companyCode: "C001",
        responsibleName: "Jane Doe",
        responsibleEmail: "jane@example.com",
        responsibleNik: "6543210987654321",
        responsibleAddress: "Jl. Another No. 456",
        purpose: "Integration testing",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        twoFactorEnabled: true,
        otpSecret: "OTPSECRET123",
      });
      expect(result.success).toBe(true);
    });

    it("accepts a minimal valid object (required fields only)", () => {
      const result = externalUserSchema.safeParse({
        userType: "COMPANY",
        name: "Jane Doe",
        email: "jane@example.com",
        username: "janedoe",
        password: "password123",
        roles: [1],
        twoFactorEnabled: false,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("userType validation", () => {
    it("rejects empty userType", () => {
      const result = externalUserSchema.safeParse({
        userType: "",
        name: "John",
        email: "john@example.com",
        username: "john",
        password: "password123",
        roles: [1],
        twoFactorEnabled: false,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("name validation", () => {
    it("rejects name that is too short (< 3 characters)", () => {
      const result = externalUserSchema.safeParse({
        userType: "PERSONAL",
        name: "Jo",
        email: "john@example.com",
        username: "john",
        password: "password123",
        roles: [1],
        twoFactorEnabled: false,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("email validation", () => {
    it("rejects invalid email", () => {
      const result = externalUserSchema.safeParse({
        userType: "PERSONAL",
        name: "John Doe",
        email: "not-an-email",
        username: "john",
        password: "password123",
        roles: [1],
        twoFactorEnabled: false,
      });
      expect(result.success).toBe(false);
    });

    it("accepts empty responsibleEmail", () => {
      const result = externalUserSchema.safeParse({
        userType: "PERSONAL",
        name: "John Doe",
        email: "john@example.com",
        username: "john",
        password: "password123",
        roles: [1],
        responsibleEmail: "",
        twoFactorEnabled: false,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("username validation", () => {
    it("rejects username that is too short (< 4 characters)", () => {
      const result = externalUserSchema.safeParse({
        userType: "PERSONAL",
        name: "John",
        email: "john@example.com",
        username: "jo",
        password: "password123",
        roles: [1],
        twoFactorEnabled: false,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("password validation", () => {
    it("rejects password that is too short (< 8 characters)", () => {
      const result = externalUserSchema.safeParse({
        userType: "PERSONAL",
        name: "John",
        email: "john@example.com",
        username: "john",
        password: "short",
        roles: [1],
        twoFactorEnabled: false,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("roles validation", () => {
    it("rejects empty roles array", () => {
      const result = externalUserSchema.safeParse({
        userType: "PERSONAL",
        name: "John",
        email: "john@example.com",
        username: "john",
        password: "password123",
        roles: [],
        twoFactorEnabled: false,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("nik validation", () => {
    it("rejects nik exceeding 50 characters", () => {
      const result = externalUserSchema.safeParse({
        userType: "PERSONAL",
        name: "John",
        email: "john@example.com",
        username: "john",
        password: "password123",
        roles: [1],
        nik: "X".repeat(51),
        twoFactorEnabled: false,
      });
      expect(result.success).toBe(false);
    });

    it("accepts nik at exactly 50 characters", () => {
      const result = externalUserSchema.safeParse({
        userType: "PERSONAL",
        name: "John",
        email: "john@example.com",
        username: "john",
        password: "password123",
        roles: [1],
        nik: "X".repeat(50),
        twoFactorEnabled: false,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("npwp validation", () => {
    it("rejects npwp exceeding 50 characters", () => {
      const result = externalUserSchema.safeParse({
        userType: "PERSONAL",
        name: "John",
        email: "john@example.com",
        username: "john",
        password: "password123",
        roles: [1],
        npwp: "X".repeat(51),
        twoFactorEnabled: false,
      });
      expect(result.success).toBe(false);
    });
  });
});
