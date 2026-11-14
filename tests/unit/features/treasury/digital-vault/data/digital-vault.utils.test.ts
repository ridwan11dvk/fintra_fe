import {
  DIGITAL_VAULT_LIST_PAGE_TITLE,
  DIGITAL_VAULT_STATION_LIST_PAGE_TITLE,
  DIGITAL_VAULT_BASE,
  DIGITAL_VAULT_URL,
  DIGITAL_VAULT_PERMISSION,
  DIGITAL_VAULT_LIST_PERMISSION,
  DIGITAL_VAULT_READ_PERMISSION,
  DIGITAL_VAULT_CREATE_PERMISSION,
  DIGITAL_VAULT_UPDATE_PERMISSION,
  DIGITAL_VAULT_DELETE_PERMISSION,
  closuredetailUrl,
} from "@/features/treasury";
import { describe, expect, it } from "vitest";

describe("Digital Vault Utils", () => {
  describe("URL Constants", () => {
    it("should have correct list page title", () => {
      expect(DIGITAL_VAULT_LIST_PAGE_TITLE).toBe("Deposit Box");
    });

    it("should have correct station list page title", () => {
      expect(DIGITAL_VAULT_STATION_LIST_PAGE_TITLE).toBe(
        "Deposit Box - Station Summary",
      );
    });

    it("should have correct base path", () => {
      expect(DIGITAL_VAULT_BASE).toBe("deposit");
    });

    it("should have correct full URL", () => {
      expect(DIGITAL_VAULT_URL).toBe("/treasury/deposit");
    });
  });

  describe("Permission Constants", () => {
    it("should have correct base permission", () => {
      expect(DIGITAL_VAULT_PERMISSION).toBe("treasury:deposit:");
    });

    it("should have correct list permission", () => {
      expect(DIGITAL_VAULT_LIST_PERMISSION).toBe("treasury:deposit:list");
    });

    it("should have correct read permission", () => {
      expect(DIGITAL_VAULT_READ_PERMISSION).toBe("treasury:deposit:read");
    });

    it("should have correct create permission", () => {
      expect(DIGITAL_VAULT_CREATE_PERMISSION).toBe("treasury:deposit:create");
    });

    it("should have correct update permission", () => {
      expect(DIGITAL_VAULT_UPDATE_PERMISSION).toBe("treasury:deposit:update");
    });

    it("should have correct delete permission", () => {
      expect(DIGITAL_VAULT_DELETE_PERMISSION).toBe("treasury:deposit:delete");
    });
  });

  describe("closuredetailUrl", () => {
    it("should generate correct URL for a station name", () => {
      expect(closuredetailUrl("Station A")).toBe(
        "/treasury/deposit/Station%20A/closures",
      );
    });

    it("should handle special characters in station name", () => {
      expect(closuredetailUrl("Stätiön & Co.")).toBe(
        "/treasury/deposit/St%C3%A4ti%C3%B6n%20%26%20Co./closures",
      );
    });
  });
});
