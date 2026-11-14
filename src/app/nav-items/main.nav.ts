import type { NavGroup } from "@railfinance/core/types";
import { dashboardNav } from "./dashboard.nav";
import { masterDataNav } from "./master-data.nav";
import { settingNav } from "./setting.nav";

export const mainNavItems: NavGroup[] = [
  {
    title: "",
    items: [
      dashboardNav,
      // {
      //   title: "Payable",
      //   key: "payable",
      //   url: "/payable",
      //   icon: Coins,
      //   openInNewTab: false,
      // },
      // {
      //   title: "Receivable",
      //   key: "receivable",
      //   url: "/receivable",
      //   icon: HandCoins,
      //   openInNewTab: false,
      // },
      // {
      //   title: "Treasury",
      //   key: "treasury",
      //   url: "/treasury",
      //   icon: Banknote,
      //   openInNewTab: false,
      // },
      // {
      //   title: "Tax",
      //   key: "tax",
      //   url: "/tax",
      //   icon: Scale,
      //   openInNewTab: false,
      // },
      // {
      //   title: "Reporting",
      //   key: "reporting",
      //   url: "/reporting",
      //   icon: FileChartColumn,
      //   openInNewTab: false,
      // },
      // {
      //   title: "Monitoring",
      //   key: "monitoring",
      //   url: "/monitoring",
      //   icon: Activity,
      //   openInNewTab: false,
      // },
      masterDataNav,
      settingNav,
    ],
  },
];
