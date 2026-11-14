/**
 * Approval Workflow Feature Routes
 */

import { Route } from "react-router";
import { APPROVAL_WORKFLOW_BASE } from "./data";
import {
  AddApprovalWorkflowLazyPage,
  ApprovalWorkflowLazyPage,
  DetailApprovalWorkflowLazyPage,
} from "./pages";

export const approvalWorkflowRoutes = (
  <Route>
    <Route
      path={APPROVAL_WORKFLOW_BASE}
      element={<ApprovalWorkflowLazyPage />}
    />
    <Route
      path={`${APPROVAL_WORKFLOW_BASE}/create`}
      element={<AddApprovalWorkflowLazyPage />}
    />
    <Route
      path={`${APPROVAL_WORKFLOW_BASE}/:id/edit`}
      element={<AddApprovalWorkflowLazyPage />}
    />
    <Route
      path={`${APPROVAL_WORKFLOW_BASE}/:id`}
      element={<DetailApprovalWorkflowLazyPage />}
    />
  </Route>
);
