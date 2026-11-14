import {
  GL_ACCOUNT_BASE,
  GL_ACCOUNT_CREATE_PERMISSION,
  GL_ACCOUNT_DELETE_PERMISSION,
  GL_ACCOUNT_LIST_PAGE_TITLE,
  GL_ACCOUNT_LIST_PERMISSION,
  GL_ACCOUNT_PERMISSION,
  GL_ACCOUNT_READ_PERMISSION,
  GL_ACCOUNT_UPDATE_PERMISSION,
  GL_ACCOUNT_URL,
} from "@/features/master-data/general-ledger-account/data/gl-account.utils";
import { describe, expect, it } from "vitest";

describe("gl-account.utils", () => {
  describe("URL constants", () => {
    it("has correct GL_ACCOUNT_LIST_PAGE_TITLE", () => {
      expect(GL_ACCOUNT_LIST_PAGE_TITLE).toBe("GL Account");
    });

    it("has correct GL_ACCOUNT_BASE", () => {
      expect(GL_ACCOUNT_BASE).toBe("gl-account");
    });

    it("has correct GL_ACCOUNT_URL", () => {
      expect(GL_ACCOUNT_URL).toBe("/master-data/gl-account");
    });
  });

  describe("permission constants", () => {
    it("has correct GL_ACCOUNT_PERMISSION prefix", () => {
      expect(GL_ACCOUNT_PERMISSION).toBe("master-data:gl-account:");
    });

    it("has correct GL_ACCOUNT_LIST_PERMISSION", () => {
      expect(GL_ACCOUNT_LIST_PERMISSION).toBe("master-data:gl-account:list");
    });

    it("has correct GL_ACCOUNT_READ_PERMISSION", () => {
      expect(GL_ACCOUNT_READ_PERMISSION).toBe("master-data:gl-account:read");
    });

    it("has correct GL_ACCOUNT_CREATE_PERMISSION", () => {
      expect(GL_ACCOUNT_CREATE_PERMISSION).toBe("master-data:gl-account:create");
    });

    it("has correct GL_ACCOUNT_UPDATE_PERMISSION", () => {
      expect(GL_ACCOUNT_UPDATE_PERMISSION).toBe("master-data:gl-account:update");
    });

    it("has correct GL_ACCOUNT_DELETE_PERMISSION", () => {
      expect(GL_ACCOUNT_DELETE_PERMISSION).toBe("master-data:gl-account:delete");
    });

    it("all action permissions start with GL_ACCOUNT_PERMISSION prefix", () => {
      const permissions = [
        GL_ACCOUNT_LIST_PERMISSION,
        GL_ACCOUNT_READ_PERMISSION,
        GL_ACCOUNT_CREATE_PERMISSION,
        GL_ACCOUNT_UPDATE_PERMISSION,
        GL_ACCOUNT_DELETE_PERMISSION,
      ];

      permissions.forEach((permission) => {
        expect(permission).toMatch(/^master-data:/);
      });
    });

    it("all action permissions are distinct", () => {
      const permissions = [
        GL_ACCOUNT_LIST_PERMISSION,
        GL_ACCOUNT_READ_PERMISSION,
        GL_ACCOUNT_CREATE_PERMISSION,
        GL_ACCOUNT_UPDATE_PERMISSION,
        GL_ACCOUNT_DELETE_PERMISSION,
      ];
      const unique = new Set(permissions);
      expect(unique.size).toBe(permissions.length);
    });
  });
});
