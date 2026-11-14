import { describe, expect, it } from "vitest";
import {
  HOUSE_BANK_BASE,
  HOUSE_BANK_CREATE_PERMISSION,
  HOUSE_BANK_DELETE_PERMISSION,
  HOUSE_BANK_EXPORT_PERMISSION,
  HOUSE_BANK_IMPORT_PERMISSION,
  HOUSE_BANK_LIST_PAGE_TITLE,
  HOUSE_BANK_LIST_PERMISSION,
  HOUSE_BANK_PERMISSION,
  HOUSE_BANK_READ_PERMISSION,
  HOUSE_BANK_UPDATE_PERMISSION,
  HOUSE_BANK_URL,
} from "@/features/master-data/house-bank/data/house-bank.utils";

describe("house-bank.utils", () => {
  describe("URL constants", () => {
    it("has correct HOUSE_BANK_LIST_PAGE_TITLE", () => {
      expect(HOUSE_BANK_LIST_PAGE_TITLE).toBe("House Bank");
    });

    it("has correct HOUSE_BANK_BASE", () => {
      expect(HOUSE_BANK_BASE).toBe("house-bank");
    });

    it("has correct HOUSE_BANK_URL", () => {
      expect(HOUSE_BANK_URL).toBe("/master-data/house-bank");
    });
  });

  describe("permission constants", () => {
    it("has correct HOUSE_BANK_PERMISSION prefix", () => {
      expect(HOUSE_BANK_PERMISSION).toBe("master-data:house-bank:");
    });

    it("has correct HOUSE_BANK_LIST_PERMISSION", () => {
      expect(HOUSE_BANK_LIST_PERMISSION).toBe("master-data:house-bank:list");
    });

    it("has correct HOUSE_BANK_READ_PERMISSION", () => {
      expect(HOUSE_BANK_READ_PERMISSION).toBe("master-data:house-bank:read");
    });

    it("has correct HOUSE_BANK_CREATE_PERMISSION", () => {
      expect(HOUSE_BANK_CREATE_PERMISSION).toBe("master-data:house-bank:create");
    });

    it("has correct HOUSE_BANK_UPDATE_PERMISSION", () => {
      expect(HOUSE_BANK_UPDATE_PERMISSION).toBe("master-data:house-bank:update");
    });

    it("has correct HOUSE_BANK_DELETE_PERMISSION", () => {
      expect(HOUSE_BANK_DELETE_PERMISSION).toBe("master-data:house-bank:delete");
    });

    it("has correct HOUSE_BANK_EXPORT_PERMISSION", () => {
      expect(HOUSE_BANK_EXPORT_PERMISSION).toBe("master-data:house-bank:export");
    });

    it("has correct HOUSE_BANK_IMPORT_PERMISSION", () => {
      expect(HOUSE_BANK_IMPORT_PERMISSION).toBe("master-data:house-bank:import");
    });

    it("all action permissions start with HOUSE_BANK_PERMISSION prefix", () => {
      const permissions = [
        HOUSE_BANK_LIST_PERMISSION,
        HOUSE_BANK_READ_PERMISSION,
        HOUSE_BANK_CREATE_PERMISSION,
        HOUSE_BANK_UPDATE_PERMISSION,
        HOUSE_BANK_DELETE_PERMISSION,
        HOUSE_BANK_EXPORT_PERMISSION,
        HOUSE_BANK_IMPORT_PERMISSION,
      ];

      permissions.forEach((permission) => {
        expect(permission).toMatch(/^master-data:house-bank:/);
      });
    });

    it("all action permissions are distinct", () => {
      const permissions = [
        HOUSE_BANK_LIST_PERMISSION,
        HOUSE_BANK_READ_PERMISSION,
        HOUSE_BANK_CREATE_PERMISSION,
        HOUSE_BANK_UPDATE_PERMISSION,
        HOUSE_BANK_DELETE_PERMISSION,
        HOUSE_BANK_EXPORT_PERMISSION,
        HOUSE_BANK_IMPORT_PERMISSION,
      ];
      const unique = new Set(permissions);
      expect(unique.size).toBe(permissions.length);
    });
  });
});
