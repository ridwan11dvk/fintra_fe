import { lazy } from "react";

export const BusinessUnitLazyPage = lazy(() =>
  import("./business-unit.page").then((mod) => ({
    default: mod.BusinessUnitPage,
  })),
);

export const BusinessUnitFormLazyPage = lazy(() =>
  import("./business-unit-form.page").then((mod) => ({
    default: mod.BusinessUnitFormPage,
  })),
);

export const BusinessUnitDetailLazyPage = lazy(() =>
  import("./business-unit-detail.page").then((mod) => ({
    default: mod.BusinessUnitDetailPage,
  })),
);

export * from "./business-unit.page";
export * from "./business-unit-form.page";
export * from "./business-unit-detail.page";
