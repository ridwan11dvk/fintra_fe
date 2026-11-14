import { lazy } from "react";

export const CountryLazyPage = lazy(() =>
  import("./country.page").then((mod) => ({
    default: mod.CountryPage,
  })),
);
