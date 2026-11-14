import { lazy } from "react";

export const DistrictLazyPage = lazy(() =>
  import("./district.page").then((mod) => ({
    default: mod.DistrictPage,
  })),
);
