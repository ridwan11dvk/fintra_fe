import { describe, expect, it } from "vitest";
import {
  COUNTRY_BASE,
  COUNTRY_CREATE_PERMISSION,
  COUNTRY_DELETE_PERMISSION,
  COUNTRY_LIST_PAGE_TITLE,
  COUNTRY_LIST_PERMISSION,
  COUNTRY_PERMISSION,
  COUNTRY_READ_PERMISSION,
  COUNTRY_UPDATE_PERMISSION,
  COUNTRY_URL,
} from "@/features/master-data/country/data/country.utils";

describe("country.utils", () => {
  describe("URL constants", () => {
    it("has correct COUNTRY_LIST_PAGE_TITLE", () => {
      expect(COUNTRY_LIST_PAGE_TITLE).toBe("Country");
    });

    it("has correct COUNTRY_BASE", () => {
      expect(COUNTRY_BASE).toBe("country");
    });

    it("has correct COUNTRY_URL", () => {
      expect(COUNTRY_URL).toBe("/master-data/country");
    });
  });

  describe("permission constants", () => {
    it("has correct COUNTRY_PERMISSION prefix", () => {
      expect(COUNTRY_PERMISSION).toBe("master-data:country:");
    });

    it("has correct COUNTRY_LIST_PERMISSION", () => {
      expect(COUNTRY_LIST_PERMISSION).toBe("master-data:country:list");
    });

    it("has correct COUNTRY_READ_PERMISSION", () => {
      expect(COUNTRY_READ_PERMISSION).toBe("master-data:country:read");
    });

    it("has correct COUNTRY_CREATE_PERMISSION", () => {
      expect(COUNTRY_CREATE_PERMISSION).toBe("master-data:country:create");
    });

    it("has correct COUNTRY_UPDATE_PERMISSION", () => {
      expect(COUNTRY_UPDATE_PERMISSION).toBe("master-data:country:update");
    });

    it("has correct COUNTRY_DELETE_PERMISSION", () => {
      expect(COUNTRY_DELETE_PERMISSION).toBe("master-data:country:delete");
    });

    it("all action permissions start with COUNTRY_PERMISSION prefix", () => {
      const permissions = [
        COUNTRY_LIST_PERMISSION,
        COUNTRY_READ_PERMISSION,
        COUNTRY_CREATE_PERMISSION,
        COUNTRY_UPDATE_PERMISSION,
        COUNTRY_DELETE_PERMISSION,
      ];

      permissions.forEach((permission) => {
        expect(permission).toMatch(/^master-data:country:/);
      });
    });

    it("all action permissions are distinct", () => {
      const permissions = [
        COUNTRY_LIST_PERMISSION,
        COUNTRY_READ_PERMISSION,
        COUNTRY_CREATE_PERMISSION,
        COUNTRY_UPDATE_PERMISSION,
        COUNTRY_DELETE_PERMISSION,
      ];
      const unique = new Set(permissions);
      expect(unique.size).toBe(permissions.length);
    });
  });
});
