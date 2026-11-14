import { lazy } from "react";

export const PostingAssetLazyPage = lazy(() =>
  import("./posting-asset.page").then((mod) => ({
    default: mod.PostingAssetPage,
  })),
);

export const PostingAssetDetailLazyPage = lazy(() =>
  import("./posting-asset-detail.page").then((mod) => ({
    default: mod.PostingAssetDetailPage,
  })),
);
