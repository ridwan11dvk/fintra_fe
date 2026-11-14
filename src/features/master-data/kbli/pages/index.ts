import { lazy } from "react";

export const KbliListLazyPage = lazy(() => import("./kbli-list.page").then((module) => ({ default: module.KbliListPage })));
export const KbliCreateLazyPage = lazy(() => import("./kbli-form.page").then((module) => ({ default: module.KbliCreatePage })));
export const KbliEditLazyPage = lazy(() => import("./kbli-form.page").then((module) => ({ default: module.KbliEditPage })));
export const KbliDetailLazyPage = lazy(() => import("./kbli-detail.page").then((module) => ({ default: module.KbliDetailPage })));
