import { describe, expect, it } from "vitest";
import {
  PARTNER_CATEGORY_BASE,
  PARTNER_CATEGORY_CREATE_PERMISSION,
  PARTNER_CATEGORY_DELETE_PERMISSION,
  PARTNER_CATEGORY_LIST_PAGE_TITLE,
  PARTNER_CATEGORY_LIST_PERMISSION,
  PARTNER_CATEGORY_PERMISSION,
  PARTNER_CATEGORY_READ_PERMISSION,
  PARTNER_CATEGORY_UPDATE_PERMISSION,
  PARTNER_CATEGORY_URL,
} from "@/features/master-data/partner-category/data/partner-category.utils";

describe("partner-category.utils", () => {
  describe("URL constants", () => {
    it("has correct PARTNER_CATEGORY_LIST_PAGE_TITLE", () => {
      expect(PARTNER_CATEGORY_LIST_PAGE_TITLE).toBe("Partner Category");
    });

    it("has correct PARTNER_CATEGORY_BASE", () => {
      expect(PARTNER_CATEGORY_BASE).toBe("partner-category");
    });

    it("has correct PARTNER_CATEGORY_URL", () => {
      expect(PARTNER_CATEGORY_URL).toBe(
        "/master-data/partner-category",
      );
    });
  });

  describe("permission constants", () => {
    it("has correct PARTNER_CATEGORY_PERMISSION prefix", () => {
      expect(PARTNER_CATEGORY_PERMISSION).toBe(
        "master-data:partner-category:",
      );
    });

    it("has correct PARTNER_CATEGORY_LIST_PERMISSION", () => {
      expect(PARTNER_CATEGORY_LIST_PERMISSION).toBe(
        "master-data:partner-category:list",
      );
    });

    it("has correct PARTNER_CATEGORY_READ_PERMISSION", () => {
      expect(PARTNER_CATEGORY_READ_PERMISSION).toBe(
        "master-data:partner-category:read",
      );
    });

    it("has correct PARTNER_CATEGORY_CREATE_PERMISSION", () => {
      expect(PARTNER_CATEGORY_CREATE_PERMISSION).toBe(
        "master-data:partner-category:create",
      );
    });

    it("has correct PARTNER_CATEGORY_UPDATE_PERMISSION", () => {
      expect(PARTNER_CATEGORY_UPDATE_PERMISSION).toBe(
        "master-data:partner-category:update",
      );
    });

    it("has correct PARTNER_CATEGORY_DELETE_PERMISSION", () => {
      expect(PARTNER_CATEGORY_DELETE_PERMISSION).toBe(
        "master-data:partner-category:delete",
      );
    });

    it("all action permissions start with PARTNER_CATEGORY_PERMISSION prefix", () => {
      const permissions = [
        PARTNER_CATEGORY_LIST_PERMISSION,
        PARTNER_CATEGORY_READ_PERMISSION,
        PARTNER_CATEGORY_CREATE_PERMISSION,
        PARTNER_CATEGORY_UPDATE_PERMISSION,
        PARTNER_CATEGORY_DELETE_PERMISSION,
      ];

      permissions.forEach((permission) => {
        expect(permission).toMatch(
          /^master-data:partner-category:/,
        );
      });
    });

    it("all action permissions are distinct", () => {
      const permissions = [
        PARTNER_CATEGORY_LIST_PERMISSION,
        PARTNER_CATEGORY_READ_PERMISSION,
        PARTNER_CATEGORY_CREATE_PERMISSION,
        PARTNER_CATEGORY_UPDATE_PERMISSION,
        PARTNER_CATEGORY_DELETE_PERMISSION,
      ];
      const unique = new Set(permissions);
      expect(unique.size).toBe(permissions.length);
    });
  });
});
