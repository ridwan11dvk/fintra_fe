import { lazy } from "react";

export const PostingAssetLegacyLazyPage = lazy(() =>
  import("./posting-asset-legacy.page").then((mod) => ({
    default: mod.PostingAssetLegacyPage,
  })),
);

export const PostingAssetLegacyDetailLazyPage = lazy(() =>
  import("./posting-asset-legacy-detail.page").then((mod) => ({
    default: mod.PostingAssetLegacyDetailPage,
  })),
);
