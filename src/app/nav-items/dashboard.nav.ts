import {
  DASHBOARD_BASE,
  DASHBOARD_LIST_PAGE_TITLE,
  DASHBOARD_URL,
} from "@/features/dashboard/data/dashboard.utils";
import type { NavItem } from "@railfinance/core/types";
import { House } from "lucide-react";

export const dashboardNav: NavItem = {
  title: DASHBOARD_LIST_PAGE_TITLE,
  key: DASHBOARD_BASE,
  url: DASHBOARD_URL,
  icon: House,
};
