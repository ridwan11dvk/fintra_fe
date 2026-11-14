import { describe, expect, it } from "vitest";
import {
  DISTRICT_BASE,
  DISTRICT_CREATE_PERMISSION,
  DISTRICT_DELETE_PERMISSION,
  DISTRICT_LIST_PAGE_TITLE,
  DISTRICT_LIST_PERMISSION,
  DISTRICT_PERMISSION,
  DISTRICT_READ_PERMISSION,
  DISTRICT_UPDATE_PERMISSION,
  DISTRICT_URL,
} from "@/features/master-data/district/data/district.utils";

describe("district.utils", () => {
  describe("URL constants", () => {
    it("has correct DISTRICT_LIST_PAGE_TITLE", () => {
      expect(DISTRICT_LIST_PAGE_TITLE).toBe("District");
    });

    it("has correct DISTRICT_BASE", () => {
      expect(DISTRICT_BASE).toBe("district");
    });

    it("has correct DISTRICT_URL", () => {
      expect(DISTRICT_URL).toBe("/master-data/district");
    });
  });

  describe("permission constants", () => {
    it("has correct DISTRICT_PERMISSION prefix", () => {
      expect(DISTRICT_PERMISSION).toBe("master-data:district:");
    });

    it("has correct DISTRICT_LIST_PERMISSION", () => {
      expect(DISTRICT_LIST_PERMISSION).toBe("master-data:district:list");
    });

    it("has correct DISTRICT_READ_PERMISSION", () => {
      expect(DISTRICT_READ_PERMISSION).toBe("master-data:district:read");
    });

    it("has correct DISTRICT_CREATE_PERMISSION", () => {
      expect(DISTRICT_CREATE_PERMISSION).toBe("master-data:district:create");
    });

    it("has correct DISTRICT_UPDATE_PERMISSION", () => {
      expect(DISTRICT_UPDATE_PERMISSION).toBe("master-data:district:update");
    });

    it("has correct DISTRICT_DELETE_PERMISSION", () => {
      expect(DISTRICT_DELETE_PERMISSION).toBe("master-data:district:delete");
    });

    it("all action permissions start with DISTRICT_PERMISSION prefix", () => {
      const permissions = [
        DISTRICT_LIST_PERMISSION,
        DISTRICT_READ_PERMISSION,
        DISTRICT_CREATE_PERMISSION,
        DISTRICT_UPDATE_PERMISSION,
        DISTRICT_DELETE_PERMISSION,
      ];

      permissions.forEach((permission) => {
        expect(permission).toMatch(/^master-data:district:/);
      });
    });

    it("all action permissions are distinct", () => {
      const permissions = [
        DISTRICT_LIST_PERMISSION,
        DISTRICT_READ_PERMISSION,
        DISTRICT_CREATE_PERMISSION,
        DISTRICT_UPDATE_PERMISSION,
        DISTRICT_DELETE_PERMISSION,
      ];
      const unique = new Set(permissions);
      expect(unique.size).toBe(permissions.length);
    });
  });
});
