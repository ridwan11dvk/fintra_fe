import { lazy } from "react";

export const ContentListLazyPage = lazy(() => import("./content-list.page").then((module) => ({ default: module.ContentListPage })));
export const ContentCreateLazyPage = lazy(() => import("./content-form.page").then((module) => ({ default: module.ContentCreatePage })));
export const ContentEditLazyPage = lazy(() => import("./content-form.page").then((module) => ({ default: module.ContentEditPage })));
export const ContentDetailLazyPage = lazy(() => import("./content-detail.page").then((module) => ({ default: module.ContentDetailPage })));
export const ContentPreviewLazyPage = lazy(() => import("./content-preview.page").then((module) => ({ default: module.ContentPreviewPage })));
