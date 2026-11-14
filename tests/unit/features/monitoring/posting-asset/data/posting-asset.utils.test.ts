import { describe, expect, it } from "vitest";
import {
  POSTING_ASSET_BASE,
  POSTING_ASSET_CREATE_PERMISSION,
  POSTING_ASSET_DELETE_PERMISSION,
  POSTING_ASSET_DETAIL_PAGE_TITLE,
  POSTING_ASSET_LIST_PAGE_TITLE,
  POSTING_ASSET_LIST_PERMISSION,
  POSTING_ASSET_PERMISSION,
  POSTING_ASSET_READ_PERMISSION,
  POSTING_ASSET_UPDATE_PERMISSION,
  POSTING_ASSET_URL,
  postingAssetDetailUrl,
} from "@/features/monitoring/posting-asset/data/posting-asset.utils";

describe("posting-asset.utils", () => {
  describe("URL constants", () => {
    it("has correct POSTING_ASSET_LIST_PAGE_TITLE", () => {
      expect(POSTING_ASSET_LIST_PAGE_TITLE).toBe("Posting Invoice");
    });

    it("has correct POSTING_ASSET_BASE", () => {
      expect(POSTING_ASSET_BASE).toBe("invoice");
    });

    it("has correct POSTING_ASSET_URL", () => {
      expect(POSTING_ASSET_URL).toBe("/monitoring/invoice");
    });

    it("has correct POSTING_ASSET_DETAIL_PAGE_TITLE", () => {
      expect(POSTING_ASSET_DETAIL_PAGE_TITLE).toBe("Posting Detail");
    });

    it("postingAssetDetailUrl builds correct URL", () => {
      const url = postingAssetDetailUrl("A", "DOC-001", "REF-001");
      expect(url).toBe("/monitoring/invoice/A/DOC-001/REF-001");
    });

    it("postingAssetDetailUrl encodes URI components", () => {
      const url = postingAssetDetailUrl("A/B", "DOC 001", "REF/001");
      expect(url).toContain(encodeURIComponent("A/B"));
      expect(url).toContain(encodeURIComponent("DOC 001"));
      expect(url).toContain(encodeURIComponent("REF/001"));
    });
  });

  describe("permission constants", () => {
    it("has correct POSTING_ASSET_PERMISSION prefix", () => {
      expect(POSTING_ASSET_PERMISSION).toBe("monitoring:invoice:");
    });

    it("has correct POSTING_ASSET_LIST_PERMISSION", () => {
      expect(POSTING_ASSET_LIST_PERMISSION).toBe("monitoring:invoice:list");
    });

    it("has correct POSTING_ASSET_READ_PERMISSION", () => {
      expect(POSTING_ASSET_READ_PERMISSION).toBe("monitoring:invoice:read");
    });

    it("has correct POSTING_ASSET_CREATE_PERMISSION", () => {
      expect(POSTING_ASSET_CREATE_PERMISSION).toBe("monitoring:invoice:create");
    });

    it("has correct POSTING_ASSET_UPDATE_PERMISSION", () => {
      expect(POSTING_ASSET_UPDATE_PERMISSION).toBe("monitoring:invoice:update");
    });

    it("has correct POSTING_ASSET_DELETE_PERMISSION", () => {
      expect(POSTING_ASSET_DELETE_PERMISSION).toBe("monitoring:invoice:delete");
    });

    it("all action permissions start with POSTING_ASSET_PERMISSION prefix", () => {
      const permissions = [
        POSTING_ASSET_LIST_PERMISSION,
        POSTING_ASSET_READ_PERMISSION,
        POSTING_ASSET_CREATE_PERMISSION,
        POSTING_ASSET_UPDATE_PERMISSION,
        POSTING_ASSET_DELETE_PERMISSION,
      ];

      permissions.forEach((permission) => {
        expect(permission).toMatch(/^monitoring:invoice:/);
      });
    });

    it("all action permissions are distinct", () => {
      const permissions = [
        POSTING_ASSET_LIST_PERMISSION,
        POSTING_ASSET_READ_PERMISSION,
        POSTING_ASSET_CREATE_PERMISSION,
        POSTING_ASSET_UPDATE_PERMISSION,
        POSTING_ASSET_DELETE_PERMISSION,
      ];
      const unique = new Set(permissions);
      expect(unique.size).toBe(permissions.length);
    });
  });
});
