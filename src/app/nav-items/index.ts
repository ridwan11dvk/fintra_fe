import type { NavGroup } from "@railfinance/core/types";
import { dashboardNav } from "./dashboard.nav";
import { masterDataNav } from "./master-data.nav";
import { monitoringNav } from "./monitoring.nav";
import { payableNav } from "./payable.nav";
import { receivableNav } from "./receivable.nav";
import { reportingNav } from "./reporting.nav";
import { settingNav } from "./setting.nav";
import { taxNav } from "./tax.nav";
import { treasuryNav } from "./treasury.nav";

export * from "./dashboard.nav";
export * from "./guest.nav";
export * from "./main.nav";
export * from "./master-data.nav";
export * from "./monitoring.nav";
export * from "./payable.nav";
export * from "./receivable.nav";
export * from "./reporting.nav";
export * from "./setting.nav";
export * from "./tax.nav";
export * from "./treasury.nav";

export const navItems: NavGroup[] = [
  {
    title: "",
    items: [
      dashboardNav,
      payableNav,
      receivableNav,
      treasuryNav,
      taxNav,
      reportingNav,
      monitoringNav,
      masterDataNav,
      settingNav,
    ],
  },
];
