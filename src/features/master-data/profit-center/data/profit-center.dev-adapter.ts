import { masterDataFixtures } from "@/features/master-data/dev/master-data.fixtures";
import type {
  ProfitCenterInput,
  ProfitCenterListParams,
  ProfitCenterListResult,
  ProfitCenterRecord,
} from "./profit-center.types";

const records: ProfitCenterRecord[] = masterDataFixtures.profitCenters.map((record) => ({ ...record }));
const copy = (record: ProfitCenterRecord): ProfitCenterRecord => ({ ...record });

function withSegmentName(record: ProfitCenterRecord): ProfitCenterRecord {
  const segment = masterDataFixtures.segments.find((candidate) => candidate.segmentId === record.segmentId);
  return { ...copy(record), segmentName: segment?.segmentName ?? "" };
}

export const profitCenterDevAdapter = {
  async list(params: ProfitCenterListParams = {}): Promise<ProfitCenterListResult> {
    const page = Math.max(1, Math.trunc(params.page ?? 1));
    const pageSize = Math.max(1, Math.trunc(params.pageSize ?? 7));
    const search = params.search?.trim().toLocaleLowerCase();
    const matches = search
      ? records.filter((record) => [
          record.profitCenterId,
          record.profitCenterName,
          record.parentProfitCenterId,
          record.segmentId,
          record.businessUnitId,
          record.responsiblePerson,
        ].some((value) => value.toLocaleLowerCase().includes(search)))
      : records;
    const totalItems = matches.length;
    const start = (page - 1) * pageSize;
    return {
      items: matches.slice(start, start + pageSize).map(withSegmentName),
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  },

  async get(id: string): Promise<ProfitCenterRecord> {
    const record = records.find((candidate) => candidate.profitCenterId === id);
    if (!record) throw new Error(`Profit Center "${id}" was not found.`);
    return withSegmentName(record);
  },

  async create(input: ProfitCenterInput): Promise<ProfitCenterRecord> {
    const profitCenterId = input.profitCenterId.trim();
    if (records.some((record) => record.profitCenterId.toLocaleLowerCase() === profitCenterId.toLocaleLowerCase())) {
      throw new Error(`Profit Center ID "${profitCenterId}" already exists.`);
    }
    const record = { ...input, profitCenterId };
    records.push(record);
    return withSegmentName(record);
  },

  async update(id: string, input: ProfitCenterInput): Promise<ProfitCenterRecord> {
    const index = records.findIndex((candidate) => candidate.profitCenterId === id);
    if (index < 0) throw new Error(`Profit Center "${id}" was not found.`);
    const nextId = input.profitCenterId.trim();
    if (records.some((record) => record.profitCenterId !== id && record.profitCenterId.toLocaleLowerCase() === nextId.toLocaleLowerCase())) {
      throw new Error(`Profit Center ID "${nextId}" already exists.`);
    }
    records[index] = { ...input, profitCenterId: nextId };
    return withSegmentName(records[index]);
  },

  async setStatus(id: string, status: ProfitCenterRecord["status"]): Promise<ProfitCenterRecord> {
    const record = records.find((candidate) => candidate.profitCenterId === id);
    if (!record) throw new Error(`Profit Center "${id}" was not found.`);
    record.status = status;
    return withSegmentName(record);
  },

  async listActiveSegmentOptions(): Promise<Array<{ segmentId: string; segmentName: string }>> {
    return masterDataFixtures.segments
      .filter((segment) => segment.status === "ACTIVE")
      .map(({ segmentId, segmentName }) => ({ segmentId, segmentName }));
  },

  async listResponsiblePeople(): Promise<string[]> {
    return [...masterDataFixtures.responsiblePersons];
  },
};
