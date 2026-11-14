import { describe, expect, it } from "vitest";
import {
  TREASURY_DASHBOARD_BASE,
  TREASURY_DASHBOARD_PAGE_TITLE,
  TREASURY_DASHBOARD_URL,
} from "@/features/treasury/dashboard/data/treasury-dashboard.utils";

describe("treasury-dashboard.utils", () => {
  describe("URL constants", () => {
    it("has correct TREASURY_DASHBOARD_PAGE_TITLE", () => {
      expect(TREASURY_DASHBOARD_PAGE_TITLE).toBe("Treasury Dashboard");
    });

    it("has correct TREASURY_DASHBOARD_BASE", () => {
      expect(TREASURY_DASHBOARD_BASE).toBe("dashboard");
    });

    it("has correct TREASURY_DASHBOARD_URL", () => {
      expect(TREASURY_DASHBOARD_URL).toBe("/treasury/dashboard");
    });
  });
});
