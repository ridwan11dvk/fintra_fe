import { lazy } from "react";

export const BusinessAreaLazyPage = lazy(() =>
  import("./business-area.page").then((mod) => ({
    default: mod.BusinessAreaPage,
  })),
);
