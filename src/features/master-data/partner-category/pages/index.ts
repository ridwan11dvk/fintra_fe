import { lazy } from "react";

export const PartnerCategoryLazyPage = lazy(() =>
  import("./partner-category.page").then((mod) => ({
    default: mod.PartnerCategoryPage,
  })),
);
