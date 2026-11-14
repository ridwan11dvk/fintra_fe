export interface DisputeRejectDestination {
  id: string;
  rejectReasonCategory: string;
  rejectDestination: "Dispute Resolution" | "Non Dispute";
  nonDisputeRole?: string;
  afterCaseCloseDestination: "Back to submitter" | "Another stage";
  stageProcess?: string;
  description: string;
}

export interface StageCatalogItem {
  stageProcessCategory: string;
  stageProcessCategoryName: string;
  stageProcess: string;
  stageProcessName: string;
  disputeWorkflowActive: boolean;
}

export interface DisputeWorkflowItem {
  id: string;
  stageProcessCategory: string;
  stageProcessCategoryName?: string;
  stageProcess?: string;
  stageProcessName: string;
  disputeWorkflowActive?: boolean;
  isLinked?: boolean;
  description?: string;
  rejectDestinations?: DisputeRejectDestination[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DisputeWorkflowFilterParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ToggleDisputeWorkflowActiveRequest {
  isActive: boolean;
}

export interface DisputeRejectReasonItem {
  rejectReasonCategory: string;
  rejectReasonCategoryName?: string;
  rejectDestination: string;
  stageProcessCode?: string;
  stageProcess?: string;
  afterCaseCloseDestination: string;
  nonDisputeRoleCode?: string;
  nonDisputeRole?: string;
  description?: string;
}

export interface UpdateDisputeWorkflowDetailItem {
  rejectReasonCategory: string;
  rejectDestination: "DISPUTE_RESOLUTION" | "NON_DISPUTE" | string;
  afterCaseCloseDestination: "BACK_TO_SUBMITTER" | "ANOTHER_STAGE" | string;
  description?: string;
  nonDisputeRole?: string;
  stageProcess?: string;
}

export interface UpdateDisputeWorkflowRequest {
  stageProcessCategory: string;
  stageProcess: string;
  details: UpdateDisputeWorkflowDetailItem[];
}
