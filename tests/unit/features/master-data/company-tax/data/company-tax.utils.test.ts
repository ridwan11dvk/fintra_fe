import { describe, expect, it } from "vitest";
import {
  COMPANY_TAX_BASE,
  COMPANY_TAX_CREATE_PERMISSION,
  COMPANY_TAX_DELETE_PERMISSION,
  COMPANY_TAX_LIST_PAGE_TITLE,
  COMPANY_TAX_LIST_PERMISSION,
  COMPANY_TAX_PERMISSION,
  COMPANY_TAX_READ_PERMISSION,
  COMPANY_TAX_UPDATE_PERMISSION,
  COMPANY_TAX_URL,
} from "@/features/master-data/company-tax/data/company-tax.utils";

describe("company-tax.utils", () => {
  describe("URL constants", () => {
    it("has correct COMPANY_TAX_LIST_PAGE_TITLE", () => {
      expect(COMPANY_TAX_LIST_PAGE_TITLE).toBe("Tax Assignment");
    });

    it("has correct COMPANY_TAX_BASE", () => {
      expect(COMPANY_TAX_BASE).toBe("company-tax");
    });

    it("has correct COMPANY_TAX_URL", () => {
      expect(COMPANY_TAX_URL).toBe("/master-data/company-tax");
    });
  });

  describe("permission constants", () => {
    it("has correct COMPANY_TAX_PERMISSION prefix", () => {
      expect(COMPANY_TAX_PERMISSION).toBe("master-data:company-tax:");
    });

    it("has correct COMPANY_TAX_LIST_PERMISSION", () => {
      expect(COMPANY_TAX_LIST_PERMISSION).toBe("master-data:company-tax:list");
    });

    it("has correct COMPANY_TAX_READ_PERMISSION", () => {
      expect(COMPANY_TAX_READ_PERMISSION).toBe("master-data:company-tax:read");
    });

    it("has correct COMPANY_TAX_CREATE_PERMISSION", () => {
      expect(COMPANY_TAX_CREATE_PERMISSION).toBe(
        "master-data:company-tax:create",
      );
    });

    it("has correct COMPANY_TAX_UPDATE_PERMISSION", () => {
      expect(COMPANY_TAX_UPDATE_PERMISSION).toBe(
        "master-data:company-tax:update",
      );
    });

    it("has correct COMPANY_TAX_DELETE_PERMISSION", () => {
      expect(COMPANY_TAX_DELETE_PERMISSION).toBe(
        "master-data:company-tax:delete",
      );
    });

    it("all action permissions start with COMPANY_TAX_PERMISSION prefix", () => {
      const permissions = [
        COMPANY_TAX_LIST_PERMISSION,
        COMPANY_TAX_READ_PERMISSION,
        COMPANY_TAX_CREATE_PERMISSION,
        COMPANY_TAX_UPDATE_PERMISSION,
        COMPANY_TAX_DELETE_PERMISSION,
      ];

      permissions.forEach((permission) => {
        expect(permission).toMatch(/^master-data:company-tax:/);
      });
    });

    it("all action permissions are distinct", () => {
      const permissions = [
        COMPANY_TAX_LIST_PERMISSION,
        COMPANY_TAX_READ_PERMISSION,
        COMPANY_TAX_CREATE_PERMISSION,
        COMPANY_TAX_UPDATE_PERMISSION,
        COMPANY_TAX_DELETE_PERMISSION,
      ];
      const unique = new Set(permissions);
      expect(unique.size).toBe(permissions.length);
    });
  });
});
