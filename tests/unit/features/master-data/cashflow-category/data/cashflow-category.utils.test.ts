import {
  CASHFLOW_CATEGORY_BASE,
  CASHFLOW_CATEGORY_CREATE_PAGE_TITLE,
  CASHFLOW_CATEGORY_CREATE_PERMISSION,
  CASHFLOW_CATEGORY_CREATE_URL,
  CASHFLOW_CATEGORY_DELETE_PERMISSION,
  CASHFLOW_CATEGORY_DETAIL_PAGE_TITLE,
  CASHFLOW_CATEGORY_EDIT_PAGE_TITLE,
  CASHFLOW_CATEGORY_LIST_PAGE_TITLE,
  CASHFLOW_CATEGORY_LIST_PERMISSION,
  CASHFLOW_CATEGORY_PERMISSION,
  CASHFLOW_CATEGORY_READ_PERMISSION,
  CASHFLOW_CATEGORY_UPDATE_PERMISSION,
  CASHFLOW_CATEGORY_URL,
  getCashflowCategoryDetailUrl,
  getCashflowCategoryEditUrl,
} from "@/features/master-data/cashflow-category/data/cashflow-category.utils";
import { describe, expect, it } from "vitest";

describe("cashflow-category.utils", () => {
  describe("URL constants", () => {
    it("[FSSC-CFC-001] exposes list page title and routes", () => {
      expect(CASHFLOW_CATEGORY_LIST_PAGE_TITLE).toBe("Cashflow Category");
      expect(CASHFLOW_CATEGORY_BASE).toBe("cashflow-category");
      expect(CASHFLOW_CATEGORY_URL).toBe("/master-data/cashflow-category");
      expect(CASHFLOW_CATEGORY_CREATE_URL).toBe(
        "/master-data/cashflow-category/create",
      );
    });

    it("builds detail and edit URLs from id", () => {
      expect(getCashflowCategoryDetailUrl(5)).toBe(
        "/master-data/cashflow-category/5",
      );
      expect(getCashflowCategoryEditUrl("9")).toBe(
        "/master-data/cashflow-category/9/edit",
      );
    });

    it("[FSSC-CFC-011] exposes create/edit/detail page titles", () => {
      expect(CASHFLOW_CATEGORY_CREATE_PAGE_TITLE).toBe("Add Cashflow Category");
      expect(CASHFLOW_CATEGORY_EDIT_PAGE_TITLE).toBe("Edit Cashflow Category");
      expect(CASHFLOW_CATEGORY_DETAIL_PAGE_TITLE).toBe(
        "Detail Cashflow Category",
      );
    });
  });

  describe("permission constants", () => {
    it("uses the master-data cashflow-category permission prefix", () => {
      expect(CASHFLOW_CATEGORY_PERMISSION).toBe(
        "master-data:cashflow-category:",
      );
    });

    it("defines distinct list/read/create/update/delete permissions", () => {
      const permissions = [
        CASHFLOW_CATEGORY_LIST_PERMISSION,
        CASHFLOW_CATEGORY_READ_PERMISSION,
        CASHFLOW_CATEGORY_CREATE_PERMISSION,
        CASHFLOW_CATEGORY_UPDATE_PERMISSION,
        CASHFLOW_CATEGORY_DELETE_PERMISSION,
      ];

      permissions.forEach((permission) => {
        expect(permission).toMatch(/^master-data:cashflow-category:/);
      });
      expect(new Set(permissions).size).toBe(permissions.length);
    });
  });
});
