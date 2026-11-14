import {
  TERM_OF_PAYMENT_BASE,
  TERM_OF_PAYMENT_CREATE_PERMISSION,
  TERM_OF_PAYMENT_DELETE_PERMISSION,
  TERM_OF_PAYMENT_LIST_PAGE_TITLE,
  TERM_OF_PAYMENT_LIST_PERMISSION,
  TERM_OF_PAYMENT_PERMISSION,
  TERM_OF_PAYMENT_READ_PERMISSION,
  TERM_OF_PAYMENT_UPDATE_PERMISSION,
  TERM_OF_PAYMENT_URL,
  discountSetValueAs,
} from "@/features/master-data/term-of-payment/data/term-of-payment.utils";
import { describe, expect, it } from "vitest";

describe("termOfPayment.utils", () => {
  describe("URL constants", () => {
    it("has correct TERM_OF_PAYMENT_LIST_PAGE_TITLE", () => {
      expect(TERM_OF_PAYMENT_LIST_PAGE_TITLE).toBe("Term of Payment");
    });

    it("has correct TERM_OF_PAYMENT_BASE", () => {
      expect(TERM_OF_PAYMENT_BASE).toBe("top");
    });

    it("has correct TERM_OF_PAYMENT_URL", () => {
      expect(TERM_OF_PAYMENT_URL).toBe("/master-data/top");
    });
  });

  describe("permission constants", () => {
    it("has correct TERM_OF_PAYMENT_PERMISSION prefix", () => {
      expect(TERM_OF_PAYMENT_PERMISSION).toBe("master-data:top:");
    });

    it("has correct TERM_OF_PAYMENT_LIST_PERMISSION", () => {
      expect(TERM_OF_PAYMENT_LIST_PERMISSION).toBe("master-data:top:list");
    });

    it("has correct TERM_OF_PAYMENT_READ_PERMISSION", () => {
      expect(TERM_OF_PAYMENT_READ_PERMISSION).toBe("master-data:top:read");
    });

    it("has correct TERM_OF_PAYMENT_CREATE_PERMISSION", () => {
      expect(TERM_OF_PAYMENT_CREATE_PERMISSION).toBe("master-data:top:create");
    });

    it("has correct TERM_OF_PAYMENT_UPDATE_PERMISSION", () => {
      expect(TERM_OF_PAYMENT_UPDATE_PERMISSION).toBe("master-data:top:update");
    });

    it("has correct TERM_OF_PAYMENT_DELETE_PERMISSION", () => {
      expect(TERM_OF_PAYMENT_DELETE_PERMISSION).toBe("master-data:top:delete");
    });

    it("all action permissions start with master-data: prefix", () => {
      const permissions = [
        TERM_OF_PAYMENT_LIST_PERMISSION,
        TERM_OF_PAYMENT_READ_PERMISSION,
        TERM_OF_PAYMENT_CREATE_PERMISSION,
        TERM_OF_PAYMENT_UPDATE_PERMISSION,
        TERM_OF_PAYMENT_DELETE_PERMISSION,
      ];

      permissions.forEach((permission) => {
        expect(permission).toMatch(/^master-data:/);
      });
    });

    it("all action permissions are distinct", () => {
      const permissions = [
        TERM_OF_PAYMENT_LIST_PERMISSION,
        TERM_OF_PAYMENT_READ_PERMISSION,
        TERM_OF_PAYMENT_CREATE_PERMISSION,
        TERM_OF_PAYMENT_UPDATE_PERMISSION,
        TERM_OF_PAYMENT_DELETE_PERMISSION,
      ];
      const unique = new Set(permissions);
      expect(unique.size).toBe(permissions.length);
    });
  });

  describe("discountSetValueAs", () => {
    it("returns null for empty string", () => {
      expect(discountSetValueAs("")).toBeNull();
    });

    it("returns null for zero", () => {
      expect(discountSetValueAs(0)).toBeNull();
    });

    it("returns the value for non-empty non-zero string", () => {
      expect(discountSetValueAs("10")).toBe("10");
    });

    it("returns the value for non-empty non-zero number", () => {
      expect(discountSetValueAs(5)).toBe(5);
    });
  });
});
