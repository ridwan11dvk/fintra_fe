import { lazy } from "react";

export const DocumentNameLazyPage = lazy(() =>
  import("./document-name.page").then((mod) => ({
    default: mod.DocumentNamePage,
  })),
);
