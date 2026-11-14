import {
  REPORTING_DASHBOARD_BASE,
  REPORTING_DASHBOARD_URL,
} from "@/features/reporting";
import type { NavItem } from "@railfinance/core/types";
import { FileChartColumn, House } from "lucide-react";
export const reportingNav: NavItem = {
  title: "Reporting",
  key: "reporting",
  url: "#",
  icon: FileChartColumn,
  items: [
    {
      title: "Dashboard",
      key: REPORTING_DASHBOARD_BASE,
      url: REPORTING_DASHBOARD_URL,
      icon: House,
    },
  ],
};
