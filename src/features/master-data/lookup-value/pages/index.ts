import { lazy } from "react";

export const CategoryLazyPage = lazy(() =>
  import("./lookup-value.page").then((mod) => ({
    default: mod.CategoryPage,
  })),
);