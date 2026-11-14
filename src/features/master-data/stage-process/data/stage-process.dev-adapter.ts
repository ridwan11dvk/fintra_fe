import { masterDataFixtures } from "@/features/master-data/dev/master-data.fixtures";
import { stageProcessListSchema } from "./stage-process.schema";
import type { StageProcessRecord } from "./stage-process.types";

let records: StageProcessRecord[] = masterDataFixtures.stageProcesses.map((record) => ({ ...record }));
const copy = (items: StageProcessRecord[]) => items.map((item) => ({ ...item }));

export const stageProcessDevAdapter = {
  async list() { return copy(records); },
  async save(items: StageProcessRecord[]) {
    const parsed = stageProcessListSchema.parse(items);
    records = parsed.map((item, index) => ({ ...item, sequence: index + 1 }));
    return copy(records);
  },
};
