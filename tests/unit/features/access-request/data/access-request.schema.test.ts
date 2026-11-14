import { describe, expect, it } from "vitest";
import { changeAccessRequestStatusSchema } from "@/features/access-request/data/access-request.schema";
import { accessRequestListParamsSchema } from "@/features/access-request/data/access-request.schema";
import { rejectAccessRequestSchema } from "@/features/access-request/data/access-request.schema";
import { approveAccessRequestSchema } from "@/features/access-request/data/access-request.schema";

describe("changeAccessRequestStatusSchema", () => {
  it("accepts APPROVED status with roles", () => {
    const result = changeAccessRequestStatusSchema.safeParse({
      status: "APPROVED",
      roles: [1, 2],
    });
    expect(result.success).toBe(true);
  });

  it("accepts REJECTED status with empty roles", () => {
    const result = changeAccessRequestStatusSchema.safeParse({
      status: "REJECTED",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid status", () => {
    const result = changeAccessRequestStatusSchema.safeParse({
      status: "INVALID",
    });
    expect(result.success).toBe(false);
  });

  it("rejects responseNotes exceeding 1000 characters", () => {
    const result = changeAccessRequestStatusSchema.safeParse({
      status: "APPROVED",
      roles: [1],
      responseNotes: "A".repeat(1001),
    });
    expect(result.success).toBe(false);
  });

  it("accepts responseNotes at exactly 1000 characters", () => {
    const result = changeAccessRequestStatusSchema.safeParse({
      status: "APPROVED",
      roles: [1],
      responseNotes: "A".repeat(1000),
    });
    expect(result.success).toBe(true);
  });
});

describe("accessRequestListParamsSchema", () => {
  it("uses defaults for empty input", () => {
    const result = accessRequestListParamsSchema.parse({});
    expect(result.page).toBe(0);
    expect(result.size).toBe(20);
    expect(result.search).toBeUndefined();
    expect(result.status).toBeUndefined();
  });

  it("accepts status filter", () => {
    const result = accessRequestListParamsSchema.parse({
      status: "PENDING",
    });
    expect(result.status).toBe("PENDING");
  });

  it("accepts all valid status values", () => {
    expect(
      accessRequestListParamsSchema.parse({ status: "APPROVED" }).status,
    ).toBe("APPROVED");
    expect(
      accessRequestListParamsSchema.parse({ status: "REJECTED" }).status,
    ).toBe("REJECTED");
  });

  it("rejects negative page number", () => {
    const result = accessRequestListParamsSchema.safeParse({
      page: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects size exceeding 100", () => {
    const result = accessRequestListParamsSchema.safeParse({
      size: 101,
    });
    expect(result.success).toBe(false);
  });

  it("rejects size less than 1", () => {
    const result = accessRequestListParamsSchema.safeParse({
      size: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid status value", () => {
    const result = accessRequestListParamsSchema.safeParse({
      status: "CANCELLED",
    });
    expect(result.success).toBe(false);
  });
});

describe("rejectAccessRequestSchema", () => {
  it("rejects empty rejectionReason", () => {
    const result = rejectAccessRequestSchema.safeParse({
      rejectionReason: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid rejectionReason", () => {
    const result = rejectAccessRequestSchema.safeParse({
      rejectionReason: "Insufficient documentation",
    });
    expect(result.success).toBe(true);
  });

  it("rejects rejectionReason exceeding 500 characters", () => {
    const result = rejectAccessRequestSchema.safeParse({
      rejectionReason: "A".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("accepts rejectionReason at exactly 500 characters", () => {
    const result = rejectAccessRequestSchema.safeParse({
      rejectionReason: "A".repeat(500),
    });
    expect(result.success).toBe(true);
  });
});

describe("approveAccessRequestSchema", () => {
  it("rejects empty roles array", () => {
    const result = approveAccessRequestSchema.safeParse({
      roles: [],
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid roles and optional responseNotes", () => {
    const result = approveAccessRequestSchema.safeParse({
      roles: [1, 2],
      responseNotes: "Approved",
    });
    expect(result.success).toBe(true);
  });

  it("rejects responseNotes exceeding 500 characters", () => {
    const result = approveAccessRequestSchema.safeParse({
      roles: [1],
      responseNotes: "A".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("accepts responseNotes at exactly 500 characters", () => {
    const result = approveAccessRequestSchema.safeParse({
      roles: [1],
      responseNotes: "A".repeat(500),
    });
    expect(result.success).toBe(true);
  });
});
