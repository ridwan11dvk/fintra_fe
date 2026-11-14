import { describe, expect, it } from "vitest";
import {
  ROLE_BASE,
  ROLE_CREATE_PERMISSION,
  ROLE_DELETE_PERMISSION,
  ROLE_LIST_PAGE_TITLE,
  ROLE_LIST_PERMISSION,
  ROLE_PERMISSION,
  ROLE_READ_PERMISSION,
  ROLE_SHOW_PAGE_TITLE,
  ROLE_UPDATE_PERMISSION,
  ROLE_URL,
  SETTING_SECTION_TITLE,
  roleDetailUrl,
  roleUrl,
} from "@/features/settings/role/data/role.utils";

describe("role.utils", () => {
  describe("section constant", () => {
    it("has correct SETTING_SECTION_TITLE", () => {
      expect(SETTING_SECTION_TITLE).toBe("Settings");
    });
  });

  describe("URL constants", () => {
    it("has correct ROLE_LIST_PAGE_TITLE", () => {
      expect(ROLE_LIST_PAGE_TITLE).toBe("Role Management");
    });

    it("has correct ROLE_BASE", () => {
      expect(ROLE_BASE).toBe("role");
    });

    it("has correct ROLE_URL", () => {
      expect(ROLE_URL).toBe("/setting/role");
    });

    it("has correct ROLE_SHOW_PAGE_TITLE", () => {
      expect(ROLE_SHOW_PAGE_TITLE).toBe("Role Detail");
    });
  });

  describe("URL helper functions", () => {
    it("roleUrl() returns ROLE_URL", () => {
      expect(roleUrl()).toBe("/setting/role");
    });

    it("roleDetailUrl() returns URL with id", () => {
      expect(roleDetailUrl(5)).toBe("/setting/role/5");
    });

    it("roleDetailUrl() accepts string id", () => {
      expect(roleDetailUrl("abc")).toBe("/setting/role/abc");
    });
  });

  describe("permission constants", () => {
    it("has correct ROLE_PERMISSION prefix", () => {
      expect(ROLE_PERMISSION).toBe("setting:role:");
    });

    it("has correct ROLE_LIST_PERMISSION", () => {
      expect(ROLE_LIST_PERMISSION).toBe("setting:role:list");
    });

    it("has correct ROLE_READ_PERMISSION", () => {
      expect(ROLE_READ_PERMISSION).toBe("setting:role:read");
    });

    it("has correct ROLE_CREATE_PERMISSION", () => {
      expect(ROLE_CREATE_PERMISSION).toBe("setting:role:create");
    });

    it("has correct ROLE_UPDATE_PERMISSION", () => {
      expect(ROLE_UPDATE_PERMISSION).toBe("setting:role:update");
    });

    it("has correct ROLE_DELETE_PERMISSION", () => {
      expect(ROLE_DELETE_PERMISSION).toBe("setting:role:delete");
    });

    it("all action permissions start with ROLE_PERMISSION prefix", () => {
      const permissions = [
        ROLE_LIST_PERMISSION,
        ROLE_READ_PERMISSION,
        ROLE_CREATE_PERMISSION,
        ROLE_UPDATE_PERMISSION,
        ROLE_DELETE_PERMISSION,
      ];

      permissions.forEach((permission) => {
        expect(permission).toMatch(/^setting:role:/);
      });
    });

    it("all action permissions are distinct", () => {
      const permissions = [
        ROLE_LIST_PERMISSION,
        ROLE_READ_PERMISSION,
        ROLE_CREATE_PERMISSION,
        ROLE_UPDATE_PERMISSION,
        ROLE_DELETE_PERMISSION,
      ];
      const unique = new Set(permissions);
      expect(unique.size).toBe(permissions.length);
    });
  });
});
