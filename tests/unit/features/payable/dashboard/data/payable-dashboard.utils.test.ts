import { describe, expect, it } from "vitest";
import {
  PAYABLE_DASHBOARD_BASE,
  PAYABLE_DASHBOARD_PAGE_TITLE,
  PAYABLE_DASHBOARD_URL,
} from "@/features/payable/dashboard/data/payable-dashboard.utils";

describe("payable-dashboard.utils", () => {
  describe("URL constants", () => {
    it("has correct PAYABLE_DASHBOARD_PAGE_TITLE", () => {
      expect(PAYABLE_DASHBOARD_PAGE_TITLE).toBe("Payable Dashboard");
    });

    it("has correct PAYABLE_DASHBOARD_BASE", () => {
      expect(PAYABLE_DASHBOARD_BASE).toBe("dashboard");
    });

    it("has correct PAYABLE_DASHBOARD_URL", () => {
      expect(PAYABLE_DASHBOARD_URL).toBe("/payable/dashboard");
    });
  });
});
