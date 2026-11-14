import { describe, expect, it } from "vitest";
import {
  PARTNER_DOC_REF_BASE,
  PARTNER_DOC_REF_CREATE_PERMISSION,
  PARTNER_DOC_REF_DELETE_PERMISSION,
  PARTNER_DOC_REF_LIST_PAGE_TITLE,
  PARTNER_DOC_REF_LIST_PERMISSION,
  PARTNER_DOC_REF_PERMISSION,
  PARTNER_DOC_REF_READ_PERMISSION,
  PARTNER_DOC_REF_UPDATE_PERMISSION,
  PARTNER_DOC_REF_URL,
} from "@/features/master-data/partner-doc-ref/data/partner-doc-ref.utils";

describe("partner-doc-ref.utils", () => {
  describe("URL constants", () => {
    it("has correct PARTNER_DOC_REF_LIST_PAGE_TITLE", () => {
      expect(PARTNER_DOC_REF_LIST_PAGE_TITLE).toBe(
        "Partner Document References",
      );
    });

    it("has correct PARTNER_DOC_REF_BASE", () => {
      expect(PARTNER_DOC_REF_BASE).toBe("document-reference");
    });

    it("has correct PARTNER_DOC_REF_URL", () => {
      expect(PARTNER_DOC_REF_URL).toBe("/master-data/document-reference");
    });
  });

  describe("permission constants", () => {
    it("has correct PARTNER_DOC_REF_PERMISSION prefix", () => {
      expect(PARTNER_DOC_REF_PERMISSION).toBe(
        "master-data:document-reference:",
      );
    });

    it("has correct PARTNER_DOC_REF_LIST_PERMISSION", () => {
      expect(PARTNER_DOC_REF_LIST_PERMISSION).toBe(
        "master-data:document-reference:list",
      );
    });

    it("has correct PARTNER_DOC_REF_READ_PERMISSION", () => {
      expect(PARTNER_DOC_REF_READ_PERMISSION).toBe(
        "master-data:document-reference:read",
      );
    });

    it("has correct PARTNER_DOC_REF_CREATE_PERMISSION", () => {
      expect(PARTNER_DOC_REF_CREATE_PERMISSION).toBe(
        "master-data:document-reference:create",
      );
    });

    it("has correct PARTNER_DOC_REF_UPDATE_PERMISSION", () => {
      expect(PARTNER_DOC_REF_UPDATE_PERMISSION).toBe(
        "master-data:document-reference:update",
      );
    });

    it("has correct PARTNER_DOC_REF_DELETE_PERMISSION", () => {
      expect(PARTNER_DOC_REF_DELETE_PERMISSION).toBe(
        "master-data:document-reference:delete",
      );
    });

    it("all action permissions start with PARTNER_DOC_REF_PERMISSION prefix", () => {
      const permissions = [
        PARTNER_DOC_REF_LIST_PERMISSION,
        PARTNER_DOC_REF_READ_PERMISSION,
        PARTNER_DOC_REF_CREATE_PERMISSION,
        PARTNER_DOC_REF_UPDATE_PERMISSION,
        PARTNER_DOC_REF_DELETE_PERMISSION,
      ];

      permissions.forEach((permission) => {
        expect(permission).toMatch(/^master-data:document-reference:/);
      });
    });

    it("all action permissions are distinct", () => {
      const permissions = [
        PARTNER_DOC_REF_LIST_PERMISSION,
        PARTNER_DOC_REF_READ_PERMISSION,
        PARTNER_DOC_REF_CREATE_PERMISSION,
        PARTNER_DOC_REF_UPDATE_PERMISSION,
        PARTNER_DOC_REF_DELETE_PERMISSION,
      ];
      const unique = new Set(permissions);
      expect(unique.size).toBe(permissions.length);
    });
  });
});
