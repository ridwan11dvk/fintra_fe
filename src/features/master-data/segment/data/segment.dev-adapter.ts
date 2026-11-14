import { masterDataFixtures } from "@/features/master-data/dev/master-data.fixtures";
import type {
  SegmentListParams,
  SegmentListResult,
  SegmentInput,
  SegmentRecord,
} from "./segment.types";

const records: SegmentRecord[] = masterDataFixtures.segments.map((record) => ({ ...record }));

const copy = (record: SegmentRecord): SegmentRecord => ({ ...record });

export const segmentDevAdapter = {
  async list(params: SegmentListParams = {}): Promise<SegmentListResult> {
    const page = Math.max(1, Math.trunc(params.page ?? 1));
    const pageSize = Math.max(1, Math.trunc(params.pageSize ?? 10));
    const search = params.search?.trim().toLocaleLowerCase();
    const parentNames = new Map(
      records.map((record) => [record.segmentId, record.segmentName]),
    );
    const matches = search
      ? records.filter((record) =>
          [
            record.segmentId,
            record.segmentName,
            record.description,
            record.parentSegmentId
              ? parentNames.get(record.parentSegmentId) ?? ""
              : "",
          ].some((value) => value.toLocaleLowerCase().includes(search)),
        )
      : records;
    const totalItems = matches.length;
    const start = (page - 1) * pageSize;

    return {
      items: matches.slice(start, start + pageSize).map((record) => ({
        ...copy(record),
        parentSegmentName: record.parentSegmentId
          ? parentNames.get(record.parentSegmentId) ?? null
          : null,
      })),
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  },

  async get(segmentId: string): Promise<SegmentRecord> {
    const record = records.find((candidate) => candidate.segmentId === segmentId);
    if (!record) throw new Error(`Segment "${segmentId}" was not found.`);
    return {
      ...copy(record),
      parentSegmentName: record.parentSegmentId
        ? records.find((candidate) => candidate.segmentId === record.parentSegmentId)?.segmentName ?? null
        : null,
    };
  },

  async create(input: SegmentInput): Promise<SegmentRecord> {
    const segmentId = input.segmentId.trim();
    if (records.some((record) => record.segmentId.toLocaleLowerCase() === segmentId.toLocaleLowerCase())) {
      throw new Error(`Segment ID "${segmentId}" already exists.`);
    }
    const record: SegmentRecord = {
      ...input,
      segmentId,
      description: input.description ?? "",
    };
    records.push(record);
    return copy(record);
  },

  async update(segmentId: string, input: SegmentInput): Promise<SegmentRecord> {
    const index = records.findIndex((candidate) => candidate.segmentId === segmentId);
    if (index < 0) throw new Error(`Segment "${segmentId}" was not found.`);
    const nextId = input.segmentId.trim();
    if (records.some((record) => record.segmentId !== segmentId && record.segmentId.toLocaleLowerCase() === nextId.toLocaleLowerCase())) {
      throw new Error(`Segment ID "${nextId}" already exists.`);
    }
    records[index] = { ...records[index], ...input, segmentId: nextId };
    return copy(records[index]);
  },

  async setStatus(segmentId: string, status: SegmentRecord["status"]): Promise<SegmentRecord> {
    const record = records.find((candidate) => candidate.segmentId === segmentId);
    if (!record) throw new Error(`Segment "${segmentId}" was not found.`);
    record.status = status;
    return copy(record);
  },

  async listParentOptions(currentSegmentId?: string): Promise<SegmentRecord[]> {
    return records
      .filter(
        (record) =>
          record.segmentId !== currentSegmentId && record.status === "ACTIVE",
      )
      .map(copy);
  },
};
