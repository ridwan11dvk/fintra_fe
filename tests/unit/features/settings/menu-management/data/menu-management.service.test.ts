import { describe, expect, it } from "vitest";
import { menuManagementService } from "@/features/settings/menu-management/data/menu-management.service";
import { mockGuestHeaderMenu, mockMenuItem } from "./menu-management.handlers";

describe("menuManagementService", () => {
  it("getMenuTree returns menus from all categories", async () => {
    const result = await menuManagementService.getMenuTree();

    expect(result).toHaveLength(2);
    expect(result[0].code).toBe(mockMenuItem.code);
    expect(result[1].code).toBe(mockGuestHeaderMenu.code);
  });

  it("getMenus returns flattened menus including children", async () => {
    const result = await menuManagementService.getMenus();

    expect(result).toHaveLength(3);
    expect(result.map((menu) => menu.id)).toEqual([1, 2, 3]);
  });

  it("getMenu fetches a menu by id", async () => {
    const result = await menuManagementService.getMenu(1);

    expect(result.id).toBe(1);
    expect(result.code).toBe("DASHBOARD");
  });

  it("createMenu posts menu payload", async () => {
    const result = await menuManagementService.createMenu({
      code: "NEW_MENU",
      title: "New Menu",
      titleEn: null,
      url: "/new",
      icon: null,
      type: "MENU",
      category: "USER_MENU",
      sortOrder: 1,
      openInNewTab: false,
      badge: null,
      parentId: null,
      featureId: null,
      moduleId: null,
    });

    expect(result.id).toBe(1);
  });

  it("updateMenu puts menu payload", async () => {
    const result = await menuManagementService.updateMenu(1, {
      code: "UPDATED",
      title: "Updated",
      titleEn: null,
      url: "/updated",
      icon: null,
      type: "MENU",
      category: "USER_MENU",
      sortOrder: 2,
      openInNewTab: false,
      badge: null,
      parentId: null,
      featureId: null,
      moduleId: null,
    });

    expect(result.id).toBe(1);
  });

  it("reorderMenus posts reorder payload", async () => {
    await expect(
      menuManagementService.reorderMenus({
        items: [{ id: 1, parentId: null, sortOrder: 1 }],
      }),
    ).resolves.toBeUndefined();
  });

  it("deleteMenu deletes menu by id", async () => {
    await expect(menuManagementService.deleteMenu(1)).resolves.toBeUndefined();
  });
});
