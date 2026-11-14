import { describe, expect, it } from "vitest";
import {
  TRANSACTION_CATEGORY_BASE,
  TRANSACTION_CATEGORY_CREATE_PERMISSION,
  TRANSACTION_CATEGORY_DELETE_PERMISSION,
  TRANSACTION_CATEGORY_LIST_PAGE_TITLE,
  TRANSACTION_CATEGORY_LIST_PERMISSION,
  TRANSACTION_CATEGORY_PERMISSION,
  TRANSACTION_CATEGORY_READ_PERMISSION,
  TRANSACTION_CATEGORY_UPDATE_PERMISSION,
  TRANSACTION_CATEGORY_URL,
} from "@/features/master-data/transaction-category/data/transaction-category.utils";

describe("transaction-category.utils", () => {
  describe("URL constants", () => {
    it("has correct TRANSACTION_CATEGORY_LIST_PAGE_TITLE", () => {
      expect(TRANSACTION_CATEGORY_LIST_PAGE_TITLE).toBe("Transaction Category");
    });

    it("has correct TRANSACTION_CATEGORY_BASE", () => {
      expect(TRANSACTION_CATEGORY_BASE).toBe("transaction-category");
    });

    it("has correct TRANSACTION_CATEGORY_URL", () => {
      expect(TRANSACTION_CATEGORY_URL).toBe("/master-data/transaction-category");
    });
  });

  describe("permission constants", () => {
    it("has correct TRANSACTION_CATEGORY_PERMISSION prefix", () => {
      expect(TRANSACTION_CATEGORY_PERMISSION).toBe("master-data:transaction-category:");
    });

    it("has correct TRANSACTION_CATEGORY_LIST_PERMISSION", () => {
      expect(TRANSACTION_CATEGORY_LIST_PERMISSION).toBe("master-data:transaction-category:list");
    });

    it("has correct TRANSACTION_CATEGORY_READ_PERMISSION", () => {
      expect(TRANSACTION_CATEGORY_READ_PERMISSION).toBe("master-data:transaction-category:read");
    });

    it("has correct TRANSACTION_CATEGORY_CREATE_PERMISSION", () => {
      expect(TRANSACTION_CATEGORY_CREATE_PERMISSION).toBe("master-data:transaction-category:create");
    });

    it("has correct TRANSACTION_CATEGORY_UPDATE_PERMISSION", () => {
      expect(TRANSACTION_CATEGORY_UPDATE_PERMISSION).toBe("master-data:transaction-category:update");
    });

    it("has correct TRANSACTION_CATEGORY_DELETE_PERMISSION", () => {
      expect(TRANSACTION_CATEGORY_DELETE_PERMISSION).toBe("master-data:transaction-category:delete");
    });

    it("all action permissions start with TRANSACTION_CATEGORY_PERMISSION prefix", () => {
      const permissions = [
        TRANSACTION_CATEGORY_LIST_PERMISSION,
        TRANSACTION_CATEGORY_READ_PERMISSION,
        TRANSACTION_CATEGORY_CREATE_PERMISSION,
        TRANSACTION_CATEGORY_UPDATE_PERMISSION,
        TRANSACTION_CATEGORY_DELETE_PERMISSION,
      ];

      permissions.forEach((permission) => {
        expect(permission).toMatch(/^master-data:transaction-category:/);
      });
    });

    it("all action permissions are distinct", () => {
      const permissions = [
        TRANSACTION_CATEGORY_LIST_PERMISSION,
        TRANSACTION_CATEGORY_READ_PERMISSION,
        TRANSACTION_CATEGORY_CREATE_PERMISSION,
        TRANSACTION_CATEGORY_UPDATE_PERMISSION,
        TRANSACTION_CATEGORY_DELETE_PERMISSION,
      ];

      const unique = new Set(permissions);
      expect(unique.size).toBe(permissions.length);
    });
  });
});
