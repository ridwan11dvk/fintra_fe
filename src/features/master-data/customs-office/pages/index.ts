import { lazy } from "react";

export const CustomsOfficeLazyPage = lazy(() =>
  import("./customs-office.page").then((mod) => ({
    default: mod.CustomsOfficePage,
  })),
);
