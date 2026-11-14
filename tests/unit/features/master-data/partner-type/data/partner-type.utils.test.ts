import { describe, expect, it } from "vitest";
import {
  PARTNER_TYPE_BASE,
  PARTNER_TYPE_CREATE_PERMISSION,
  PARTNER_TYPE_DELETE_PERMISSION,
  PARTNER_TYPE_LIST_PAGE_TITLE,
  PARTNER_TYPE_LIST_PERMISSION,
  PARTNER_TYPE_PERMISSION,
  PARTNER_TYPE_READ_PERMISSION,
  PARTNER_TYPE_UPDATE_PERMISSION,
  PARTNER_TYPE_URL,
} from "@/features/master-data/partner-type/data/partner-type.utils";

describe("partner-type.utils", () => {
  describe("URL constants", () => {
    it("has correct PARTNER_TYPE_LIST_PAGE_TITLE", () => {
      expect(PARTNER_TYPE_LIST_PAGE_TITLE).toBe("Partner Type");
    });

    it("has correct PARTNER_TYPE_BASE", () => {
      expect(PARTNER_TYPE_BASE).toBe("partner-type");
    });

    it("has correct PARTNER_TYPE_URL", () => {
      expect(PARTNER_TYPE_URL).toBe("/master-data/partner-type");
    });
  });

  describe("permission constants", () => {
    it("has correct PARTNER_TYPE_PERMISSION prefix", () => {
      expect(PARTNER_TYPE_PERMISSION).toBe("master-data:partner-type:");
    });

    it("has correct PARTNER_TYPE_LIST_PERMISSION", () => {
      expect(PARTNER_TYPE_LIST_PERMISSION).toBe(
        "master-data:partner-type:list",
      );
    });

    it("has correct PARTNER_TYPE_READ_PERMISSION", () => {
      expect(PARTNER_TYPE_READ_PERMISSION).toBe(
        "master-data:partner-type:read",
      );
    });

    it("has correct PARTNER_TYPE_CREATE_PERMISSION", () => {
      expect(PARTNER_TYPE_CREATE_PERMISSION).toBe(
        "master-data:partner-type:create",
      );
    });

    it("has correct PARTNER_TYPE_UPDATE_PERMISSION", () => {
      expect(PARTNER_TYPE_UPDATE_PERMISSION).toBe(
        "master-data:partner-type:update",
      );
    });

    it("has correct PARTNER_TYPE_DELETE_PERMISSION", () => {
      expect(PARTNER_TYPE_DELETE_PERMISSION).toBe(
        "master-data:partner-type:delete",
      );
    });

    it("all action permissions start with PARTNER_TYPE_PERMISSION prefix", () => {
      const actions = [
        PARTNER_TYPE_LIST_PERMISSION,
        PARTNER_TYPE_READ_PERMISSION,
        PARTNER_TYPE_CREATE_PERMISSION,
        PARTNER_TYPE_UPDATE_PERMISSION,
        PARTNER_TYPE_DELETE_PERMISSION,
      ];
      actions.forEach((perm) => {
        expect(perm.startsWith(PARTNER_TYPE_PERMISSION)).toBe(true);
      });
    });

    it("all action permissions are distinct", () => {
      const actions = [
        PARTNER_TYPE_LIST_PERMISSION,
        PARTNER_TYPE_READ_PERMISSION,
        PARTNER_TYPE_CREATE_PERMISSION,
        PARTNER_TYPE_UPDATE_PERMISSION,
        PARTNER_TYPE_DELETE_PERMISSION,
      ];
      expect(new Set(actions).size).toBe(actions.length);
    });
  });
});
