/**
 * Dispute Workflow Feature Routes
 */

import { Route } from "react-router";
import { DISPUTE_WORKFLOW_BASE } from "./data";
import {
  DetailDisputeWorkflowLazyPage,
  DisputeWorkflowLazyPage,
  EditDisputeWorkflowLazyPage,
} from "./pages";

export const disputeWorkflowRoutes = (
  <Route>
    <Route
      path={DISPUTE_WORKFLOW_BASE}
      element={<DisputeWorkflowLazyPage />}
    />
    <Route
      path={`${DISPUTE_WORKFLOW_BASE}/:id/edit`}
      element={<EditDisputeWorkflowLazyPage />}
    />
    <Route
      path={`${DISPUTE_WORKFLOW_BASE}/:id`}
      element={<DetailDisputeWorkflowLazyPage />}
    />
  </Route>
);
