import { lazy } from "react";

export const TaxableItemLazyPage = lazy(() =>
  import("./taxable-item.page").then((mod) => ({
    default: mod.TaxableItemPage,
  })),
);
