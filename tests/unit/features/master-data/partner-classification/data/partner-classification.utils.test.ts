import { describe, expect, it } from "vitest";
import {
  PARTNER_CLASSIFICATION_BASE,
  PARTNER_CLASSIFICATION_CREATE_PERMISSION,
  PARTNER_CLASSIFICATION_DELETE_PERMISSION,
  PARTNER_CLASSIFICATION_LIST_PAGE_TITLE,
  PARTNER_CLASSIFICATION_LIST_PERMISSION,
  PARTNER_CLASSIFICATION_PERMISSION,
  PARTNER_CLASSIFICATION_READ_PERMISSION,
  PARTNER_CLASSIFICATION_UPDATE_PERMISSION,
  PARTNER_CLASSIFICATION_URL,
} from "@/features/master-data/partner-classification/data/partner-classification.utils";

describe("partner-classification.utils", () => {
  describe("URL constants", () => {
    it("has correct PARTNER_CLASSIFICATION_LIST_PAGE_TITLE", () => {
      expect(PARTNER_CLASSIFICATION_LIST_PAGE_TITLE).toBe(
        "Partner Classification",
      );
    });

    it("has correct PARTNER_CLASSIFICATION_BASE", () => {
      expect(PARTNER_CLASSIFICATION_BASE).toBe("partner-classification");
    });

    it("has correct PARTNER_CLASSIFICATION_URL", () => {
      expect(PARTNER_CLASSIFICATION_URL).toBe(
        "/master-data/partner-classification",
      );
    });
  });

  describe("permission constants", () => {
    it("has correct PARTNER_CLASSIFICATION_PERMISSION prefix", () => {
      expect(PARTNER_CLASSIFICATION_PERMISSION).toBe(
        "master-data:partner-classification:",
      );
    });

    it("has correct PARTNER_CLASSIFICATION_LIST_PERMISSION", () => {
      expect(PARTNER_CLASSIFICATION_LIST_PERMISSION).toBe(
        "master-data:partner-classification:list",
      );
    });

    it("has correct PARTNER_CLASSIFICATION_READ_PERMISSION", () => {
      expect(PARTNER_CLASSIFICATION_READ_PERMISSION).toBe(
        "master-data:partner-classification:read",
      );
    });

    it("has correct PARTNER_CLASSIFICATION_CREATE_PERMISSION", () => {
      expect(PARTNER_CLASSIFICATION_CREATE_PERMISSION).toBe(
        "master-data:partner-classification:create",
      );
    });

    it("has correct PARTNER_CLASSIFICATION_UPDATE_PERMISSION", () => {
      expect(PARTNER_CLASSIFICATION_UPDATE_PERMISSION).toBe(
        "master-data:partner-classification:update",
      );
    });

    it("has correct PARTNER_CLASSIFICATION_DELETE_PERMISSION", () => {
      expect(PARTNER_CLASSIFICATION_DELETE_PERMISSION).toBe(
        "master-data:partner-classification:delete",
      );
    });

    it("all action permissions start with PARTNER_CLASSIFICATION_PERMISSION prefix", () => {
      const permissions = [
        PARTNER_CLASSIFICATION_LIST_PERMISSION,
        PARTNER_CLASSIFICATION_READ_PERMISSION,
        PARTNER_CLASSIFICATION_CREATE_PERMISSION,
        PARTNER_CLASSIFICATION_UPDATE_PERMISSION,
        PARTNER_CLASSIFICATION_DELETE_PERMISSION,
      ];

      permissions.forEach((permission) => {
        expect(permission).toMatch(
          /^master-data:partner-classification:/,
        );
      });
    });

    it("all action permissions are distinct", () => {
      const permissions = [
        PARTNER_CLASSIFICATION_LIST_PERMISSION,
        PARTNER_CLASSIFICATION_READ_PERMISSION,
        PARTNER_CLASSIFICATION_CREATE_PERMISSION,
        PARTNER_CLASSIFICATION_UPDATE_PERMISSION,
        PARTNER_CLASSIFICATION_DELETE_PERMISSION,
      ];
      const unique = new Set(permissions);
      expect(unique.size).toBe(permissions.length);
    });
  });
});
