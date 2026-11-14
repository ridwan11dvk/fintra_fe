import { lazy } from "react";

export const PostingAutoLegacyLazyPage = lazy(() =>
  import("./posting-auto-legacy.page").then((mod) => ({
    default: mod.PostingAutoLegacyPage,
  })),
);

export const PostingAutoLegacyDetailLazyPage = lazy(() =>
  import("./posting-auto-legacy-detail.page").then((mod) => ({
    default: mod.PostingAutoLegacyDetailPage,
  })),
);
