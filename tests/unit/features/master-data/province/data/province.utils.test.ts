import { describe, expect, it } from "vitest";
import {
  PROVINCE_LIST_PAGE_TITLE,
  PROVINCE_BASE,
  PROVINCE_URL,
  PROVINCE_PERMISSION,
  PROVINCE_LIST_PERMISSION,
  PROVINCE_READ_PERMISSION,
  PROVINCE_CREATE_PERMISSION,
  PROVINCE_UPDATE_PERMISSION,
  PROVINCE_DELETE_PERMISSION,
} from "@/features/master-data/province/data/province.utils";

describe("province.utils", () => {
  describe("URL constants", () => {
    it("has correct PROVINCE_LIST_PAGE_TITLE", () => {
      expect(PROVINCE_LIST_PAGE_TITLE).toBe("Province");
    });

    it("has correct PROVINCE_BASE", () => {
      expect(PROVINCE_BASE).toBe("province");
    });

    it("has correct PROVINCE_URL", () => {
      expect(PROVINCE_URL).toBe("/master-data/province");
    });
  });

  describe("permission constants", () => {
    it("has correct PROVINCE_PERMISSION prefix", () => {
      expect(PROVINCE_PERMISSION).toBe("master-data:province:");
    });

    it("has correct PROVINCE_LIST_PERMISSION", () => {
      expect(PROVINCE_LIST_PERMISSION).toBe("master-data:province:list");
    });

    it("has correct PROVINCE_READ_PERMISSION", () => {
      expect(PROVINCE_READ_PERMISSION).toBe("master-data:province:read");
    });

    it("has correct PROVINCE_CREATE_PERMISSION", () => {
      expect(PROVINCE_CREATE_PERMISSION).toBe("master-data:province:create");
    });

    it("has correct PROVINCE_UPDATE_PERMISSION", () => {
      expect(PROVINCE_UPDATE_PERMISSION).toBe("master-data:province:update");
    });

    it("has correct PROVINCE_DELETE_PERMISSION", () => {
      expect(PROVINCE_DELETE_PERMISSION).toBe("master-data:province:delete");
    });

    it("all action permissions start with PROVINCE_PERMISSION prefix", () => {
      const actions = [
        PROVINCE_LIST_PERMISSION,
        PROVINCE_READ_PERMISSION,
        PROVINCE_CREATE_PERMISSION,
        PROVINCE_UPDATE_PERMISSION,
        PROVINCE_DELETE_PERMISSION,
      ];
      actions.forEach((perm) => {
        expect(perm.startsWith(PROVINCE_PERMISSION)).toBe(true);
      });
    });

    it("all action permissions are distinct", () => {
      const actions = [
        PROVINCE_LIST_PERMISSION,
        PROVINCE_READ_PERMISSION,
        PROVINCE_CREATE_PERMISSION,
        PROVINCE_UPDATE_PERMISSION,
        PROVINCE_DELETE_PERMISSION,
      ];
      expect(new Set(actions).size).toBe(actions.length);
    });
  });
});
