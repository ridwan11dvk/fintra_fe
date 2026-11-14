import { lazy } from "react";

export const RevenueCenterLazyPage = lazy(() =>
  import("./revenue-center.page").then((mod) => ({
    default: mod.RevenueCenterPage,
  })),
);

export const RevenueCenterCreateLazyPage = lazy(() =>
  import("./revenue-center-form.page").then((mod) => ({
    default: mod.RevenueCenterCreatePage,
  })),
);

export const RevenueCenterEditLazyPage = lazy(() =>
  import("./revenue-center-form.page").then((mod) => ({
    default: mod.RevenueCenterEditPage,
  })),
);

export const RevenueCenterShowLazyPage = lazy(() =>
  import("./revenue-center-form.page").then((mod) => ({
    default: mod.RevenueCenterShowPage,
  })),
);
