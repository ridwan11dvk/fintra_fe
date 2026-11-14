import { describe, expect, it } from "vitest";
import {
  BUSINESS_AREA_BASE,
  BUSINESS_AREA_CREATE_PERMISSION,
  BUSINESS_AREA_DELETE_PERMISSION,
  BUSINESS_AREA_EXPORT_PERMISSION,
  BUSINESS_AREA_IMPORT_PERMISSION,
  BUSINESS_AREA_LIST_PAGE_TITLE,
  BUSINESS_AREA_LIST_PERMISSION,
  BUSINESS_AREA_PERMISSION,
  BUSINESS_AREA_READ_PERMISSION,
  BUSINESS_AREA_UPDATE_PERMISSION,
  BUSINESS_AREA_URL,
} from "@/features/master-data/business-area/data/business-area.utils";

describe("businessArea.utils", () => {
  it("has correct URL constants", () => {
    expect(BUSINESS_AREA_LIST_PAGE_TITLE).toBe("Business Area");
    expect(BUSINESS_AREA_BASE).toBe("business-area");
    expect(BUSINESS_AREA_URL).toBe("/master-data/business-area");
  });

  it("has correct permission constants", () => {
    expect(BUSINESS_AREA_PERMISSION).toBe("master-data:business-area:");
    expect(BUSINESS_AREA_LIST_PERMISSION).toBe("master-data:business-area:list");
    expect(BUSINESS_AREA_READ_PERMISSION).toBe("master-data:business-area:read");
    expect(BUSINESS_AREA_CREATE_PERMISSION).toBe(
      "master-data:business-area:create",
    );
    expect(BUSINESS_AREA_UPDATE_PERMISSION).toBe(
      "master-data:business-area:update",
    );
    expect(BUSINESS_AREA_DELETE_PERMISSION).toBe(
      "master-data:business-area:delete",
    );
    expect(BUSINESS_AREA_EXPORT_PERMISSION).toBe(
      "master-data:business-area:export",
    );
    expect(BUSINESS_AREA_IMPORT_PERMISSION).toBe(
      "master-data:business-area:import",
    );
  });

  it("all action permissions are distinct and use the same prefix", () => {
    const permissions = [
      BUSINESS_AREA_LIST_PERMISSION,
      BUSINESS_AREA_READ_PERMISSION,
      BUSINESS_AREA_CREATE_PERMISSION,
      BUSINESS_AREA_UPDATE_PERMISSION,
      BUSINESS_AREA_DELETE_PERMISSION,
      BUSINESS_AREA_EXPORT_PERMISSION,
      BUSINESS_AREA_IMPORT_PERMISSION,
    ];

    permissions.forEach((permission) => {
      expect(permission).toMatch(/^master-data:business-area:/);
    });

    expect(new Set(permissions).size).toBe(permissions.length);
  });
});
