import { lazy } from "react";

export const RejectCategoryLazyPage = lazy(() =>
  import("./reject-category.page").then((mod) => ({
    default: mod.RejectCategoryPage,
  })),
);
