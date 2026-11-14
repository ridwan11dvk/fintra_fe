import { lazy } from "react";

export const ApprovalWorkflowLazyPage = lazy(() =>
  import("./approval-workflow.page").then((mod) => ({
    default: mod.ApprovalWorkflowPage,
  })),
);

export const AddApprovalWorkflowLazyPage = lazy(() =>
  import("./add-approval-workflow.page").then((mod) => ({
    default: mod.AddApprovalWorkflowPage,
  })),
);

export const DetailApprovalWorkflowLazyPage = lazy(() =>
  import("./detail-approval-workflow.page").then((mod) => ({
    default: mod.DetailApprovalWorkflowPage,
  })),
);

export * from "./approval-workflow.page";
export * from "./add-approval-workflow.page";
export * from "./detail-approval-workflow.page";
