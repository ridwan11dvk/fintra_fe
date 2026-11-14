import { lazy } from "react";

export const DepartmentListLazyPage = lazy(() => import("./department-list.page").then((module) => ({ default: module.DepartmentListPage })));
export const DepartmentCreateLazyPage = lazy(() => import("./department-form.page").then((module) => ({ default: module.DepartmentCreatePage })));
export const DepartmentEditLazyPage = lazy(() => import("./department-form.page").then((module) => ({ default: module.DepartmentEditPage })));
export const DepartmentDetailLazyPage = lazy(() => import("./department-detail.page").then((module) => ({ default: module.DepartmentDetailPage })));
