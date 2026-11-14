import { describe, expect, it } from "vitest";
import {
  APPROVAL_WORKFLOW_BASE,
  APPROVAL_WORKFLOW_CREATE_PAGE_TITLE,
  APPROVAL_WORKFLOW_CREATE_PERMISSION,
  APPROVAL_WORKFLOW_CREATE_URL,
  APPROVAL_WORKFLOW_DELETE_PERMISSION,
  APPROVAL_WORKFLOW_DETAIL_PAGE_TITLE,
  APPROVAL_WORKFLOW_EDIT_PAGE_TITLE,
  APPROVAL_WORKFLOW_LIST_PAGE_TITLE,
  APPROVAL_WORKFLOW_LIST_PERMISSION,
  APPROVAL_WORKFLOW_PERMISSION,
  APPROVAL_WORKFLOW_READ_PERMISSION,
  APPROVAL_WORKFLOW_UPDATE_PERMISSION,
  APPROVAL_WORKFLOW_URL,
  formatNumberWithCommas,
  formatSummarySla,
  getApprovalWorkflowDetailUrl,
  getApprovalWorkflowEditUrl,
  getLayerBadgeVariant,
} from "@/features/master-data/approval-workflow/data/approval-workflow.utils";

describe("approval-workflow.utils", () => {
  describe("URL & Title constants", () => {
    it("has correct list page title and base url", () => {
      expect(APPROVAL_WORKFLOW_LIST_PAGE_TITLE).toBe("Approval Workflow");
      expect(APPROVAL_WORKFLOW_BASE).toBe("approval-workflow");
      expect(APPROVAL_WORKFLOW_URL).toBe("/master-data/approval-workflow");
    });

    it("has correct create page title and create url", () => {
      expect(APPROVAL_WORKFLOW_CREATE_PAGE_TITLE).toBe("Add Approval Workflow");
      expect(APPROVAL_WORKFLOW_CREATE_URL).toBe(
        "/master-data/approval-workflow/create",
      );
    });

    it("has correct edit and detail page titles", () => {
      expect(APPROVAL_WORKFLOW_EDIT_PAGE_TITLE).toBe("Edit Approval Workflow");
      expect(APPROVAL_WORKFLOW_DETAIL_PAGE_TITLE).toBe("View Approval Workflow");
    });

    it("builds correct detail URL via getApprovalWorkflowDetailUrl()", () => {
      expect(getApprovalWorkflowDetailUrl("SUPPLIER_PAYMENT")).toBe(
        "/master-data/approval-workflow/SUPPLIER_PAYMENT",
      );
    });

    it("builds correct edit URL via getApprovalWorkflowEditUrl()", () => {
      expect(getApprovalWorkflowEditUrl("SUPPLIER_PAYMENT")).toBe(
        "/master-data/approval-workflow/SUPPLIER_PAYMENT/edit",
      );
    });
  });

  describe("getLayerBadgeVariant()", () => {
    it("returns 'info-outline' for business layer", () => {
      expect(getLayerBadgeVariant("BUSINESS_LAYER")).toBe("info-outline");
      expect(getLayerBadgeVariant("business layer")).toBe("info-outline");
      expect(getLayerBadgeVariant("Business-Layer")).toBe("info-outline");
    });

    it("returns 'success-outline' for FSSC layer", () => {
      expect(getLayerBadgeVariant("FSSC_POP")).toBe("success-outline");
      expect(getLayerBadgeVariant("FSSC")).toBe("success-outline");
      expect(getLayerBadgeVariant("fssc pop")).toBe("success-outline");
    });

    it("returns 'warning-outline' for financial layer", () => {
      expect(getLayerBadgeVariant("FINANCIAL")).toBe("warning-outline");
      expect(getLayerBadgeVariant("FINANCE")).toBe("warning-outline");
      expect(getLayerBadgeVariant("financial")).toBe("warning-outline");
    });

    it("returns 'indigo-outline' for treasury layer", () => {
      expect(getLayerBadgeVariant("TREASURY")).toBe("indigo-outline");
      expect(getLayerBadgeVariant("treasury")).toBe("indigo-outline");
    });

    it("returns 'outline' for unknown or empty layer", () => {
      expect(getLayerBadgeVariant("UNKNOWN")).toBe("outline");
      expect(getLayerBadgeVariant("")).toBe("outline");
    });
  });

  describe("permission constants", () => {
    it("has correct APPROVAL_WORKFLOW_PERMISSION prefix", () => {
      expect(APPROVAL_WORKFLOW_PERMISSION).toBe(
        "master-data:approval-workflow:",
      );
    });

    it("has correct action permissions", () => {
      expect(APPROVAL_WORKFLOW_LIST_PERMISSION).toBe(
        "master-data:approval-workflow:list",
      );
      expect(APPROVAL_WORKFLOW_READ_PERMISSION).toBe(
        "master-data:approval-workflow:read",
      );
      expect(APPROVAL_WORKFLOW_CREATE_PERMISSION).toBe(
        "master-data:approval-workflow:create",
      );
      expect(APPROVAL_WORKFLOW_UPDATE_PERMISSION).toBe(
        "master-data:approval-workflow:update",
      );
      expect(APPROVAL_WORKFLOW_DELETE_PERMISSION).toBe(
        "master-data:approval-workflow:delete",
      );
    });

    it("all action permissions start with APPROVAL_WORKFLOW_PERMISSION prefix", () => {
      const permissions = [
        APPROVAL_WORKFLOW_LIST_PERMISSION,
        APPROVAL_WORKFLOW_READ_PERMISSION,
        APPROVAL_WORKFLOW_CREATE_PERMISSION,
        APPROVAL_WORKFLOW_UPDATE_PERMISSION,
        APPROVAL_WORKFLOW_DELETE_PERMISSION,
      ];
      permissions.forEach((perm) => {
        expect(perm.startsWith(APPROVAL_WORKFLOW_PERMISSION)).toBe(true);
      });
    });
  });

  describe("formatNumberWithCommas()", () => {
    it("formats numbers and numeric strings with thousands commas", () => {
      expect(formatNumberWithCommas("5000000")).toBe("5,000,000");
      expect(formatNumberWithCommas(5000000)).toBe("5,000,000");
      expect(formatNumberWithCommas("123123")).toBe("123,123");
      expect(formatNumberWithCommas("2000000")).toBe("2,000,000");
    });

    it("handles zero and leading zeros correctly", () => {
      expect(formatNumberWithCommas("0")).toBe("0");
      expect(formatNumberWithCommas(0)).toBe("0");
      expect(formatNumberWithCommas("00")).toBe("0");
      expect(formatNumberWithCommas("05")).toBe("5");
      expect(formatNumberWithCommas("007")).toBe("7");
    });

    it("handles already formatted strings without duplicating commas", () => {
      expect(formatNumberWithCommas("5,000,000")).toBe("5,000,000");
      expect(formatNumberWithCommas("5,000,000,000")).toBe("5,000,000,000");
    });

    it("returns empty string for empty or non-numeric inputs", () => {
      expect(formatNumberWithCommas("")).toBe("");
      expect(formatNumberWithCommas(null)).toBe("");
      expect(formatNumberWithCommas(undefined)).toBe("");
      expect(formatNumberWithCommas("abc")).toBe("");
    });
  });

  describe("formatSummarySla()", () => {
    it("appends 'day' to raw numbers or numeric strings", () => {
      expect(formatSummarySla(72)).toBe("72 day");
      expect(formatSummarySla("72")).toBe("72 day");
      expect(formatSummarySla(0)).toBe("0 day");
    });

    it("does not duplicate 'day' or 'days' if already present", () => {
      expect(formatSummarySla("72 day")).toBe("72 day");
      expect(formatSummarySla("72 days")).toBe("72 days");
      expect(formatSummarySla("100 Day")).toBe("100 Day");
    });

    it("returns '-' for empty or nullish values", () => {
      expect(formatSummarySla("")).toBe("-");
      expect(formatSummarySla(null)).toBe("-");
      expect(formatSummarySla(undefined)).toBe("-");
    });
  });
});
