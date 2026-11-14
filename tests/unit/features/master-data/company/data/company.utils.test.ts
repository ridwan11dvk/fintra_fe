import { describe, expect, it } from "vitest";
import {
  COMPANY_BASE,
  COMPANY_CREATE_PAGE_TITLE,
  COMPANY_CREATE_PERMISSION,
  COMPANY_DELETE_PERMISSION,
  COMPANY_DETAIL_PAGE_TITLE,
  COMPANY_LIST_PAGE_TITLE,
  COMPANY_LIST_PERMISSION,
  COMPANY_PERMISSION,
  COMPANY_READ_PERMISSION,
  COMPANY_UPDATE_PAGE_TITLE,
  COMPANY_UPDATE_PERMISSION,
  COMPANY_URL,
  companyCreateUrl,
  companyDetailUrl,
  companyEditUrl,
} from "@/features/master-data/company/data/company.utils";

describe("company.utils", () => {
  describe("URL constants", () => {
    it("has correct COMPANY_LIST_PAGE_TITLE", () => {
      expect(COMPANY_LIST_PAGE_TITLE).toBe("Companies");
    });

    it("has correct COMPANY_BASE", () => {
      expect(COMPANY_BASE).toBe("company");
    });

    it("has correct COMPANY_URL", () => {
      expect(COMPANY_URL).toBe("/master-data/company");
    });

    it("has correct COMPANY_CREATE_PAGE_TITLE", () => {
      expect(COMPANY_CREATE_PAGE_TITLE).toBe("Create Company");
    });

    it("has correct COMPANY_UPDATE_PAGE_TITLE", () => {
      expect(COMPANY_UPDATE_PAGE_TITLE).toBe("Edit Company");
    });

    it("has correct COMPANY_DETAIL_PAGE_TITLE", () => {
      expect(COMPANY_DETAIL_PAGE_TITLE).toBe("Company Details");
    });
  });

  describe("URL builder functions", () => {
    it("companyCreateUrl returns correct create URL", () => {
      expect(companyCreateUrl()).toBe("/master-data/company/create");
    });

    it("companyDetailUrl returns correct detail URL with numeric ID", () => {
      expect(companyDetailUrl(5)).toBe("/master-data/company/5/show");
    });

    it("companyDetailUrl returns correct detail URL with string ID", () => {
      expect(companyDetailUrl("abc123")).toBe(
        "/master-data/company/abc123/show",
      );
    });

    it("companyEditUrl returns correct edit URL with numeric ID", () => {
      expect(companyEditUrl(5)).toBe("/master-data/company/5/edit");
    });

    it("companyEditUrl returns correct edit URL with string ID", () => {
      expect(companyEditUrl("abc123")).toBe("/master-data/company/abc123/edit");
    });
  });

  describe("permission constants", () => {
    it("has correct COMPANY_PERMISSION prefix", () => {
      expect(COMPANY_PERMISSION).toBe("master-data:company:");
    });

    it("has correct COMPANY_LIST_PERMISSION", () => {
      expect(COMPANY_LIST_PERMISSION).toBe("master-data:company:list");
    });

    it("has correct COMPANY_READ_PERMISSION", () => {
      expect(COMPANY_READ_PERMISSION).toBe("master-data:company:read");
    });

    it("has correct COMPANY_CREATE_PERMISSION", () => {
      expect(COMPANY_CREATE_PERMISSION).toBe("master-data:company:create");
    });

    it("has correct COMPANY_UPDATE_PERMISSION", () => {
      expect(COMPANY_UPDATE_PERMISSION).toBe("master-data:company:update");
    });

    it("has correct COMPANY_DELETE_PERMISSION", () => {
      expect(COMPANY_DELETE_PERMISSION).toBe("master-data:company:delete");
    });

    it("all action permissions start with COMPANY_PERMISSION prefix", () => {
      const permissions = [
        COMPANY_LIST_PERMISSION,
        COMPANY_READ_PERMISSION,
        COMPANY_CREATE_PERMISSION,
        COMPANY_UPDATE_PERMISSION,
        COMPANY_DELETE_PERMISSION,
      ];

      permissions.forEach((permission) => {
        expect(permission).toMatch(/^master-data:company:/);
      });
    });

    it("all action permissions are distinct", () => {
      const permissions = [
        COMPANY_LIST_PERMISSION,
        COMPANY_READ_PERMISSION,
        COMPANY_CREATE_PERMISSION,
        COMPANY_UPDATE_PERMISSION,
        COMPANY_DELETE_PERMISSION,
      ];

      expect(new Set(permissions).size).toBe(permissions.length);
    });
  });
});
