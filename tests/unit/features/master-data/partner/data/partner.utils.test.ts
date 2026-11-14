import { describe, expect, it } from "vitest";
import {
  PARTNER_BASE,
  PARTNER_CREATE_PAGE_TITLE,
  PARTNER_CREATE_PERMISSION,
  PARTNER_DELETE_PERMISSION,
  PARTNER_DETAIL_PAGE_TITLE,
  PARTNER_LIST_PAGE_TITLE,
  PARTNER_LIST_PERMISSION,
  PARTNER_PERMISSION,
  PARTNER_READ_PERMISSION,
  PARTNER_UPDATE_PAGE_TITLE,
  PARTNER_UPDATE_PERMISSION,
  PARTNER_URL,
  partnerCreateUrl,
  partnerDetailUrl,
  partnerEditUrl,
} from "@/features/master-data/partner/data/partner.utils";

describe("partner.utils", () => {
  describe("URL constants", () => {
    it("has correct PARTNER_LIST_PAGE_TITLE", () => {
      expect(PARTNER_LIST_PAGE_TITLE).toBe("Partner");
    });

    it("has correct PARTNER_BASE", () => {
      expect(PARTNER_BASE).toBe("partner");
    });

    it("has correct PARTNER_URL", () => {
      expect(PARTNER_URL).toBe("/master-data/partner");
    });

    it("has correct PARTNER_CREATE_PAGE_TITLE", () => {
      expect(PARTNER_CREATE_PAGE_TITLE).toBe("Create Partner");
    });

    it("has correct PARTNER_UPDATE_PAGE_TITLE", () => {
      expect(PARTNER_UPDATE_PAGE_TITLE).toBe("Edit Partner");
    });

    it("has correct PARTNER_DETAIL_PAGE_TITLE", () => {
      expect(PARTNER_DETAIL_PAGE_TITLE).toBe("Partner Detail");
    });
  });

  describe("URL builder functions", () => {
    it("partnerCreateUrl returns the create URL", () => {
      expect(partnerCreateUrl()).toBe("/master-data/partner/create");
    });

    it("partnerDetailUrl returns correct URL for a numeric id", () => {
      expect(partnerDetailUrl(42)).toBe("/master-data/partner/42/show");
    });

    it("partnerDetailUrl returns correct URL for a string id", () => {
      expect(partnerDetailUrl("99")).toBe("/master-data/partner/99/show");
    });

    it("partnerEditUrl returns correct URL for a numeric id", () => {
      expect(partnerEditUrl(5)).toBe("/master-data/partner/5/edit");
    });

    it("partnerEditUrl returns correct URL for a string id", () => {
      expect(partnerEditUrl("10")).toBe("/master-data/partner/10/edit");
    });
  });

  describe("permission constants", () => {
    it("has correct PARTNER_PERMISSION prefix", () => {
      expect(PARTNER_PERMISSION).toBe("master-data:partner:");
    });

    it("all action permissions start with the PARTNER_PERMISSION prefix", () => {
      const permissions = [
        PARTNER_LIST_PERMISSION,
        PARTNER_READ_PERMISSION,
        PARTNER_CREATE_PERMISSION,
        PARTNER_UPDATE_PERMISSION,
        PARTNER_DELETE_PERMISSION,
      ];
      permissions.forEach((p) => expect(p).toMatch(/^master-data:partner:/));
    });

    it("all action permissions are distinct", () => {
      const permissions = [
        PARTNER_LIST_PERMISSION,
        PARTNER_READ_PERMISSION,
        PARTNER_CREATE_PERMISSION,
        PARTNER_UPDATE_PERMISSION,
        PARTNER_DELETE_PERMISSION,
      ];
      expect(new Set(permissions).size).toBe(permissions.length);
    });

    it("has correct PARTNER_LIST_PERMISSION", () => {
      expect(PARTNER_LIST_PERMISSION).toBe("master-data:partner:list");
    });

    it("has correct PARTNER_READ_PERMISSION", () => {
      expect(PARTNER_READ_PERMISSION).toBe("master-data:partner:read");
    });

    it("has correct PARTNER_CREATE_PERMISSION", () => {
      expect(PARTNER_CREATE_PERMISSION).toBe("master-data:partner:create");
    });

    it("has correct PARTNER_UPDATE_PERMISSION", () => {
      expect(PARTNER_UPDATE_PERMISSION).toBe("master-data:partner:update");
    });

    it("has correct PARTNER_DELETE_PERMISSION", () => {
      expect(PARTNER_DELETE_PERMISSION).toBe("master-data:partner:delete");
    });
  });
});
