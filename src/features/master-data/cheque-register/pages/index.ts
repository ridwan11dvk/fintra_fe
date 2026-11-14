import { lazy } from "react";

export const ChequeRegisterListLazyPage = lazy(() => import("./cheque-register-list.page").then((module) => ({ default: module.ChequeRegisterListPage })));
export const ChequeRegisterCreateLazyPage = lazy(() => import("./cheque-register-form.page").then((module) => ({ default: module.ChequeRegisterCreatePage })));
export const ChequeRegisterEditLazyPage = lazy(() => import("./cheque-register-form.page").then((module) => ({ default: module.ChequeRegisterEditPage })));
export const ChequeRegisterDetailLazyPage = lazy(() => import("./cheque-register-detail.page").then((module) => ({ default: module.ChequeRegisterDetailPage })));
