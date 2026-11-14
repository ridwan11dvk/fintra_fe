import { describe, expect, it } from "vitest";
import {
  RECEIVABLE_DASHBOARD_BASE,
  RECEIVABLE_DASHBOARD_PAGE_TITLE,
  RECEIVABLE_DASHBOARD_URL,
} from "@/features/receivable/dashboard/data/receivable-dashboard.utils";

describe("receivable-dashboard.utils", () => {
  describe("URL constants", () => {
    it("has correct RECEIVABLE_DASHBOARD_PAGE_TITLE", () => {
      expect(RECEIVABLE_DASHBOARD_PAGE_TITLE).toBe("Receivable Dashboard");
    });

    it("has correct RECEIVABLE_DASHBOARD_BASE", () => {
      expect(RECEIVABLE_DASHBOARD_BASE).toBe("dashboard");
    });

    it("has correct RECEIVABLE_DASHBOARD_URL", () => {
      expect(RECEIVABLE_DASHBOARD_URL).toBe("/receivable/dashboard");
    });
  });
});
