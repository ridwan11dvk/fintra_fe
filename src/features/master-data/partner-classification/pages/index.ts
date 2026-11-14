import { lazy } from "react";

export const PartnerClassificationLazyPage = lazy(() =>
  import("./partner-classification.page").then((mod) => ({
    default: mod.PartnerClassificationPage,
  })),
);
