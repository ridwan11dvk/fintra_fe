import { lazy } from "react";

export const SegmentListLazyPage = lazy(() =>
  import("./segment-list.page").then((module) => ({
    default: module.SegmentListPage,
  })),
);

export const SegmentCreateLazyPage = lazy(() =>
  import("./segment-create.page").then((module) => ({
    default: module.SegmentCreatePage,
  })),
);

export const SegmentEditLazyPage = lazy(() =>
  import("./segment-create.page").then((module) => ({
    default: module.SegmentEditPage,
  })),
);

export const SegmentDetailLazyPage = lazy(() =>
  import("./segment-detail.page").then((module) => ({
    default: module.SegmentDetailPage,
  })),
);
