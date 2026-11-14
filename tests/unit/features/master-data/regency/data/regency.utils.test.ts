import { describe, expect, it } from "vitest";
import {
  REGENCY_LIST_PAGE_TITLE,
  REGENCY_BASE,
  REGENCY_URL,
  REGENCY_PERMISSION,
  REGENCY_LIST_PERMISSION,
  REGENCY_READ_PERMISSION,
  REGENCY_CREATE_PERMISSION,
  REGENCY_UPDATE_PERMISSION,
  REGENCY_DELETE_PERMISSION,
} from "@/features/master-data/regency/data/regency.utils";

describe("regency.utils", () => {
  describe("URL constants", () => {
    it("has correct REGENCY_LIST_PAGE_TITLE", () => {
      expect(REGENCY_LIST_PAGE_TITLE).toBe("Regency");
    });

    it("has correct REGENCY_BASE", () => {
      expect(REGENCY_BASE).toBe("regency");
    });

    it("has correct REGENCY_URL", () => {
      expect(REGENCY_URL).toBe("/master-data/regency");
    });
  });

  describe("permission constants", () => {
    it("has correct REGENCY_PERMISSION prefix", () => {
      expect(REGENCY_PERMISSION).toBe("master-data:regency:");
    });

    it("has correct REGENCY_LIST_PERMISSION", () => {
      expect(REGENCY_LIST_PERMISSION).toBe("master-data:regency:list");
    });

    it("has correct REGENCY_READ_PERMISSION", () => {
      expect(REGENCY_READ_PERMISSION).toBe("master-data:regency:read");
    });

    it("has correct REGENCY_CREATE_PERMISSION", () => {
      expect(REGENCY_CREATE_PERMISSION).toBe("master-data:regency:create");
    });

    it("has correct REGENCY_UPDATE_PERMISSION", () => {
      expect(REGENCY_UPDATE_PERMISSION).toBe("master-data:regency:update");
    });

    it("has correct REGENCY_DELETE_PERMISSION", () => {
      expect(REGENCY_DELETE_PERMISSION).toBe("master-data:regency:delete");
    });

    it("all action permissions start with REGENCY_PERMISSION prefix", () => {
      const actions = [
        REGENCY_LIST_PERMISSION,
        REGENCY_READ_PERMISSION,
        REGENCY_CREATE_PERMISSION,
        REGENCY_UPDATE_PERMISSION,
        REGENCY_DELETE_PERMISSION,
      ];
      actions.forEach((perm) => {
        expect(perm.startsWith(REGENCY_PERMISSION)).toBe(true);
      });
    });

    it("all action permissions are distinct", () => {
      const actions = [
        REGENCY_LIST_PERMISSION,
        REGENCY_READ_PERMISSION,
        REGENCY_CREATE_PERMISSION,
        REGENCY_UPDATE_PERMISSION,
        REGENCY_DELETE_PERMISSION,
      ];
      expect(new Set(actions).size).toBe(actions.length);
    });
  });
});
