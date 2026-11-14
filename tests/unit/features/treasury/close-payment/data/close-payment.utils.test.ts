import { describe, expect, it } from "vitest";
import {
  CLOSE_PAYMENT_BASE,
  CLOSE_PAYMENT_CREATE_PERMISSION,
  CLOSE_PAYMENT_DELETE_PERMISSION,
  CLOSE_PAYMENT_LIST_PAGE_TITLE,
  CLOSE_PAYMENT_LIST_PERMISSION,
  CLOSE_PAYMENT_PERMISSION,
  CLOSE_PAYMENT_READ_PERMISSION,
  CLOSE_PAYMENT_UPDATE_PERMISSION,
  CLOSE_PAYMENT_URL,
} from "@/features/treasury/close-payment/data/close-payment.utils";

describe("close-payment.utils", () => {
  describe("URL constants", () => {
    it("has correct CLOSE_PAYMENT_LIST_PAGE_TITLE", () => {
      expect(CLOSE_PAYMENT_LIST_PAGE_TITLE).toBe("Close Payment");
    });

    it("has correct CLOSE_PAYMENT_BASE", () => {
      expect(CLOSE_PAYMENT_BASE).toBe("close-payment");
    });

    it("has correct CLOSE_PAYMENT_URL", () => {
      expect(CLOSE_PAYMENT_URL).toBe("/treasury/incoming-payment/close-payment");
    });
  });

  describe("permission constants", () => {
    it("has correct CLOSE_PAYMENT_PERMISSION prefix", () => {
      expect(CLOSE_PAYMENT_PERMISSION).toBe(
        "treasury:incoming-payment:close-payment:",
      );
    });

    it("has correct CLOSE_PAYMENT_LIST_PERMISSION", () => {
      expect(CLOSE_PAYMENT_LIST_PERMISSION).toBe(
        "treasury:incoming-payment:close-payment:list",
      );
    });

    it("has correct CLOSE_PAYMENT_READ_PERMISSION", () => {
      expect(CLOSE_PAYMENT_READ_PERMISSION).toBe(
        "treasury:incoming-payment:close-payment:read",
      );
    });

    it("has correct CLOSE_PAYMENT_CREATE_PERMISSION", () => {
      expect(CLOSE_PAYMENT_CREATE_PERMISSION).toBe(
        "treasury:incoming-payment:close-payment:create",
      );
    });

    it("has correct CLOSE_PAYMENT_UPDATE_PERMISSION", () => {
      expect(CLOSE_PAYMENT_UPDATE_PERMISSION).toBe(
        "treasury:incoming-payment:close-payment:update",
      );
    });

    it("has correct CLOSE_PAYMENT_DELETE_PERMISSION", () => {
      expect(CLOSE_PAYMENT_DELETE_PERMISSION).toBe(
        "treasury:incoming-payment:close-payment:delete",
      );
    });

    it("all action permissions start with CLOSE_PAYMENT_PERMISSION prefix", () => {
      const permissions = [
        CLOSE_PAYMENT_LIST_PERMISSION,
        CLOSE_PAYMENT_READ_PERMISSION,
        CLOSE_PAYMENT_CREATE_PERMISSION,
        CLOSE_PAYMENT_UPDATE_PERMISSION,
        CLOSE_PAYMENT_DELETE_PERMISSION,
      ];

      permissions.forEach((permission) => {
        expect(permission).toMatch(
          /^treasury:incoming-payment:close-payment:/,
        );
      });
    });

    it("all action permissions are distinct", () => {
      const permissions = [
        CLOSE_PAYMENT_LIST_PERMISSION,
        CLOSE_PAYMENT_READ_PERMISSION,
        CLOSE_PAYMENT_CREATE_PERMISSION,
        CLOSE_PAYMENT_UPDATE_PERMISSION,
        CLOSE_PAYMENT_DELETE_PERMISSION,
      ];

      const unique = new Set(permissions);
      expect(unique.size).toBe(permissions.length);
    });
  });
});
