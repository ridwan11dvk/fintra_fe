import { lazy } from "react";

export const PostingAutoLazyPage = lazy(() =>
  import("./posting-auto.page").then((mod) => ({
    default: mod.PostingAutoPage,
  })),
);

export const PostingAutoDetailLazyPage = lazy(() =>
  import("./posting-auto-detail.page").then((mod) => ({
    default: mod.PostingAutoDetailPage,
  })),
);
