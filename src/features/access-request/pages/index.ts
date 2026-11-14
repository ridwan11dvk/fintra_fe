import { lazy } from "react";

export const AccessRequestListLazyPage = lazy(() =>
  import("./access-request-list.page").then((mod) => ({
    default: mod.AccessRequestListPage,
  })),
);
