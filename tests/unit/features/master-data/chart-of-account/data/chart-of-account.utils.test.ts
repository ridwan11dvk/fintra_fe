import { describe, expect, it } from "vitest";
import {
  CHART_OF_ACCOUNT_BASE,
  CHART_OF_ACCOUNT_CREATE_PAGE_TITLE,
  CHART_OF_ACCOUNT_CREATE_PERMISSION,
  CHART_OF_ACCOUNT_CREATE_URL,
  CHART_OF_ACCOUNT_DELETE_PERMISSION,
  CHART_OF_ACCOUNT_DETAIL_PAGE_TITLE,
  CHART_OF_ACCOUNT_EDIT_PAGE_TITLE,
  CHART_OF_ACCOUNT_EXPORT_PERMISSION,
  CHART_OF_ACCOUNT_IMPORT_PERMISSION,
  CHART_OF_ACCOUNT_LIST_PAGE_TITLE,
  CHART_OF_ACCOUNT_LIST_PERMISSION,
  CHART_OF_ACCOUNT_PERMISSION,
  CHART_OF_ACCOUNT_READ_PERMISSION,
  CHART_OF_ACCOUNT_UPDATE_PERMISSION,
  CHART_OF_ACCOUNT_URL,
  getChartOfAccountDetailUrl,
  getChartOfAccountEditUrl,
} from "@/features/master-data/chart-of-account/data/chart-of-account.utils";

describe("chart-of-account.utils", () => {
  describe("URL constants and helpers", () => {
    it("has correct page titles", () => {
      expect(CHART_OF_ACCOUNT_LIST_PAGE_TITLE).toBe("Chart of Account");
      expect(CHART_OF_ACCOUNT_CREATE_PAGE_TITLE).toBe("Add Chart of Account");
      expect(CHART_OF_ACCOUNT_EDIT_PAGE_TITLE).toBe("Edit Chart of Account");
      expect(CHART_OF_ACCOUNT_DETAIL_PAGE_TITLE).toBe("View Chart of Account");
    });

    it("has correct base and route URLs", () => {
      expect(CHART_OF_ACCOUNT_BASE).toBe("chart-of-account");
      expect(CHART_OF_ACCOUNT_URL).toBe("/master-data/chart-of-account");
      expect(CHART_OF_ACCOUNT_CREATE_URL).toBe(
        "/master-data/chart-of-account/create",
      );
    });

    it("generates correct detail URL", () => {
      expect(getChartOfAccountDetailUrl(1)).toBe(
        "/master-data/chart-of-account/1",
      );
      expect(getChartOfAccountDetailUrl("abc")).toBe(
        "/master-data/chart-of-account/abc",
      );
    });

    it("generates correct edit URL", () => {
      expect(getChartOfAccountEditUrl(1)).toBe(
        "/master-data/chart-of-account/1/edit",
      );
      expect(getChartOfAccountEditUrl("xyz")).toBe(
        "/master-data/chart-of-account/xyz/edit",
      );
    });
  });

  describe("Permission constants", () => {
    it("has correct base permission prefix", () => {
      expect(CHART_OF_ACCOUNT_PERMISSION).toBe(
        "master-data:chart-of-account:",
      );
    });

    it("has correct individual permissions", () => {
      expect(CHART_OF_ACCOUNT_LIST_PERMISSION).toBe(
        "master-data:chart-of-account:list",
      );
      expect(CHART_OF_ACCOUNT_READ_PERMISSION).toBe(
        "master-data:chart-of-account:read",
      );
      expect(CHART_OF_ACCOUNT_CREATE_PERMISSION).toBe(
        "master-data:chart-of-account:create",
      );
      expect(CHART_OF_ACCOUNT_UPDATE_PERMISSION).toBe(
        "master-data:chart-of-account:update",
      );
      expect(CHART_OF_ACCOUNT_DELETE_PERMISSION).toBe(
        "master-data:chart-of-account:delete",
      );
      expect(CHART_OF_ACCOUNT_EXPORT_PERMISSION).toBe(
        "master-data:chart-of-account:export",
      );
      expect(CHART_OF_ACCOUNT_IMPORT_PERMISSION).toBe(
        "master-data:chart-of-account:import",
      );
    });

    it("all action permissions start with prefix", () => {
      const permissions = [
        CHART_OF_ACCOUNT_LIST_PERMISSION,
        CHART_OF_ACCOUNT_READ_PERMISSION,
        CHART_OF_ACCOUNT_CREATE_PERMISSION,
        CHART_OF_ACCOUNT_UPDATE_PERMISSION,
        CHART_OF_ACCOUNT_DELETE_PERMISSION,
        CHART_OF_ACCOUNT_EXPORT_PERMISSION,
        CHART_OF_ACCOUNT_IMPORT_PERMISSION,
      ];
      permissions.forEach((perm) => {
        expect(perm.startsWith(CHART_OF_ACCOUNT_PERMISSION)).toBe(true);
      });
    });
  });
});
