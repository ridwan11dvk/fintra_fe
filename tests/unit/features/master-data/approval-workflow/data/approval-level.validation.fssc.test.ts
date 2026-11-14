import {
  validateBasicFields,
  validateLimitRow,
  validateLimits,
} from "@/features/master-data/approval-workflow/data/approval-level.validation";
import {
  APPROVAL_WORKFLOW_CREATE_URL,
  APPROVAL_WORKFLOW_URL,
  formatNumberWithCommas,
  getApprovalWorkflowDetailUrl,
  getLayerBadgeVariant,
} from "@/features/master-data/approval-workflow/data/approval-workflow.utils";
import { describe, expect, it } from "vitest";

describe("approval-workflow validation FSSC-APW", () => {
  it("FSSC-APW-005: create route is available for Add form", () => {
    expect(APPROVAL_WORKFLOW_CREATE_URL).toBe(
      `${APPROVAL_WORKFLOW_URL}/create`,
    );
  });

  it("FSSC-APW-006: incomplete basic fields keep Save blocked", () => {
    expect(validateBasicFields("", "", "", "manually", "")).toBeTruthy();
  });

  it("FSSC-APW-007: basic fields + role complete for manual Save enablement", () => {
    expect(
      validateBasicFields(
        "BUSINESS_LAYER",
        "Unit Verification",
        "Verified",
        "manually",
        "Approver",
      ),
    ).toBeNull();
  });

  it("FSSC-APW-012 / FSSC-APW-018: Stage Process Category wajib dipilih", () => {
    expect(
      validateBasicFields(
        "",
        "Unit Verification",
        "Verified",
        "manually",
        "Approver",
      ),
    ).toMatch(/Stage Process Category/i);
  });

  it("FSSC-APW-013 / FSSC-APW-019: Stage Process Name wajib dipilih", () => {
    expect(
      validateBasicFields(
        "BUSINESS_LAYER",
        "",
        "Verified",
        "manually",
        "Approver",
      ),
    ).toMatch(/Stage Process Name/i);
  });

  it("FSSC-APW-016: Role Name wajib bila Select Manually", () => {
    expect(
      validateBasicFields(
        "BUSINESS_LAYER",
        "Unit Verification",
        "Verified",
        "manually",
        "",
      ),
    ).toMatch(/Role Name/i);
  });

  it("FSSC-APW-020: Output Step wajib diisi", () => {
    expect(
      validateBasicFields(
        "BUSINESS_LAYER",
        "Unit Verification",
        "",
        "manually",
        "Approver",
      ),
    ).toMatch(/Output Step/i);
  });

  it("FSSC-APW-021: manual role setting is the default validation path", () => {
    expect(
      validateBasicFields(
        "BUSINESS_LAYER",
        "Unit Verification",
        "Verified",
        "manually",
        "Approver",
      ),
    ).toBeNull();
  });

  it("FSSC-APW-022: chip kategori tampil dengan warna berbeda per kategori", () => {
    expect(getLayerBadgeVariant("BUSINESS_LAYER")).toBe("info-outline");
    expect(getLayerBadgeVariant("FSSC")).toBe("success-outline");
    expect(getLayerBadgeVariant("FINANCIAL")).toBe("warning-outline");
    expect(getLayerBadgeVariant("TREASURY")).toBe("indigo-outline");
  });

  it("FSSC-APW-024: limit-based multi tier validates contiguous ranges", () => {
    const limits = [
      { minAmount: "0", maxAmount: "1000000", roleName: "Staff" },
      { minAmount: "1000000", maxAmount: "5000000", roleName: "Manager" },
    ];
    expect(validateLimits(limits, ["Staff", "Manager"])).toBeNull();
  });

  it("FSSC-APW-025: setiap tier wajib mengisi Limit Amount dan Role Name", () => {
    expect(
      validateLimits(
        [{ minAmount: "0", maxAmount: "0", roleName: "" }],
        ["Staff"],
      ),
    ).toBeTruthy();
  });

  it("FSSC-APW-026: Nilai dari harus lebih kecil daripada Nilai sampai", () => {
    expect(
      validateLimitRow(
        [
          { minAmount: "0", maxAmount: "100", roleName: "Staff" },
          { minAmount: "100", maxAmount: "50", roleName: "Manager" },
        ],
        1,
        { minAmount: "100", maxAmount: "50", roleName: "Manager" },
        ["Staff", "Manager"],
      ),
    ).toMatch(/greater than minimum/i);
  });

  it("FSSC-APW-027 / FSSC-APW-028: menolak overlap antar tier Limit Amount", () => {
    const limits = [
      { minAmount: "0", maxAmount: "1000000", roleName: "Staff" },
      { minAmount: "500000", maxAmount: "2000000", roleName: "Manager" },
    ];
    expect(validateLimits(limits, ["Staff", "Manager"])).toMatch(
      /previous maximum/i,
    );
  });

  it("FSSC-APW-029: error gap/overlap hilang setelah rentang diperbaiki", () => {
    const fixed = [
      { minAmount: "0", maxAmount: "1000000", roleName: "Staff" },
      { minAmount: "1000000", maxAmount: "2000000", roleName: "Manager" },
    ];
    expect(validateLimits(fixed, ["Staff", "Manager"])).toBeNull();
  });

  it("FSSC-APW-035: tidak dapat menyimpan workflow tanpa minimal 1 level/limit", () => {
    expect(validateLimits([], ["Staff"])).toMatch(/at least one limit/i);
  });

  it("FSSC-APW-037: detail URL builder for View Detail", () => {
    expect(getApprovalWorkflowDetailUrl(12)).toBe(
      `${APPROVAL_WORKFLOW_URL}/12`,
    );
  });

  it("FSSC-APW-056: Limit Based formats nominal tiers with commas", () => {
    expect(formatNumberWithCommas("1000000")).toBe("1,000,000");
  });

  it("FSSC-APW-057: Select Manually skips limit tier requirement when role present", () => {
    expect(
      validateBasicFields(
        "BUSINESS_LAYER",
        "Unit Verification",
        "Verified",
        "manually",
        "Approver",
      ),
    ).toBeNull();
  });
});
