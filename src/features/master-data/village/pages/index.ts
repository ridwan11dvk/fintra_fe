import { lazy } from "react";

export const VillageLazyPage = lazy(() =>
  import("./village.page").then((mod) => ({
    default: mod.VillagePage,
  })),
);
