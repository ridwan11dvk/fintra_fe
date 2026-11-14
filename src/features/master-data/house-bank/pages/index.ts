import { lazy } from "react";

export const HouseBankLazyPage = lazy(() =>
  import("./house-bank.page").then((mod) => ({
    default: mod.HouseBankPage,
  })),
);
