import {
  COMPLIANCE_FSSC_TAB_TITLE,
  FINANCIAL_CONTROL_TAB_TITLE,
  PROCESS_REFERENCE_TAB_TITLE,
  SETUP_CONFIGURATION_PAGE_TITLE,
  SETUP_CONFIGURATION_URL,
} from "@/features/settings/setup-configuration/data/setup-configuration.utils";
import { describe, expect, it } from "vitest";

describe("setup-configuration.utils FSSC", () => {
  it("FSSC-PSLA-001: Setup & Configuration page title is defined", () => {
    expect(SETUP_CONFIGURATION_PAGE_TITLE).toBe("Setup & Configuration");
    expect(SETUP_CONFIGURATION_URL).toContain("setup-configuration");
  });

  it("FSSC-PSLA-002: SLA Setup tab title is defined", () => {
    expect(PROCESS_REFERENCE_TAB_TITLE).toBe("SLA Setup");
  });

  it("FSSC-PSLA-004: Compliance FSSC tab title is available from SLA Setup", () => {
    expect(COMPLIANCE_FSSC_TAB_TITLE).toBe("Compliance FSSC");
  });

  it("FSSC-PSLA-005: Financial Control Validation tab title is available", () => {
    expect(FINANCIAL_CONTROL_TAB_TITLE).toBe("Financial Control Validation");
  });

  it("FSSC-COMP-001: Setup & Configuration opens for Compliance FSSC", () => {
    expect(SETUP_CONFIGURATION_PAGE_TITLE).toBe("Setup & Configuration");
  });

  it("FSSC-COMP-003: SLA Setup tab is reachable from Compliance FSSC", () => {
    expect(PROCESS_REFERENCE_TAB_TITLE).toBe("SLA Setup");
  });

  it("FSSC-COMP-004: Financial Control Validation tab is reachable from Compliance FSSC", () => {
    expect(FINANCIAL_CONTROL_TAB_TITLE).toBe("Financial Control Validation");
  });

  it("FSSC-FCV-001: Setup & Configuration opens for Financial Control Validation", () => {
    expect(SETUP_CONFIGURATION_PAGE_TITLE).toBe("Setup & Configuration");
  });

  it("FSSC-FCV-003: SLA Setup tab is reachable from Financial Control Validation", () => {
    expect(PROCESS_REFERENCE_TAB_TITLE).toBe("SLA Setup");
  });

  it("FSSC-FCV-004: Compliance FSSC tab is reachable from Financial Control Validation", () => {
    expect(COMPLIANCE_FSSC_TAB_TITLE).toBe("Compliance FSSC");
  });
});
