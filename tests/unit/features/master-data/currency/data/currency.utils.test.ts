import { describe, expect, it } from "vitest";
import {
  CURRENCY_BASE,
  CURRENCY_CREATE_PERMISSION,
  CURRENCY_DELETE_PERMISSION,
  CURRENCY_LIST_PAGE_TITLE,
  CURRENCY_LIST_PERMISSION,
  CURRENCY_PERMISSION,
  CURRENCY_READ_PERMISSION,
  CURRENCY_UPDATE_PERMISSION,
  CURRENCY_URL,
} from "@/features/master-data/currency/data/currency.utils";

describe("currency.utils", () => {
  describe("URL constants", () => {
    it("has correct CURRENCY_LIST_PAGE_TITLE", () => {
      expect(CURRENCY_LIST_PAGE_TITLE).toBe("Currency");
    });

    it("has correct CURRENCY_BASE", () => {
      expect(CURRENCY_BASE).toBe("currency");
    });

    it("has correct CURRENCY_URL", () => {
      expect(CURRENCY_URL).toBe("/master-data/currency");
    });
  });

  describe("permission constants", () => {
    it("has correct CURRENCY_PERMISSION prefix", () => {
      expect(CURRENCY_PERMISSION).toBe("master-data:currency:");
    });

    it("has correct CURRENCY_LIST_PERMISSION", () => {
      expect(CURRENCY_LIST_PERMISSION).toBe("master-data:currency:list");
    });

    it("has correct CURRENCY_READ_PERMISSION", () => {
      expect(CURRENCY_READ_PERMISSION).toBe("master-data:currency:read");
    });

    it("has correct CURRENCY_CREATE_PERMISSION", () => {
      expect(CURRENCY_CREATE_PERMISSION).toBe("master-data:currency:create");
    });

    it("has correct CURRENCY_UPDATE_PERMISSION", () => {
      expect(CURRENCY_UPDATE_PERMISSION).toBe("master-data:currency:update");
    });

    it("has correct CURRENCY_DELETE_PERMISSION", () => {
      expect(CURRENCY_DELETE_PERMISSION).toBe("master-data:currency:delete");
    });

    it("all action permissions start with CURRENCY_PERMISSION prefix", () => {
      const permissions = [
        CURRENCY_LIST_PERMISSION,
        CURRENCY_READ_PERMISSION,
        CURRENCY_CREATE_PERMISSION,
        CURRENCY_UPDATE_PERMISSION,
        CURRENCY_DELETE_PERMISSION,
      ];

      permissions.forEach((permission) => {
        expect(permission).toMatch(/^master-data:currency:/);
      });
    });

    it("all action permissions are distinct", () => {
      const permissions = [
        CURRENCY_LIST_PERMISSION,
        CURRENCY_READ_PERMISSION,
        CURRENCY_CREATE_PERMISSION,
        CURRENCY_UPDATE_PERMISSION,
        CURRENCY_DELETE_PERMISSION,
      ];
      const unique = new Set(permissions);
      expect(unique.size).toBe(permissions.length);
    });
  });
});
