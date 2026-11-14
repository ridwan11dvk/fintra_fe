import { describe, expect, it } from "vitest";
import {
  TRANSACTION_TYPE_BASE,
  TRANSACTION_TYPE_CREATE_PERMISSION,
  TRANSACTION_TYPE_DELETE_PERMISSION,
  TRANSACTION_TYPE_LIST_PAGE_TITLE,
  TRANSACTION_TYPE_LIST_PERMISSION,
  TRANSACTION_TYPE_PERMISSION,
  TRANSACTION_TYPE_READ_PERMISSION,
  TRANSACTION_TYPE_UPDATE_PERMISSION,
  TRANSACTION_TYPE_URL,
} from "@/features/master-data/transaction-type/data/transaction-type.utils";

describe("transaction-type.utils", () => {
  describe("URL constants", () => {
    it("has correct TRANSACTION_TYPE_LIST_PAGE_TITLE", () => {
      expect(TRANSACTION_TYPE_LIST_PAGE_TITLE).toBe("Transaction Type");
    });

    it("has correct TRANSACTION_TYPE_BASE", () => {
      expect(TRANSACTION_TYPE_BASE).toBe("transaction-type");
    });

    it("has correct TRANSACTION_TYPE_URL", () => {
      expect(TRANSACTION_TYPE_URL).toBe("/master-data/transaction-type");
    });
  });

  describe("permission constants", () => {
    it("has correct TRANSACTION_TYPE_PERMISSION prefix", () => {
      expect(TRANSACTION_TYPE_PERMISSION).toBe("master-data:transaction-type:");
    });

    it("has correct TRANSACTION_TYPE_LIST_PERMISSION", () => {
      expect(TRANSACTION_TYPE_LIST_PERMISSION).toBe("master-data:transaction-type:list");
    });

    it("has correct TRANSACTION_TYPE_READ_PERMISSION", () => {
      expect(TRANSACTION_TYPE_READ_PERMISSION).toBe("master-data:transaction-type:read");
    });

    it("has correct TRANSACTION_TYPE_CREATE_PERMISSION", () => {
      expect(TRANSACTION_TYPE_CREATE_PERMISSION).toBe("master-data:transaction-type:create");
    });

    it("has correct TRANSACTION_TYPE_UPDATE_PERMISSION", () => {
      expect(TRANSACTION_TYPE_UPDATE_PERMISSION).toBe("master-data:transaction-type:update");
    });

    it("has correct TRANSACTION_TYPE_DELETE_PERMISSION", () => {
      expect(TRANSACTION_TYPE_DELETE_PERMISSION).toBe("master-data:transaction-type:delete");
    });

    it("all action permissions start with TRANSACTION_TYPE_PERMISSION prefix", () => {
      const permissions = [
        TRANSACTION_TYPE_LIST_PERMISSION,
        TRANSACTION_TYPE_READ_PERMISSION,
        TRANSACTION_TYPE_CREATE_PERMISSION,
        TRANSACTION_TYPE_UPDATE_PERMISSION,
        TRANSACTION_TYPE_DELETE_PERMISSION,
      ];

      permissions.forEach((permission) => {
        expect(permission).toMatch(/^master-data:transaction-type:/);
      });
    });

    it("all action permissions are distinct", () => {
      const permissions = [
        TRANSACTION_TYPE_LIST_PERMISSION,
        TRANSACTION_TYPE_READ_PERMISSION,
        TRANSACTION_TYPE_CREATE_PERMISSION,
        TRANSACTION_TYPE_UPDATE_PERMISSION,
        TRANSACTION_TYPE_DELETE_PERMISSION,
      ];

      const unique = new Set(permissions);
      expect(unique.size).toBe(permissions.length);
    });
  });
});
