import { describe, expect, it } from "vitest";
import {
  TAXABLE_ITEM_BASE,
  TAXABLE_ITEM_CREATE_PERMISSION,
  TAXABLE_ITEM_DELETE_PERMISSION,
  TAXABLE_ITEM_LIST_PAGE_TITLE,
  TAXABLE_ITEM_LIST_PERMISSION,
  TAXABLE_ITEM_PERMISSION,
  TAXABLE_ITEM_READ_PERMISSION,
  TAXABLE_ITEM_UPDATE_PERMISSION,
  TAXABLE_ITEM_URL,
} from "@/features/master-data/taxable-item/data/taxable-item.utils";

describe("taxable-item.utils", () => {
  describe("URL constants", () => {
    it("has correct TAXABLE_ITEM_LIST_PAGE_TITLE", () => {
      expect(TAXABLE_ITEM_LIST_PAGE_TITLE).toBe("Taxable Item");
    });

    it("has correct TAXABLE_ITEM_BASE", () => {
      expect(TAXABLE_ITEM_BASE).toBe("taxable-item");
    });

    it("has correct TAXABLE_ITEM_URL", () => {
      expect(TAXABLE_ITEM_URL).toBe("/master-data/taxable-item");
    });
  });

  describe("permission constants", () => {
    it("has correct TAXABLE_ITEM_PERMISSION prefix", () => {
      expect(TAXABLE_ITEM_PERMISSION).toBe("master-data:taxable-item:");
    });

    it("has correct TAXABLE_ITEM_LIST_PERMISSION", () => {
      expect(TAXABLE_ITEM_LIST_PERMISSION).toBe("master-data:taxable-item:list");
    });

    it("has correct TAXABLE_ITEM_READ_PERMISSION", () => {
      expect(TAXABLE_ITEM_READ_PERMISSION).toBe("master-data:taxable-item:read");
    });

    it("has correct TAXABLE_ITEM_CREATE_PERMISSION", () => {
      expect(TAXABLE_ITEM_CREATE_PERMISSION).toBe(
        "master-data:taxable-item:create",
      );
    });

    it("has correct TAXABLE_ITEM_UPDATE_PERMISSION", () => {
      expect(TAXABLE_ITEM_UPDATE_PERMISSION).toBe(
        "master-data:taxable-item:update",
      );
    });

    it("has correct TAXABLE_ITEM_DELETE_PERMISSION", () => {
      expect(TAXABLE_ITEM_DELETE_PERMISSION).toBe(
        "master-data:taxable-item:delete",
      );
    });

    it("all action permissions start with TAXABLE_ITEM_PERMISSION prefix", () => {
      const permissions = [
        TAXABLE_ITEM_LIST_PERMISSION,
        TAXABLE_ITEM_READ_PERMISSION,
        TAXABLE_ITEM_CREATE_PERMISSION,
        TAXABLE_ITEM_UPDATE_PERMISSION,
        TAXABLE_ITEM_DELETE_PERMISSION,
      ];

      permissions.forEach((permission) => {
        expect(permission).toMatch(/^master-data:taxable-item:/);
      });
    });

    it("all action permissions are distinct", () => {
      const permissions = [
        TAXABLE_ITEM_LIST_PERMISSION,
        TAXABLE_ITEM_READ_PERMISSION,
        TAXABLE_ITEM_CREATE_PERMISSION,
        TAXABLE_ITEM_UPDATE_PERMISSION,
        TAXABLE_ITEM_DELETE_PERMISSION,
      ];
      const unique = new Set(permissions);
      expect(unique.size).toBe(permissions.length);
    });
  });
});
