import {
  PAYABLE_DASHBOARD_BASE,
  PAYABLE_DASHBOARD_URL,
} from "@/features/payable";
import type { NavItem } from "@railfinance/core/types";
import { Banknote, Coins, DollarSign, HandCoins, House } from "lucide-react";
export const payableNav: NavItem = {
  title: "Payable",
  key: "payable",
  url: "#",
  icon: Coins,
  items: [
    {
      title: "Dashboard",
      key: PAYABLE_DASHBOARD_BASE,
      url: PAYABLE_DASHBOARD_URL,
      icon: House,
    },
    {
      title: "Cash Advance",
      key: "cash-advance",
      url: "/payable/cash-advance",
      icon: Coins,
      items: [
        {
          title: "Petty Cash",
          key: "petty-cash",
          url: "/payable/cash-advance/petty-cash",
          icon: Coins,
        },
        {
          title: "Operational Cash",
          key: "operational-cash",
          url: "/payable/cash-advance/operational-cash",
          icon: Banknote,
        },
      ],
    },
    {
      title: "Direct Transaction",
      key: "direct-transaction",
      url: "/payable/direct-transaction",
      icon: DollarSign,
      items: [
        {
          title: "Vendor Payment",
          key: "vendor-payment",
          url: "/payable/direct-transaction/vendor-payment",
          icon: DollarSign,
        },
        {
          title: "Billing Payment",
          key: "billing-payment",
          url: "/payable/direct-transaction/billing-payment",
          icon: DollarSign,
        },
        {
          title: "Utilities Payment",
          key: "utilities-payment",
          url: "/payable/direct-transaction/utilities-payment",
          icon: Banknote,
        },
      ],
    },
    {
      title: "Reimbursement",
      key: "reimbursement",
      url: "/payable/reimbursement",
      icon: HandCoins,
    },
  ],
};
