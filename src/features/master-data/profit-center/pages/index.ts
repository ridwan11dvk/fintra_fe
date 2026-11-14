import { lazy } from "react";

export const ProfitCenterListLazyPage = lazy(() => import("./profit-center-list.page").then((module) => ({ default: module.ProfitCenterListPage })));
export const ProfitCenterCreateLazyPage = lazy(() => import("./profit-center-form.page").then((module) => ({ default: module.ProfitCenterCreatePage })));
export const ProfitCenterEditLazyPage = lazy(() => import("./profit-center-form.page").then((module) => ({ default: module.ProfitCenterEditPage })));
export const ProfitCenterDetailLazyPage = lazy(() => import("./profit-center-detail.page").then((module) => ({ default: module.ProfitCenterDetailPage })));
