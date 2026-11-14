import {
  CASHFLOW_GROUP_BASE,
  CASHFLOW_GROUP_CREATE_PAGE_TITLE,
  CASHFLOW_GROUP_CREATE_PERMISSION,
  CASHFLOW_GROUP_CREATE_URL,
  CASHFLOW_GROUP_DELETE_PERMISSION,
  CASHFLOW_GROUP_DETAIL_PAGE_TITLE,
  CASHFLOW_GROUP_EDIT_PAGE_TITLE,
  CASHFLOW_GROUP_LIST_PAGE_TITLE,
  CASHFLOW_GROUP_LIST_PERMISSION,
  CASHFLOW_GROUP_PERMISSION,
  CASHFLOW_GROUP_READ_PERMISSION,
  CASHFLOW_GROUP_UPDATE_PERMISSION,
  CASHFLOW_GROUP_URL,
  CASHFLOW_TYPE_OPTIONS,
  getCashflowGroupDetailUrl,
  getCashflowGroupEditUrl,
  getCashflowTypeLabel,
  getExceptionLabel,
} from "@/features/master-data/cashflow-group/data/cashflow-group.utils";
import { describe, expect, it } from "vitest";

describe("cashflow-group.utils", () => {
  describe("URL constants", () => {
    it("[FSSC-CFG-001] exposes list page title and routes", () => {
      expect(CASHFLOW_GROUP_LIST_PAGE_TITLE).toBe("Cashflow Group");
      expect(CASHFLOW_GROUP_BASE).toBe("cashflow-group");
      expect(CASHFLOW_GROUP_URL).toBe("/master-data/cashflow-group");
      expect(CASHFLOW_GROUP_CREATE_URL).toBe(
        "/master-data/cashflow-group/create",
      );
    });

    it("builds detail and edit URLs from id", () => {
      expect(getCashflowGroupDetailUrl(12)).toBe(
        "/master-data/cashflow-group/12",
      );
      expect(getCashflowGroupEditUrl("3")).toBe(
        "/master-data/cashflow-group/3/edit",
      );
    });

    it("[FSSC-CFG-011] exposes create/edit/detail page titles", () => {
      expect(CASHFLOW_GROUP_CREATE_PAGE_TITLE).toBe("Add Cashflow Group");
      expect(CASHFLOW_GROUP_EDIT_PAGE_TITLE).toBe("Edit Cashflow Group");
      expect(CASHFLOW_GROUP_DETAIL_PAGE_TITLE).toBe("Detail Cashflow Group");
    });
  });

  describe("permission constants", () => {
    it("uses the master-data cashflow-group permission prefix", () => {
      expect(CASHFLOW_GROUP_PERMISSION).toBe("master-data:cashflow-group:");
    });

    it("defines distinct list/read/create/update/delete permissions", () => {
      const permissions = [
        CASHFLOW_GROUP_LIST_PERMISSION,
        CASHFLOW_GROUP_READ_PERMISSION,
        CASHFLOW_GROUP_CREATE_PERMISSION,
        CASHFLOW_GROUP_UPDATE_PERMISSION,
        CASHFLOW_GROUP_DELETE_PERMISSION,
      ];

      permissions.forEach((permission) => {
        expect(permission).toMatch(/^master-data:cashflow-group:/);
      });
      expect(new Set(permissions).size).toBe(permissions.length);
    });
  });

  describe("display helpers", () => {
    it("[FSSC-CFG-006] maps cashflow type values to labels", () => {
      expect(getCashflowTypeLabel("RECIPIENT_TARGET")).toBe("Recipient/Target");
      expect(getCashflowTypeLabel("PROVIDER")).toBe("Provider");
      expect(getCashflowTypeLabel("UNKNOWN")).toBe("—");
      expect(CASHFLOW_TYPE_OPTIONS).toHaveLength(2);
    });

    it("[FSSC-CFG-007] maps exception boolean to Yes/No", () => {
      expect(getExceptionLabel(true)).toBe("Yes");
      expect(getExceptionLabel(false)).toBe("No");
      expect(getExceptionLabel(null)).toBe("—");
    });
  });
});
