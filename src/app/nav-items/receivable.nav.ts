import {
  RECEIVABLE_DASHBOARD_BASE,
  RECEIVABLE_DASHBOARD_URL,
} from "@/features/receivable";
import type { NavItem } from "@railfinance/core/types";
import {
  Activity,
  FileChartColumn,
  HandCoins,
  House,
  TrendingUp,
} from "lucide-react";

export const receivableNav: NavItem = {
  title: "Receivable",
  key: "receivable",
  url: "#",
  icon: HandCoins,
  items: [
    {
      title: "Dashboard",
      key: RECEIVABLE_DASHBOARD_BASE,
      url: RECEIVABLE_DASHBOARD_URL,
      icon: House,
    },
    {
      title: "Billing Request",
      key: "billing-request",
      url: "/receivable/billing-request",
      icon: FileChartColumn,
    },
    {
      title: "Billing Transaction",
      key: "billing-transaction",
      url: "/receivable/billing-transaction",
      icon: Activity,
    },
    {
      title: "Collector Performance",
      key: "collector-performance",
      url: "/receivable/collector-performance",
      icon: TrendingUp,
    },
  ],
};
