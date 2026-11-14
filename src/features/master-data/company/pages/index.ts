import { lazy } from "react";

export const CompanyListLazyPage = lazy(() =>
  import("./company-list.page").then((mod) => ({
    default: mod.CompanyListPage,
  })),
);

export const CompanyCreateLazyPage = lazy(() =>
  import("./company-create.page").then((mod) => ({
    default: mod.CompanyCreatePage,
  })),
);

export const CompanyUpdateLazyPage = lazy(() =>
  import("./company-update.page").then((mod) => ({
    default: mod.CompanyUpdatePage,
  })),
);

export const CompanyShowLazyPage = lazy(() =>
  import("./company-show.page").then((mod) => ({
    default: mod.CompanyShowPage,
  })),
);
