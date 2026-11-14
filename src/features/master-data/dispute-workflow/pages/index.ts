import { lazy } from "react";

export const DisputeWorkflowLazyPage = lazy(() =>
  import("./dispute-workflow.page").then((mod) => ({
    default: mod.DisputeWorkflowPage,
  })),
);

export const DetailDisputeWorkflowLazyPage = lazy(() =>
  import("./detail-dispute-workflow.page").then((mod) => ({
    default: mod.DetailDisputeWorkflowPage,
  })),
);

export const EditDisputeWorkflowLazyPage = lazy(() =>
  import("./edit-dispute-workflow.page").then((mod) => ({
    default: mod.EditDisputeWorkflowPage,
  })),
);

export * from "./dispute-workflow.page";
export * from "./detail-dispute-workflow.page";
export * from "./edit-dispute-workflow.page";
