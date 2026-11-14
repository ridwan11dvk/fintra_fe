import { describe, expect, it } from "vitest";
import { businessAreaSchema } from "@/features/master-data/business-area/data/business-area.schema";

describe("businessAreaSchema", () => {
  it("accepts a fully populated valid object", () => {
    const result = businessAreaSchema.safeParse({
      companyCode: "PTABC",
      name: "Business Area Jakarta",
      baCode: "BA-JKT-01",
      branchCode: "BR-001",
      email: "ba.jakarta@ptabc.com",
      taxEmail: "tax.jakarta@ptabc.com",
      nitku: "0012345678",
      npwp: "123456789012345",
      clientId: "CLIENT_001",
      clientSecret: "SECRET_001",
      isActive: true,
    });

    expect(result.success).toBe(true);
  });

  it("accepts a minimal valid object", () => {
    const result = businessAreaSchema.safeParse({
      companyCode: "PTABC",
      name: "Business Area Jakarta",
      baCode: "BA-JKT-01",
      isActive: false,
    });

    expect(result.success).toBe(true);
  });

  it("accepts optional fields as undefined", () => {
    const result = businessAreaSchema.safeParse({
      companyCode: "PTABC",
      name: "Business Area Jakarta",
      baCode: "BA-JKT-01",
      branchCode: undefined,
      email: undefined,
      taxEmail: undefined,
      nitku: undefined,
      npwp: undefined,
      clientId: undefined,
      clientSecret: undefined,
      isActive: true,
    });

    expect(result.success).toBe(true);
  });

  it("rejects empty required fields", () => {
    const result = businessAreaSchema.safeParse({
      companyCode: "",
      name: "",
      baCode: "",
      isActive: true,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.find((issue) => issue.path[0] === "companyCode")
          ?.message,
      ).toBe("Company code is required");
      expect(
        result.error.issues.find((issue) => issue.path[0] === "name")?.message,
      ).toBe("Business area name is required");
      expect(
        result.error.issues.find((issue) => issue.path[0] === "baCode")
          ?.message,
      ).toBe("Business area code is required");
    }
  });

  it("rejects values exceeding max lengths", () => {
    const result = businessAreaSchema.safeParse({
      companyCode: "A".repeat(101),
      name: "B".repeat(256),
      baCode: "C".repeat(51),
      branchCode: "D".repeat(51),
      email: "invalid-email",
      taxEmail: "also-invalid",
      nitku: "E".repeat(51),
      npwp: "F".repeat(51),
      clientId: "G".repeat(101),
      clientSecret: "H".repeat(256),
      isActive: true,
    });

    expect(result.success).toBe(false);
  });
});
