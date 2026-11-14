import { lazy } from "react";

export const PartnerTypeLazyPage = lazy(() =>
  import("./partner-type.page").then((mod) => ({
    default: mod.PartnerTypePage,
  })),
);
