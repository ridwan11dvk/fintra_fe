import { describe, expect, it } from "vitest";
import { navigationMenuSchema } from "@/features/settings/menu-management/data/menu-management.schema";

const validMenu = {
  code: "DASHBOARD",
  title: "Dashboard",
  titleEn: "Dashboard EN",
  url: "/dashboard",
  icon: "LayoutDashboard",
  type: "MENU" as const,
  category: "USER_MENU" as const,
  sortOrder: 1,
  openInNewTab: false,
  badge: "New",
  parentId: null,
  featureId: 10,
  moduleId: 5,
};

describe("navigationMenuSchema", () => {
  it("accepts a valid menu payload", () => {
    const result = navigationMenuSchema.safeParse(validMenu);
    expect(result.success).toBe(true);
  });

  it("accepts minimal nullable/optional fields", () => {
    const result = navigationMenuSchema.safeParse({
      code: "HOME",
      title: "Home",
      url: "/",
      type: "GROUP",
      category: "GUEST_HEADER",
      sortOrder: 0,
      openInNewTab: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing required code", () => {
    const result = navigationMenuSchema.safeParse({ ...validMenu, code: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing required title", () => {
    const result = navigationMenuSchema.safeParse({ ...validMenu, title: "   " });
    expect(result.success).toBe(false);
  });

  it("rejects missing required url", () => {
    const result = navigationMenuSchema.safeParse({ ...validMenu, url: "" });
    expect(result.success).toBe(false);
  });

  it("rejects titleEn longer than 150 characters", () => {
    const result = navigationMenuSchema.safeParse({
      ...validMenu,
      titleEn: "a".repeat(151),
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid type", () => {
    const result = navigationMenuSchema.safeParse({
      ...validMenu,
      type: "INVALID",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid category", () => {
    const result = navigationMenuSchema.safeParse({
      ...validMenu,
      category: "INVALID",
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative sortOrder", () => {
    const result = navigationMenuSchema.safeParse({
      ...validMenu,
      sortOrder: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer sortOrder", () => {
    const result = navigationMenuSchema.safeParse({
      ...validMenu,
      sortOrder: 1.5,
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-positive parentId", () => {
    const result = navigationMenuSchema.safeParse({
      ...validMenu,
      parentId: 0,
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-positive featureId", () => {
    const result = navigationMenuSchema.safeParse({
      ...validMenu,
      featureId: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-positive moduleId", () => {
    const result = navigationMenuSchema.safeParse({
      ...validMenu,
      moduleId: 0,
    });
    expect(result.success).toBe(false);
  });
});
