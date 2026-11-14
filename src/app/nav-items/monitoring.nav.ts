import {
  MONITORING_DASHBOARD_BASE,
  MONITORING_DASHBOARD_URL,
  POSTING_ASSET_LEGACY_BASE,
  POSTING_ASSET_LEGACY_LIST_PAGE_TITLE,
  POSTING_ASSET_LEGACY_URL,
  POSTING_AUTO_LEGACY_BASE,
  POSTING_AUTO_LEGACY_LIST_PAGE_TITLE,
  POSTING_AUTO_LEGACY_URL,
} from "@/features/monitoring";
import type { NavItem } from "@railfinance/core/types";
import {
  Activity,
  BanknoteArrowDown,
  FileChartColumn,
  House,
} from "lucide-react";

export const monitoringNav: NavItem = {
  title: "Monitoring",
  key: "monitoring",
  url: "/monitoring",
  icon: Activity,
  items: [
    {
      title: "Dashboard",
      key: MONITORING_DASHBOARD_BASE,
      url: MONITORING_DASHBOARD_URL,
      icon: House,
    },
    {
      title: POSTING_ASSET_LEGACY_LIST_PAGE_TITLE,
      key: POSTING_ASSET_LEGACY_BASE,
      url: POSTING_ASSET_LEGACY_URL,
      icon: FileChartColumn,
    },
    {
      title: POSTING_AUTO_LEGACY_LIST_PAGE_TITLE,
      key: POSTING_AUTO_LEGACY_BASE,
      url: POSTING_AUTO_LEGACY_URL,
      icon: BanknoteArrowDown,
    },
  ],
};
