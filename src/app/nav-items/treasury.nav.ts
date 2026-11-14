import {
  CLOSE_PAYMENT_BASE,
  CLOSE_PAYMENT_LIST_PAGE_TITLE,
  CLOSE_PAYMENT_URL,
  DEPOSIT_BASE,
  DEPOSIT_LIST_PAGE_TITLE,
  DEPOSIT_URL,
  DIGITAL_VAULT_BASE,
  DIGITAL_VAULT_LIST_PAGE_TITLE,
  DIGITAL_VAULT_URL,
  TREASURY_DASHBOARD_BASE,
  TREASURY_DASHBOARD_URL,
} from "@/features/treasury";
import type { NavItem } from "@railfinance/core/types";
import {
  Banknote,
  BanknoteArrowDown,
  BanknoteArrowUp,
  Clock,
  Coins,
  DollarSign,
  FileChartColumn,
  House,
  Vault,
} from "lucide-react";

export const treasuryNav: NavItem = {
  title: "Treasury",
  key: "treasury",
  url: "#",
  icon: Banknote,
  items: [
    {
      title: "Dashboard",
      key: TREASURY_DASHBOARD_BASE,
      url: TREASURY_DASHBOARD_URL,
      icon: House,
    },
    {
      title: "Incoming Payment",
      key: "incoming-payment",
      url: "/treasury/incoming-payment",
      icon: BanknoteArrowDown,
      items: [
        {
          title: CLOSE_PAYMENT_LIST_PAGE_TITLE,
          key: CLOSE_PAYMENT_BASE,
          url: CLOSE_PAYMENT_URL,
          icon: Clock,
        },
        {
          title: DEPOSIT_LIST_PAGE_TITLE,
          key: DEPOSIT_BASE,
          url: DEPOSIT_URL,
          icon: BanknoteArrowDown,
        },

        {
          title: "Settlement",
          key: "settlement",
          url: "/treasury/incoming-payment/settlement",
          icon: Clock,
        },
        {
          title: "Receipt",
          key: "receipt",
          url: "/treasury/incoming-payment/receipt",
          icon: FileChartColumn,
        },
        {
          title: DIGITAL_VAULT_LIST_PAGE_TITLE,
          key: DIGITAL_VAULT_BASE,
          url: DIGITAL_VAULT_URL,
          icon: Vault,
        },
      ],
    },
    {
      title: "Outgoing Payment",
      key: "outgoing-payment",
      url: "/treasury/outgoing-payment",
      icon: BanknoteArrowUp,
      items: [
        {
          title: "Single Payment",
          key: "single-payment",
          url: "/treasury/outgoing-payment/single-payment",
          icon: DollarSign,
        },
        {
          title: "Bulk Payment",
          key: "bulk-payment",
          url: "/treasury/outgoing-payment/bulk-payment",
          icon: Coins,
        },
        {
          title: "Autodebet",
          key: "autodebet",
          url: "/treasury/outgoing-payment/autodebet",
          icon: BanknoteArrowUp,
        },
      ],
    },
    {
      title: "Dropping",
      key: "dropping",
      url: "/treasury/dropping",
      icon: Vault,
    },
  ],
};
