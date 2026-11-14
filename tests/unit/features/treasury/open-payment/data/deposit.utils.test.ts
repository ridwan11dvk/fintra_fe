import {
  DEPOSIT_LIST_PAGE_TITLE,
  DEPOSIT_BASE,
  DEPOSIT_URL,
  DEPOSIT_PERMISSION,
  DEPOSIT_LIST_PERMISSION,
  DEPOSIT_READ_PERMISSION,
  DEPOSIT_CREATE_PERMISSION,
  DEPOSIT_UPDATE_PERMISSION,
  DEPOSIT_DELETE_PERMISSION,
} from "@/features/treasury";
import { describe, expect, it } from "vitest";

describe("Deposit Utils", () => {
  describe("URL Constants", () => {
    it("should have correct page title", () => {
      expect(DEPOSIT_LIST_PAGE_TITLE).toBe("Open Payment");
    });

    it("should have correct base path", () => {
      expect(DEPOSIT_BASE).toBe("open-payment");
    });

    it("should have correct full URL", () => {
      expect(DEPOSIT_URL).toBe("/treasury/incoming-payment/open-payment");
    });
  });

  describe("Permission Constants", () => {
    it("should have correct base permission", () => {
      expect(DEPOSIT_PERMISSION).toBe(
        "treasury:incoming-payment:open-payment:deposit:",
      );
    });

    it("should have correct list permission", () => {
      expect(DEPOSIT_LIST_PERMISSION).toBe(
        "treasury:incoming-payment:open-payment:deposit:list",
      );
    });

    it("should have correct read permission", () => {
      expect(DEPOSIT_READ_PERMISSION).toBe(
        "treasury:incoming-payment:open-payment:deposit:read",
      );
    });

    it("should have correct create permission", () => {
      expect(DEPOSIT_CREATE_PERMISSION).toBe(
        "treasury:incoming-payment:open-payment:deposit:create",
      );
    });

    it("should have correct update permission", () => {
      expect(DEPOSIT_UPDATE_PERMISSION).toBe(
        "treasury:incoming-payment:open-payment:deposit:update",
      );
    });

    it("should have correct delete permission", () => {
      expect(DEPOSIT_DELETE_PERMISSION).toBe(
        "treasury:incoming-payment:open-payment:deposit:delete",
      );
    });
  });
});
