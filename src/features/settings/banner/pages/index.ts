import { lazy } from "react";

export const BannerLazyPage = lazy(() =>
  import("./banner.page").then((mod) => ({
    default: mod.BannerPage,
  })),
);
