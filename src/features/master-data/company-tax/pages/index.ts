import { lazy } from "react";

export const CompanyTaxLazyPage = lazy(() =>
  import("./company-tax.page").then((mod) => ({
    default: mod.CompanyTaxPage,
  })),
);
