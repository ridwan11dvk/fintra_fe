import { lazy } from "react";

export const PartnerListLazyPage = lazy(() =>
  import("./partner-list.page").then((mod) => ({
    default: mod.PartnerListPage,
  })),
);

export const PartnerCreateLazyPage = lazy(() =>
  import("./partner-create.page").then((mod) => ({
    default: mod.PartnerCreatePage,
  })),
);

export const PartnerUpdateLazyPage = lazy(() =>
  import("./partner-update.page").then((mod) => ({
    default: mod.PartnerUpdatePage,
  })),
);

export const PartnerShowLazyPage = lazy(() =>
  import("./partner-show.page").then((mod) => ({
    default: mod.PartnerShowPage,
  })),
);
