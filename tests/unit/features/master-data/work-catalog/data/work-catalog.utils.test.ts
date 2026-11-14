import {
  WORK_CATALOG_BASE,
  WORK_CATALOG_CREATE_PAGE_TITLE,
  WORK_CATALOG_CREATE_PERMISSION,
  WORK_CATALOG_CREATE_URL,
  WORK_CATALOG_DELETE_PERMISSION,
  WORK_CATALOG_DETAIL_PAGE_TITLE,
  WORK_CATALOG_EDIT_PAGE_TITLE,
  WORK_CATALOG_LIST_PAGE_TITLE,
  WORK_CATALOG_LIST_PERMISSION,
  WORK_CATALOG_READ_PERMISSION,
  WORK_CATALOG_UPDATE_PERMISSION,
  WORK_CATALOG_URL,
  getWorkCatalogDetailUrl,
  getWorkCatalogEditUrl,
} from "@/features/master-data/work-catalog/data/work-catalog.utils";
import { describe, expect, it } from "vitest";

describe("work catalog utils", () => {
  it("builds list, create, detail, and edit urls", () => {
    expect(WORK_CATALOG_BASE).toBe("work-catalog");
    expect(WORK_CATALOG_URL).toBe("/master-data/work-catalog");
    expect(WORK_CATALOG_CREATE_URL).toBe("/master-data/work-catalog/create");
    expect(getWorkCatalogDetailUrl(7)).toBe("/master-data/work-catalog/7");
    expect(getWorkCatalogEditUrl("7")).toBe("/master-data/work-catalog/7/edit");
  });

  it("uses the work catalog page titles", () => {
    expect(WORK_CATALOG_LIST_PAGE_TITLE).toBe("Work Catalog");
    expect(WORK_CATALOG_CREATE_PAGE_TITLE).toBe("Add Work Catalog");
    expect(WORK_CATALOG_EDIT_PAGE_TITLE).toBe("Edit Work Catalog");
    expect(WORK_CATALOG_DETAIL_PAGE_TITLE).toBe("Detail Work Catalog");
  });

  it("builds permission codes from the work catalog prefix", () => {
    expect(WORK_CATALOG_LIST_PERMISSION).toBe("master-data:work-catalog:list");
    expect(WORK_CATALOG_READ_PERMISSION).toBe("master-data:work-catalog:read");
    expect(WORK_CATALOG_CREATE_PERMISSION).toBe(
      "master-data:work-catalog:create",
    );
    expect(WORK_CATALOG_UPDATE_PERMISSION).toBe(
      "master-data:work-catalog:update",
    );
    expect(WORK_CATALOG_DELETE_PERMISSION).toBe(
      "master-data:work-catalog:delete",
    );
  });
});
