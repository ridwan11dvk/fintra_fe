import {
  ACCESS_REQUEST_BASE,
  ACCESS_REQUEST_LIST_PAGE_TITLE,
  ACCESS_REQUEST_URL,
} from "@/features/access-request";
import {
  BANNER_BASE,
  BANNER_LIST_PAGE_TITLE,
  BANNER_URL,
  FAQ_BASE,
  FAQ_LIST_PAGE_TITLE,
  FAQ_URL,
  M2M_CLIENT_BASE,
  M2M_CLIENT_LIST_PAGE_TITLE,
  M2M_CLIENT_URL,
  ROLE_BASE,
  ROLE_LIST_PAGE_TITLE,
  ROLE_POSITION_BASE,
  ROLE_POSITION_LIST_PAGE_TITLE,
  ROLE_POSITION_URL,
  ROLE_URL,
  SETUP_CONFIGURATION_PAGE_TITLE,
  SETUP_CONFIGURATION_URL,
  USER_BASE,
  USER_LIST_PAGE_TITLE,
  USER_URL,
} from "@/features/settings";
import type { NavItem } from "@railfinance/core/types";
import {
  KeyRound,
  Link,
  Megaphone,
  MessageCircleQuestion,
  PenLine,
  Settings,
  Sliders,
  UserCog,
  UserLock,
  Users,
} from "lucide-react";

export const settingNav: NavItem = {
  title: "Setting",
  key: "setting",
  url: "#",
  icon: Settings,
  items: [
    {
      title: SETUP_CONFIGURATION_PAGE_TITLE,
      key: "approval",
      // key: SETUP_CONFIGURATION_BASE,
      url: SETUP_CONFIGURATION_URL,
      icon: Sliders,
    },
    {
      title: USER_LIST_PAGE_TITLE,
      key: USER_BASE,
      url: USER_URL,
      icon: Users,
    },
    {
      title: ACCESS_REQUEST_LIST_PAGE_TITLE,
      key: ACCESS_REQUEST_BASE,
      url: ACCESS_REQUEST_URL,
      icon: UserCog,
    },
    {
      title: "Approval Management",
      key: "approval",
      url: "/setting/approval",
      icon: PenLine,
    },
    {
      title: ROLE_LIST_PAGE_TITLE,
      key: ROLE_BASE,
      url: ROLE_URL,
      icon: UserLock,
    },
    {
      title: ROLE_POSITION_LIST_PAGE_TITLE,
      key: ROLE_POSITION_BASE,
      url: ROLE_POSITION_URL,
      icon: Link,
    },
    {
      title: M2M_CLIENT_LIST_PAGE_TITLE,
      key: M2M_CLIENT_BASE,
      url: M2M_CLIENT_URL,
      icon: KeyRound,
    },
    {
      title: BANNER_LIST_PAGE_TITLE,
      key: BANNER_BASE,
      url: BANNER_URL,
      icon: Megaphone,
    },
    {
      title: FAQ_LIST_PAGE_TITLE,
      key: FAQ_BASE,
      url: FAQ_URL,
      icon: MessageCircleQuestion,
    },
  ],
};
