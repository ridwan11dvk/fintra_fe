import { lazy } from "react";

export const StationListLazyPage = lazy(() =>
  import("./station-list.page").then((mod) => ({
    default: mod.StationListPage,
  })),
);

export const ClosureDetailLazyPage = lazy(() =>
  import("./closure-detail.page").then((mod) => ({
    default: mod.ClosureDetailPage,
  })),
);
