export const STAGE_PROCESS_BASE = "stage-process";
export const STAGE_PROCESS_URL = `/master-data/${STAGE_PROCESS_BASE}`;
export const STAGE_PROCESS_LIST_PAGE_TITLE = "SLA Setup";
export const stageProcessQueryKeys = { all: ["master-data-stage-process"] as const, list: () => [...stageProcessQueryKeys.all, "list"] as const };
