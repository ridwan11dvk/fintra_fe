import { describe, expect, it } from "vitest";
import {
  TAX_RATE_LIST_PAGE_TITLE,
  TAX_RATE_BASE,
  TAX_RATE_URL,
  TAX_RATE_PERMISSION,
  TAX_RATE_LIST_PERMISSION,
  TAX_RATE_READ_PERMISSION,
  TAX_RATE_CREATE_PERMISSION,
  TAX_RATE_UPDATE_PERMISSION,
  TAX_RATE_DELETE_PERMISSION,
} from "@/features/master-data/tax-rate/data/tax-rate.utils";

describe("tax-rate.utils", () => {
  describe("URL constants", () => {
    it("has correct TAX_RATE_LIST_PAGE_TITLE", () => {
      expect(TAX_RATE_LIST_PAGE_TITLE).toBe("Tax Rate");
    });

    it("has correct TAX_RATE_BASE", () => {
      expect(TAX_RATE_BASE).toBe("tax-rate");
    });

    it("has correct TAX_RATE_URL", () => {
      expect(TAX_RATE_URL).toBe("/master-data/tax-rate");
    });
  });

  describe("permission constants", () => {
    it("has correct TAX_RATE_PERMISSION prefix", () => {
      expect(TAX_RATE_PERMISSION).toBe("master-data:tax-rate:");
    });

    it("has correct TAX_RATE_LIST_PERMISSION", () => {
      expect(TAX_RATE_LIST_PERMISSION).toBe("master-data:tax-rate:list");
    });

    it("has correct TAX_RATE_READ_PERMISSION", () => {
      expect(TAX_RATE_READ_PERMISSION).toBe("master-data:tax-rate:read");
    });

    it("has correct TAX_RATE_CREATE_PERMISSION", () => {
      expect(TAX_RATE_CREATE_PERMISSION).toBe("master-data:tax-rate:create");
    });

    it("has correct TAX_RATE_UPDATE_PERMISSION", () => {
      expect(TAX_RATE_UPDATE_PERMISSION).toBe("master-data:tax-rate:update");
    });

    it("has correct TAX_RATE_DELETE_PERMISSION", () => {
      expect(TAX_RATE_DELETE_PERMISSION).toBe("master-data:tax-rate:delete");
    });

    it("all action permissions start with TAX_RATE_PERMISSION prefix", () => {
      const actions = [
        TAX_RATE_LIST_PERMISSION,
        TAX_RATE_READ_PERMISSION,
        TAX_RATE_CREATE_PERMISSION,
        TAX_RATE_UPDATE_PERMISSION,
        TAX_RATE_DELETE_PERMISSION,
      ];
      actions.forEach((perm) => {
        expect(perm.startsWith(TAX_RATE_PERMISSION)).toBe(true);
      });
    });

    it("all action permissions are distinct", () => {
      const actions = [
        TAX_RATE_LIST_PERMISSION,
        TAX_RATE_READ_PERMISSION,
        TAX_RATE_CREATE_PERMISSION,
        TAX_RATE_UPDATE_PERMISSION,
        TAX_RATE_DELETE_PERMISSION,
      ];
      expect(new Set(actions).size).toBe(actions.length);
    });
  });
});
