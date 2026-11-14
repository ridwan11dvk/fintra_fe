import {
  KBLI_BASE,
  KBLI_CREATE_PERMISSION,
  KBLI_CREATE_URL,
  KBLI_DETAIL_PERMISSION,
  KBLI_EDIT_PERMISSION,
  KBLI_LIST_PAGE_TITLE,
  KBLI_LIST_PERMISSION,
  KBLI_PERMISSION,
  KBLI_URL,
  kbliDetailUrl,
  kbliEditUrl,
  kbliQueryKeys,
} from "@/features/master-data/kbli/data/kbli.utils";
import { describe, expect, it } from "vitest";

describe("kbli.utils", () => {
  it("[FSSC-KBLI-001] exposes list page title and routes", () => {
    expect(KBLI_LIST_PAGE_TITLE).toBe("KBLI");
    expect(KBLI_BASE).toBe("kbli");
    expect(KBLI_URL).toBe("/master-data/kbli");
    expect(KBLI_CREATE_URL).toBe("/master-data/kbli/create");
    expect(kbliDetailUrl("7")).toBe("/master-data/kbli/7");
    expect(kbliEditUrl("7")).toBe("/master-data/kbli/7/edit");
  });

  it("defines distinct KBLI permissions", () => {
    const permissions = [
      KBLI_LIST_PERMISSION,
      KBLI_DETAIL_PERMISSION,
      KBLI_CREATE_PERMISSION,
      KBLI_EDIT_PERMISSION,
    ];

    expect(KBLI_PERMISSION).toBe("master-data:kbli:");
    permissions.forEach((permission) => {
      expect(permission).toMatch(/^master-data:kbli:/);
    });
    expect(new Set(permissions).size).toBe(permissions.length);
  });

  it("builds stable react-query keys", () => {
    expect(kbliQueryKeys.all).toEqual(["kbli"]);
    expect(kbliQueryKeys.list({ search: "47111", page: 1, pageSize: 10 })).toEqual([
      "kbli",
      "list",
      { search: "47111", page: 1, pageSize: 10 },
    ]);
    expect(kbliQueryKeys.detail("7")).toEqual(["kbli", "detail", "7"]);
  });
});
