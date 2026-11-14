import { describe, expect, it } from "vitest";
import {
  MONITORING_DASHBOARD_BASE,
  MONITORING_DASHBOARD_PAGE_TITLE,
  MONITORING_DASHBOARD_URL,
} from "@/features/monitoring/dashboard/data/monitoring-dashboard.utils";

describe("monitoring-dashboard.utils", () => {
  describe("URL constants", () => {
    it("has correct MONITORING_DASHBOARD_PAGE_TITLE", () => {
      expect(MONITORING_DASHBOARD_PAGE_TITLE).toBe("Monitoring Dashboard");
    });

    it("has correct MONITORING_DASHBOARD_BASE", () => {
      expect(MONITORING_DASHBOARD_BASE).toBe("dashboard");
    });

    it("has correct MONITORING_DASHBOARD_URL", () => {
      expect(MONITORING_DASHBOARD_URL).toBe("/monitoring/dashboard");
    });
  });
});
