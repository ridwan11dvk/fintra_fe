import { lazy } from "react";

export const BankLazyPage = lazy(() =>
  import("./bank.page").then((mod) => ({
    default: mod.BankPage,
  })),
);
