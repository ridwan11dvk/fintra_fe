import type { NavItem } from "@railfinance/core/types";
import {
  Building,
  ChartNoAxesColumn,
  Clock,
  Scale,
  TrendingUp,
  Users,
  Vault,
} from "lucide-react";

export const taxNav: NavItem = {
  title: "Tax",
  key: "tax",
  url: "#",
  icon: Scale,
  items: [
    {
      title: "Dashboard",
      key: "tax-dashboard",
      url: "/tax/dashboard",
      icon: ChartNoAxesColumn,
    },
    {
      title: "Value Added Tax",
      key: "vat",
      url: "/tax/vat",
      icon: Scale,
      items: [
        {
          title: "VAT In",
          key: "vat-in",
          url: "/tax/vat/vat-in",
          icon: Scale,
        },
        {
          title: "VAT Out",
          key: "vat-out",
          url: "/tax/vat/vat-out",
          icon: Scale,
        },
        {
          title: "Tax Facility",
          key: "tax-facility",
          url: "/tax/vat/tax-facility",
          icon: Scale,
        },
      ],
    },
    {
      title: "Withholding Tax",
      key: "withholding-tax",
      url: "/tax/withholding-tax",
      icon: Scale,
      items: [
        {
          title: "Personal Income Tax",
          key: "personal-income-tax",
          url: "/tax/withholding-tax/personal-income-tax",
          icon: Users,
        },
        {
          title: "WHT Unified Tax",
          key: "wht-unified-tax",
          url: "/tax/withholding-tax/wht-unified-tax",
          icon: Scale,
        },
        {
          title: "Corporate Income Tax",
          key: "corporate-income-tax",
          url: "/tax/withholding-tax/corporate-income-tax",
          icon: Building,
        },
      ],
    },
    {
      title: "Tax Installment",
      key: "tax-installment",
      url: "/tax/tax-installment",
      icon: Clock,
    },
    {
      title: "Tax Deposit",
      key: "tax-deposit",
      url: "/tax/tax-deposit",
      icon: Vault,
    },
    {
      title: "Transfer Pricing",
      key: "transfer-pricing",
      url: "/tax/transfer-pricing",
      icon: TrendingUp,
    },
  ],
};
