import { describe, expect, it } from "vitest";
import {
  BANK_BASE,
  BANK_CREATE_PERMISSION,
  BANK_DELETE_PERMISSION,
  BANK_EXPORT_PERMISSION,
  BANK_IMPORT_PERMISSION,
  BANK_LIST_PAGE_TITLE,
  BANK_LIST_PERMISSION,
  BANK_PERMISSION,
  BANK_READ_PERMISSION,
  BANK_UPDATE_PERMISSION,
  BANK_URL,
} from "@/features/master-data/bank/data/bank.utils";

describe("bank.utils", () => {
  describe("URL constants", () => {
    it("has correct BANK_LIST_PAGE_TITLE", () => {
      expect(BANK_LIST_PAGE_TITLE).toBe("Bank");
    });

    it("has correct BANK_BASE", () => {
      expect(BANK_BASE).toBe("bank");
    });

    it("has correct BANK_URL", () => {
      expect(BANK_URL).toBe("/master-data/bank");
    });
  });

  describe("permission constants", () => {
    it("has correct BANK_PERMISSION prefix", () => {
      expect(BANK_PERMISSION).toBe("master-data:bank:");
    });

    it("has correct BANK_LIST_PERMISSION", () => {
      expect(BANK_LIST_PERMISSION).toBe("master-data:bank:list");
    });

    it("has correct BANK_READ_PERMISSION", () => {
      expect(BANK_READ_PERMISSION).toBe("master-data:bank:read");
    });

    it("has correct BANK_CREATE_PERMISSION", () => {
      expect(BANK_CREATE_PERMISSION).toBe("master-data:bank:create");
    });

    it("has correct BANK_UPDATE_PERMISSION", () => {
      expect(BANK_UPDATE_PERMISSION).toBe("master-data:bank:update");
    });

    it("has correct BANK_DELETE_PERMISSION", () => {
      expect(BANK_DELETE_PERMISSION).toBe("master-data:bank:delete");
    });

    it("has correct BANK_EXPORT_PERMISSION", () => {
      expect(BANK_EXPORT_PERMISSION).toBe("master-data:bank:export");
    });

    it("has correct BANK_IMPORT_PERMISSION", () => {
      expect(BANK_IMPORT_PERMISSION).toBe("master-data:bank:import");
    });

    it("all action permissions start with BANK_PERMISSION prefix", () => {
      const permissions = [
        BANK_LIST_PERMISSION,
        BANK_READ_PERMISSION,
        BANK_CREATE_PERMISSION,
        BANK_UPDATE_PERMISSION,
        BANK_DELETE_PERMISSION,
        BANK_EXPORT_PERMISSION,
        BANK_IMPORT_PERMISSION,
      ];

      permissions.forEach((permission) => {
        expect(permission).toMatch(/^master-data:bank:/);
      });
    });

    it("all action permissions are distinct", () => {
      const permissions = [
        BANK_LIST_PERMISSION,
        BANK_READ_PERMISSION,
        BANK_CREATE_PERMISSION,
        BANK_UPDATE_PERMISSION,
        BANK_DELETE_PERMISSION,
        BANK_EXPORT_PERMISSION,
        BANK_IMPORT_PERMISSION,
      ];
      const unique = new Set(permissions);
      expect(unique.size).toBe(permissions.length);
    });
  });
});
