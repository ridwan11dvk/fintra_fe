import { describe, expect, it } from "vitest";

describe("menu-management barrel exports", () => {
  it("exports data modules", async () => {
    const mod = await import("@/features/settings/menu-management/data");
    expect(mod).toHaveProperty("menuManagementService");
    expect(mod).toHaveProperty("menuManagementQueryKeys");
    expect(mod).toHaveProperty("navigationMenuSchema");
  });

  it("exports components", async () => {
    const mod = await import("@/features/settings/menu-management/components");
    expect(mod).toHaveProperty("MenuForm");
    expect(mod).toHaveProperty("MenuList");
  });

  it("exports pages and routes", async () => {
    const pages = await import("@/features/settings/menu-management/pages");
    const routes = await import("@/features/settings/menu-management/routes");
    expect(pages).toHaveProperty("MenuManagementPage");
    expect(routes).toHaveProperty("menuManagementRoutes");
  });
});
