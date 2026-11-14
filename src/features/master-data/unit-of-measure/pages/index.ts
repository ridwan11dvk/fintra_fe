import { lazy } from "react";

export const UomLazyPage = lazy(() =>
  import("./uom.page").then((mod) => ({
    default: mod.UomPage,
  })),
);
