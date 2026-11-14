export const stageProcessTypes = ["Submission", "Verification", "Approval", "Execution"] as const;
export type StageProcessType = (typeof stageProcessTypes)[number];
export const stageRoleGroups = ["Business Partner", "Business Unit", "Budgeting", "FSSC Service", "Finance", "Treasury"] as const;
export interface StageProcessRecord {
  id: string;
  sequence: number;
  roleGroup: string;
  processName: string;
  processType: StageProcessType;
  slaDays: number;
  version: number;
}
