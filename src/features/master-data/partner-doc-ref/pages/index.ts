import { lazy } from "react";

export const PartnerDocRefListLazyPage = lazy(() =>
  import("./partner-doc-ref.page").then((mod) => ({
    default: mod.PartnerDocRefListPage,
  })),
);
