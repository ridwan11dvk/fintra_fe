import { describe, expect, it } from "vitest";
import {
  CURRENCY_RATE_BASE,
  CURRENCY_RATE_CREATE_PERMISSION,
  CURRENCY_RATE_DELETE_PERMISSION,
  CURRENCY_RATE_LIST_PAGE_TITLE,
  CURRENCY_RATE_LIST_PERMISSION,
  CURRENCY_RATE_PERMISSION,
  CURRENCY_RATE_READ_PERMISSION,
  CURRENCY_RATE_SYNC_PERMISSION,
  CURRENCY_RATE_UPDATE_PERMISSION,
  CURRENCY_RATE_URL,
} from "@/features/master-data/currency-rate/data/currency-rate.utils";

describe("currency-rate.utils", () => {
  describe("URL constants", () => {
    it("has correct CURRENCY_RATE_LIST_PAGE_TITLE", () => {
      expect(CURRENCY_RATE_LIST_PAGE_TITLE).toBe("Currency Rate");
    });

    it("has correct CURRENCY_RATE_BASE", () => {
      expect(CURRENCY_RATE_BASE).toBe("currency-rate");
    });

    it("has correct CURRENCY_RATE_URL", () => {
      expect(CURRENCY_RATE_URL).toBe("/master-data/currency-rate");
    });
  });

  describe("permission constants", () => {
    it("has correct CURRENCY_RATE_PERMISSION prefix", () => {
      expect(CURRENCY_RATE_PERMISSION).toBe("master-data:currency-rate:");
    });

    it("has correct CURRENCY_RATE_LIST_PERMISSION", () => {
      expect(CURRENCY_RATE_LIST_PERMISSION).toBe(
        "master-data:currency-rate:list",
      );
    });

    it("has correct CURRENCY_RATE_READ_PERMISSION", () => {
      expect(CURRENCY_RATE_READ_PERMISSION).toBe(
        "master-data:currency-rate:read",
      );
    });

    it("has correct CURRENCY_RATE_CREATE_PERMISSION", () => {
      expect(CURRENCY_RATE_CREATE_PERMISSION).toBe(
        "master-data:currency-rate:create",
      );
    });

    it("has correct CURRENCY_RATE_UPDATE_PERMISSION", () => {
      expect(CURRENCY_RATE_UPDATE_PERMISSION).toBe(
        "master-data:currency-rate:update",
      );
    });

    it("has correct CURRENCY_RATE_DELETE_PERMISSION", () => {
      expect(CURRENCY_RATE_DELETE_PERMISSION).toBe(
        "master-data:currency-rate:delete",
      );
    });

    it("has correct CURRENCY_RATE_SYNC_PERMISSION", () => {
      expect(CURRENCY_RATE_SYNC_PERMISSION).toBe(
        "master-data:currency-rate:sync",
      );
    });

    it("all action permissions start with permission prefix", () => {
      const permissions = [
        CURRENCY_RATE_LIST_PERMISSION,
        CURRENCY_RATE_READ_PERMISSION,
        CURRENCY_RATE_CREATE_PERMISSION,
        CURRENCY_RATE_UPDATE_PERMISSION,
        CURRENCY_RATE_DELETE_PERMISSION,
        CURRENCY_RATE_SYNC_PERMISSION,
      ];

      permissions.forEach((permission) => {
        expect(permission).toMatch(/^master-data:currency-rate:/);
      });
    });

    it("all action permissions are distinct", () => {
      const permissions = [
        CURRENCY_RATE_LIST_PERMISSION,
        CURRENCY_RATE_READ_PERMISSION,
        CURRENCY_RATE_CREATE_PERMISSION,
        CURRENCY_RATE_UPDATE_PERMISSION,
        CURRENCY_RATE_DELETE_PERMISSION,
        CURRENCY_RATE_SYNC_PERMISSION,
      ];

      expect(new Set(permissions).size).toBe(permissions.length);
    });
  });
});
