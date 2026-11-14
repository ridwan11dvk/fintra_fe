import { describe, expect, it } from "vitest";
import {
  DASHBOARD_BASE,
  DASHBOARD_LIST_PAGE_TITLE,
  DASHBOARD_URL,
} from "@/features/dashboard/data/dashboard.utils";

describe("dashboard.utils", () => {
  describe("URL constants", () => {
    it("has correct DASHBOARD_LIST_PAGE_TITLE", () => {
      expect(DASHBOARD_LIST_PAGE_TITLE).toBe("Dashboard");
    });

    it("has correct DASHBOARD_BASE", () => {
      expect(DASHBOARD_BASE).toBe("dashboard");
    });

    it("has correct DASHBOARD_URL", () => {
      expect(DASHBOARD_URL).toBe("/dashboard");
    });
  });
});
