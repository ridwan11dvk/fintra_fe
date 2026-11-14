import { describe, expect, it } from "vitest";
import {
  CUSTOMS_OFFICE_BASE,
  CUSTOMS_OFFICE_CREATE_PERMISSION,
  CUSTOMS_OFFICE_DELETE_PERMISSION,
  CUSTOMS_OFFICE_LIST_PAGE_TITLE,
  CUSTOMS_OFFICE_LIST_PERMISSION,
  CUSTOMS_OFFICE_PERMISSION,
  CUSTOMS_OFFICE_READ_PERMISSION,
  CUSTOMS_OFFICE_UPDATE_PERMISSION,
  CUSTOMS_OFFICE_URL,
} from "@/features/master-data/customs-office/data/customs-office.utils";

describe("customs-office.utils", () => {
  describe("URL constants", () => {
    it("has correct CUSTOMS_OFFICE_LIST_PAGE_TITLE", () => {
      expect(CUSTOMS_OFFICE_LIST_PAGE_TITLE).toBe("Customs Office");
    });

    it("has correct CUSTOMS_OFFICE_BASE", () => {
      expect(CUSTOMS_OFFICE_BASE).toBe("customs-office");
    });

    it("has correct CUSTOMS_OFFICE_URL", () => {
      expect(CUSTOMS_OFFICE_URL).toBe("/master-data/customs-office");
    });
  });

  describe("permission constants", () => {
    it("has correct CUSTOMS_OFFICE_PERMISSION prefix", () => {
      expect(CUSTOMS_OFFICE_PERMISSION).toBe("master-data:customs-office:");
    });

    it("has correct CUSTOMS_OFFICE_LIST_PERMISSION", () => {
      expect(CUSTOMS_OFFICE_LIST_PERMISSION).toBe(
        "master-data:customs-office:list",
      );
    });

    it("has correct CUSTOMS_OFFICE_READ_PERMISSION", () => {
      expect(CUSTOMS_OFFICE_READ_PERMISSION).toBe(
        "master-data:customs-office:read",
      );
    });

    it("has correct CUSTOMS_OFFICE_CREATE_PERMISSION", () => {
      expect(CUSTOMS_OFFICE_CREATE_PERMISSION).toBe(
        "master-data:customs-office:create",
      );
    });

    it("has correct CUSTOMS_OFFICE_UPDATE_PERMISSION", () => {
      expect(CUSTOMS_OFFICE_UPDATE_PERMISSION).toBe(
        "master-data:customs-office:update",
      );
    });

    it("has correct CUSTOMS_OFFICE_DELETE_PERMISSION", () => {
      expect(CUSTOMS_OFFICE_DELETE_PERMISSION).toBe(
        "master-data:customs-office:delete",
      );
    });

    it("all action permissions start with permission prefix", () => {
      const permissions = [
        CUSTOMS_OFFICE_LIST_PERMISSION,
        CUSTOMS_OFFICE_READ_PERMISSION,
        CUSTOMS_OFFICE_CREATE_PERMISSION,
        CUSTOMS_OFFICE_UPDATE_PERMISSION,
        CUSTOMS_OFFICE_DELETE_PERMISSION,
      ];

      permissions.forEach((permission) => {
        expect(permission).toMatch(/^master-data:customs-office:/);
      });
    });

    it("all action permissions are distinct", () => {
      const permissions = [
        CUSTOMS_OFFICE_LIST_PERMISSION,
        CUSTOMS_OFFICE_READ_PERMISSION,
        CUSTOMS_OFFICE_CREATE_PERMISSION,
        CUSTOMS_OFFICE_UPDATE_PERMISSION,
        CUSTOMS_OFFICE_DELETE_PERMISSION,
      ];

      expect(new Set(permissions).size).toBe(permissions.length);
    });
  });
});
