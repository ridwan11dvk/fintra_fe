import { lazy } from "react";

export const WorkCatalogLazyPage = lazy(() =>
  import("./work-catalog.page").then((mod) => ({
    default: mod.WorkCatalogPage,
  })),
);

export const WorkCatalogCreateLazyPage = lazy(() =>
  import("./work-catalog-form.page").then((mod) => ({
    default: mod.WorkCatalogCreatePage,
  })),
);

export const WorkCatalogEditLazyPage = lazy(() =>
  import("./work-catalog-form.page").then((mod) => ({
    default: mod.WorkCatalogEditPage,
  })),
);

export const WorkCatalogShowLazyPage = lazy(() =>
  import("./work-catalog-form.page").then((mod) => ({
    default: mod.WorkCatalogShowPage,
  })),
);
