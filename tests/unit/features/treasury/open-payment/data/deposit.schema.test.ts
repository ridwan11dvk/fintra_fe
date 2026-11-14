import { depositEditSchema, sendStatusUpdateSchema } from "@/features/treasury";
import { describe, expect, it } from "vitest";

describe("depositEditSchema", () => {
  it("should accept valid form data with all fields", () => {
    const result = depositEditSchema.safeParse({
      agentCode: "AGT001",
      virtualAccount: "123456789012345678",
      name: "John Doe",
      referenceNumber: "REF-001",
      depositDate: "2025-06-15",
      openingBalance: "5000000",
      amount: "1000000",
      closingBalance: "6000000",
      bankCode: "BANK01",
      documentPath: "/docs/test.pdf",
    });
    expect(result.success).toBe(true);
  });

  it("should accept empty optional fields", () => {
    const result = depositEditSchema.safeParse({
      agentCode: "",
      virtualAccount: "",
      name: "",
      referenceNumber: "",
      depositDate: "",
      openingBalance: "",
      amount: "",
      closingBalance: "",
      bankCode: "",
      documentPath: "",
    });
    expect(result.success).toBe(true);
  });

  it("should accept partial data", () => {
    const result = depositEditSchema.safeParse({
      name: "John Doe",
      amount: "1000000",
    });
    expect(result.success).toBe(true);
  });

  it("should accept empty object (all optional)", () => {
    const result = depositEditSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("should reject agentCode exceeding 20 characters", () => {
    const result = depositEditSchema.safeParse({
      agentCode: "A".repeat(21),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("agentCode");
    }
  });

  it("should reject virtualAccount exceeding 18 characters", () => {
    const result = depositEditSchema.safeParse({
      virtualAccount: "1".repeat(19),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("virtualAccount");
    }
  });

  it("should reject name exceeding 255 characters", () => {
    const result = depositEditSchema.safeParse({
      name: "A".repeat(256),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("name");
    }
  });

  it("should reject referenceNumber exceeding 255 characters", () => {
    const result = depositEditSchema.safeParse({
      referenceNumber: "A".repeat(256),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("referenceNumber");
    }
  });

  it("should reject bankCode exceeding 20 characters", () => {
    const result = depositEditSchema.safeParse({
      bankCode: "A".repeat(21),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("bankCode");
    }
  });

  it("should accept documentFile as File instance", () => {
    const file = new File(["test"], "test.pdf", { type: "application/pdf" });
    const result = depositEditSchema.safeParse({
      documentFile: file,
    });
    expect(result.success).toBe(true);
  });

  it("should reject documentFile as non-File", () => {
    const result = depositEditSchema.safeParse({
      documentFile: "not-a-file",
    });
    expect(result.success).toBe(false);
  });

  it("should allow undefined values for all fields", () => {
    const result = depositEditSchema.safeParse({
      agentCode: undefined,
      virtualAccount: undefined,
      name: undefined,
      referenceNumber: undefined,
      depositDate: undefined,
      openingBalance: undefined,
      amount: undefined,
      closingBalance: undefined,
      bankCode: undefined,
      documentPath: undefined,
      documentFile: undefined,
    });
    expect(result.success).toBe(true);
  });
});

describe("sendStatusUpdateSchema", () => {
  it("should accept sendStatus 0", () => {
    const result = sendStatusUpdateSchema.safeParse({ sendStatus: "0" });
    expect(result.success).toBe(true);
  });

  it("should accept sendStatus 1", () => {
    const result = sendStatusUpdateSchema.safeParse({ sendStatus: "1" });
    expect(result.success).toBe(true);
  });

  it("should reject sendStatus 2", () => {
    const result = sendStatusUpdateSchema.safeParse({ sendStatus: "2" });
    expect(result.success).toBe(false);
  });

  it("should reject sendStatus as number", () => {
    const result = sendStatusUpdateSchema.safeParse({ sendStatus: 0 });
    expect(result.success).toBe(false);
  });

  it("should reject empty sendStatus", () => {
    const result = sendStatusUpdateSchema.safeParse({ sendStatus: "" });
    expect(result.success).toBe(false);
  });

  it("should reject missing sendStatus", () => {
    const result = sendStatusUpdateSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
