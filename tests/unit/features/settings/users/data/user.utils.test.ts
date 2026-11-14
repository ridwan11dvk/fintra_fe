import { describe, expect, it } from "vitest";
import {
  USER_LIST_PAGE_TITLE,
  USER_BASE,
  USER_URL,
  INTERNAL_USER_LIST_PAGE_TITLE,
  INTERNAL_USER_CREATE_PAGE_TITLE,
  INTERNAL_USER_UPDATE_PAGE_TITLE,
  INTERNAL_USER_DETAIL_PAGE_TITLE,
  EXTERNAL_USER_LIST_PAGE_TITLE,
  EXTERNAL_USER_CREATE_PAGE_TITLE,
  EXTERNAL_USER_UPDATE_PAGE_TITLE,
  EXTERNAL_USER_DETAIL_PAGE_TITLE,
  SETTINGS_PAGE_TITLE,
  userUrl,
  internalUserCreateUrl,
  internalUserDetailUrl,
  internalUserEditUrl,
  externalUserCreateUrl,
  externalUserDetailUrl,
  externalUserEditUrl,
  USER_PERMISSION,
  USER_LIST_PERMISSION,
  USER_READ_PERMISSION,
  USER_CREATE_PERMISSION,
  USER_UPDATE_PERMISSION,
  USER_DELETE_PERMISSION,
} from "@/features/settings";

describe("user.utils", () => {
  describe("page titles", () => {
    it("has correct USER_LIST_PAGE_TITLE", () => {
      expect(USER_LIST_PAGE_TITLE).toBe("User Management");
    });

    it("has correct INTERNAL_USER_LIST_PAGE_TITLE", () => {
      expect(INTERNAL_USER_LIST_PAGE_TITLE).toBe("Internal Users");
    });

    it("has correct INTERNAL_USER_CREATE_PAGE_TITLE", () => {
      expect(INTERNAL_USER_CREATE_PAGE_TITLE).toBe("Add Internal User");
    });

    it("has correct INTERNAL_USER_UPDATE_PAGE_TITLE", () => {
      expect(INTERNAL_USER_UPDATE_PAGE_TITLE).toBe("Edit Internal User");
    });

    it("has correct INTERNAL_USER_DETAIL_PAGE_TITLE", () => {
      expect(INTERNAL_USER_DETAIL_PAGE_TITLE).toBe("View Internal User");
    });

    it("has correct EXTERNAL_USER_LIST_PAGE_TITLE", () => {
      expect(EXTERNAL_USER_LIST_PAGE_TITLE).toBe("External Users");
    });

    it("has correct EXTERNAL_USER_CREATE_PAGE_TITLE", () => {
      expect(EXTERNAL_USER_CREATE_PAGE_TITLE).toBe("Add External User");
    });

    it("has correct EXTERNAL_USER_UPDATE_PAGE_TITLE", () => {
      expect(EXTERNAL_USER_UPDATE_PAGE_TITLE).toBe("Edit External User");
    });

    it("has correct EXTERNAL_USER_DETAIL_PAGE_TITLE", () => {
      expect(EXTERNAL_USER_DETAIL_PAGE_TITLE).toBe("View External User");
    });

    it("has correct SETTINGS_PAGE_TITLE", () => {
      expect(SETTINGS_PAGE_TITLE).toBe("Settings");
    });
  });

  describe("URL constants", () => {
    it("has correct USER_BASE", () => {
      expect(USER_BASE).toBe("user");
    });

    it("has correct USER_URL", () => {
      expect(USER_URL).toBe("/setting/user");
    });
  });

  describe("URL helper functions", () => {
    it("userUrl() returns USER_URL", () => {
      expect(userUrl()).toBe(USER_URL);
    });

    it("internalUserCreateUrl() returns create URL", () => {
      expect(internalUserCreateUrl()).toBe("/setting/user/internal/add");
    });

    it("internalUserDetailUrl() returns URL with id", () => {
      expect(internalUserDetailUrl(5)).toBe("/setting/user/internal/5");
    });

    it("internalUserDetailUrl() accepts string id", () => {
      expect(internalUserDetailUrl("5")).toBe("/setting/user/internal/5");
    });

    it("internalUserEditUrl() returns URL with id", () => {
      expect(internalUserEditUrl(5)).toBe("/setting/user/internal/5/edit");
    });

    it("externalUserCreateUrl() returns create URL", () => {
      expect(externalUserCreateUrl()).toBe("/setting/user/external/add");
    });

    it("externalUserDetailUrl() returns URL with id", () => {
      expect(externalUserDetailUrl(5)).toBe("/setting/user/external/5");
    });

    it("externalUserDetailUrl() accepts string id", () => {
      expect(externalUserDetailUrl("5")).toBe("/setting/user/external/5");
    });

    it("externalUserEditUrl() returns URL with id", () => {
      expect(externalUserEditUrl(5)).toBe("/setting/user/external/5/edit");
    });
  });

  describe("permission constants", () => {
    it("has correct USER_PERMISSION prefix", () => {
      expect(USER_PERMISSION).toBe("setting:user:");
    });

    it("has correct USER_LIST_PERMISSION", () => {
      expect(USER_LIST_PERMISSION).toBe("setting:user:list");
    });

    it("has correct USER_READ_PERMISSION", () => {
      expect(USER_READ_PERMISSION).toBe("setting:user:read");
    });

    it("has correct USER_CREATE_PERMISSION", () => {
      expect(USER_CREATE_PERMISSION).toBe("setting:user:create");
    });

    it("has correct USER_UPDATE_PERMISSION", () => {
      expect(USER_UPDATE_PERMISSION).toBe("setting:user:update");
    });

    it("has correct USER_DELETE_PERMISSION", () => {
      expect(USER_DELETE_PERMISSION).toBe("setting:user:delete");
    });

    it("all action permissions start with USER_PERMISSION prefix", () => {
      const permissions = [
        USER_LIST_PERMISSION,
        USER_READ_PERMISSION,
        USER_CREATE_PERMISSION,
        USER_UPDATE_PERMISSION,
        USER_DELETE_PERMISSION,
      ];
      permissions.forEach((perm) => {
        expect(perm.startsWith(USER_PERMISSION)).toBe(true);
      });
    });

    it("all action permissions are distinct", () => {
      const permissions = [
        USER_LIST_PERMISSION,
        USER_READ_PERMISSION,
        USER_CREATE_PERMISSION,
        USER_UPDATE_PERMISSION,
        USER_DELETE_PERMISSION,
      ];
      expect(new Set(permissions).size).toBe(permissions.length);
    });
  });
});
