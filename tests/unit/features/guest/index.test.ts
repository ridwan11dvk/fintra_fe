import { describe, expect, it } from "vitest";

describe("guest barrel exports", () => {
  it("exports components", async () => {
    const mod = await import("@/features/guest/components");
    expect(mod).toHaveProperty("HeroSection");
    expect(mod).toHaveProperty("FAQSection");
    expect(mod).toHaveProperty("InvoiceTrackingSection");
    expect(mod).toHaveProperty("InvoiceTracker");
    expect(mod).toHaveProperty("ModuleSelector");
    expect(mod).toHaveProperty("PromoBanner");
    expect(mod).toHaveProperty("SupportSection");
    expect(mod).toHaveProperty("VendorPortalSection");
  });

  it("exports pages and routes", async () => {
    const pages = await import("@/features/guest/pages");
    const routes = await import("@/features/guest/routes");
    expect(pages).toHaveProperty("HomeLazyPage");
    expect(pages).toHaveProperty("SelectModuleLazyPage");
    expect(routes).toHaveProperty("guestRoutes");
  });
});
