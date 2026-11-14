import { lazy } from "react";

export const FaqLazyPage = lazy(() =>
  import("./faq.page").then((mod) => ({
    default: mod.FaqPage,
  })),
);