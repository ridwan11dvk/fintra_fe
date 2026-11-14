import { describe, expect, it } from "vitest";
import {
  PORT_LIST_PAGE_TITLE,
  PORT_BASE,
  PORT_URL,
  PORT_PERMISSION,
  PORT_LIST_PERMISSION,
  PORT_READ_PERMISSION,
  PORT_CREATE_PERMISSION,
  PORT_UPDATE_PERMISSION,
  PORT_DELETE_PERMISSION,
} from "@/features/master-data/port/data/port.utils";

describe("port.utils", () => {
  describe("URL constants", () => {
    it("has correct PORT_LIST_PAGE_TITLE", () => {
      expect(PORT_LIST_PAGE_TITLE).toBe("Port");
    });

    it("has correct PORT_BASE", () => {
      expect(PORT_BASE).toBe("port");
    });

    it("has correct PORT_URL", () => {
      expect(PORT_URL).toBe("/master-data/port");
    });
  });

  describe("permission constants", () => {
    it("has correct PORT_PERMISSION prefix", () => {
      expect(PORT_PERMISSION).toBe("master-data:port:");
    });

    it("has correct PORT_LIST_PERMISSION", () => {
      expect(PORT_LIST_PERMISSION).toBe("master-data:port:list");
    });

    it("has correct PORT_READ_PERMISSION", () => {
      expect(PORT_READ_PERMISSION).toBe("master-data:port:read");
    });

    it("has correct PORT_CREATE_PERMISSION", () => {
      expect(PORT_CREATE_PERMISSION).toBe("master-data:port:create");
    });

    it("has correct PORT_UPDATE_PERMISSION", () => {
      expect(PORT_UPDATE_PERMISSION).toBe("master-data:port:update");
    });

    it("has correct PORT_DELETE_PERMISSION", () => {
      expect(PORT_DELETE_PERMISSION).toBe("master-data:port:delete");
    });

    it("all action permissions start with PORT_PERMISSION prefix", () => {
      const actions = [
        PORT_LIST_PERMISSION,
        PORT_READ_PERMISSION,
        PORT_CREATE_PERMISSION,
        PORT_UPDATE_PERMISSION,
        PORT_DELETE_PERMISSION,
      ];
      actions.forEach((perm) => {
        expect(perm.startsWith(PORT_PERMISSION)).toBe(true);
      });
    });

    it("all action permissions are distinct", () => {
      const actions = [
        PORT_LIST_PERMISSION,
        PORT_READ_PERMISSION,
        PORT_CREATE_PERMISSION,
        PORT_UPDATE_PERMISSION,
        PORT_DELETE_PERMISSION,
      ];
      expect(new Set(actions).size).toBe(actions.length);
    });
  });
});
