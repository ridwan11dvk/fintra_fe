import { describe, expect, it } from "vitest";
import {
  COST_CENTER_BASE,
  COST_CENTER_CREATE_PERMISSION,
  COST_CENTER_DELETE_PERMISSION,
  COST_CENTER_LIST_PAGE_TITLE,
  COST_CENTER_LIST_PERMISSION,
  COST_CENTER_PERMISSION,
  COST_CENTER_READ_PERMISSION,
  COST_CENTER_UPDATE_PERMISSION,
  COST_CENTER_URL,
} from "@/features/master-data/cost-center/data/cost-center.utils";

describe("cost-center.utils", () => {
  describe("URL constants", () => {
    it("has correct COST_CENTER_LIST_PAGE_TITLE", () => {
      expect(COST_CENTER_LIST_PAGE_TITLE).toBe("Cost Center");
    });

    it("has correct COST_CENTER_BASE", () => {
      expect(COST_CENTER_BASE).toBe("cost-center");
    });

    it("has correct COST_CENTER_URL", () => {
      expect(COST_CENTER_URL).toBe("/master-data/cost-center");
    });
  });

  describe("permission constants", () => {
    it("has correct COST_CENTER_PERMISSION prefix", () => {
      expect(COST_CENTER_PERMISSION).toBe("master-data:cost-center:");
    });

    it("has correct COST_CENTER_LIST_PERMISSION", () => {
      expect(COST_CENTER_LIST_PERMISSION).toBe("master-data:cost-center:list");
    });

    it("has correct COST_CENTER_READ_PERMISSION", () => {
      expect(COST_CENTER_READ_PERMISSION).toBe("master-data:cost-center:read");
    });

    it("has correct COST_CENTER_CREATE_PERMISSION", () => {
      expect(COST_CENTER_CREATE_PERMISSION).toBe(
        "master-data:cost-center:create",
      );
    });

    it("has correct COST_CENTER_UPDATE_PERMISSION", () => {
      expect(COST_CENTER_UPDATE_PERMISSION).toBe(
        "master-data:cost-center:update",
      );
    });

    it("has correct COST_CENTER_DELETE_PERMISSION", () => {
      expect(COST_CENTER_DELETE_PERMISSION).toBe(
        "master-data:cost-center:delete",
      );
    });

    it("all action permissions start with COST_CENTER_PERMISSION prefix", () => {
      const permissions = [
        COST_CENTER_LIST_PERMISSION,
        COST_CENTER_READ_PERMISSION,
        COST_CENTER_CREATE_PERMISSION,
        COST_CENTER_UPDATE_PERMISSION,
        COST_CENTER_DELETE_PERMISSION,
      ];

      permissions.forEach((permission) => {
        expect(permission).toMatch(/^master-data:cost-center:/);
      });
    });

    it("all action permissions are distinct", () => {
      const permissions = [
        COST_CENTER_LIST_PERMISSION,
        COST_CENTER_READ_PERMISSION,
        COST_CENTER_CREATE_PERMISSION,
        COST_CENTER_UPDATE_PERMISSION,
        COST_CENTER_DELETE_PERMISSION,
      ];
      const unique = new Set(permissions);
      expect(unique.size).toBe(permissions.length);
    });
  });
});
