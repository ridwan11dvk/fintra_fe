import { lazy } from "react";
export const StageProcessLazyPage = lazy(() => import("./stage-process.page").then((module) => ({ default: module.StageProcessPage })));
export { StageProcessContent } from "./stage-process.page";
