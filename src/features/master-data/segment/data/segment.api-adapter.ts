import { payableApi, toPagedResult, getRecordId } from "../../shared/payable-api";
import type { SegmentInput, SegmentListParams, SegmentListResult, SegmentRecord, SegmentStatus } from "./segment.types";

type SegmentDto = { id: number; code: string; name: string; parentCode: string | null; description: string | null; active: boolean };
const ROOT = "/api/master-data/segments";

function toRecord(dto: SegmentDto, rows: SegmentDto[]): SegmentRecord {
  return {
    segmentId: dto.code,
    segmentName: dto.name,
    parentSegmentId: dto.parentCode,
    parentSegmentName: rows.find((row) => row.code === dto.parentCode)?.name ?? null,
    description: dto.description ?? "",
    status: dto.active ? "ACTIVE" : "INACTIVE",
    backendId: dto.id,
  };
}

async function findByBusinessCode(code: string): Promise<SegmentDto> {
  const rows = await payableApi.get<SegmentDto[]>(ROOT);
  const match = rows.find((row) => row.code === code);
  if (!match) throw new Error(`Segment "${code}" was not found.`);
  return match;
}

async function toBody(input: SegmentInput) {
  return {
    code: input.segmentId,
    name: input.segmentName,
    parentCode: input.parentSegmentId,
    description: input.description ?? "",
    active: input.status === "ACTIVE",
  };
}

export const segmentApiAdapter = {
  async list(params: SegmentListParams = {}): Promise<SegmentListResult> {
    const rows = await payableApi.get<SegmentDto[]>(ROOT);
    let records = rows.map((row) => toRecord(row, rows));
    const search = params.search?.trim().toLocaleLowerCase();
    if (search) {
      records = records.filter((record) => [
        record.segmentId,
        record.segmentName,
        record.description,
        record.parentSegmentName ?? "",
      ].some((value) => value.toLocaleLowerCase().includes(search)));
    }
    return toPagedResult(records, params.page, params.pageSize);
  },
  async get(code: string): Promise<SegmentRecord> {
    const match = await findByBusinessCode(code);
    const rows = await payableApi.get<SegmentDto[]>(ROOT);
    const row = await payableApi.get<SegmentDto>(`${ROOT}/${getRecordId(String(match.id))}`);
    return toRecord(row, rows);
  },
  async create(input: SegmentInput): Promise<SegmentRecord> {
    const dto = await payableApi.post<SegmentDto>(ROOT, await toBody(input));
    const rows = await payableApi.get<SegmentDto[]>(ROOT);
    return toRecord(dto, rows);
  },
  async update(code: string, input: SegmentInput): Promise<SegmentRecord> {
    const match = await findByBusinessCode(code);
    const dto = await payableApi.put<SegmentDto>(`${ROOT}/${getRecordId(String(match.id))}`, await toBody(input));
    const rows = await payableApi.get<SegmentDto[]>(ROOT);
    return toRecord(dto, rows);
  },
  async setStatus(code: string, status: SegmentStatus): Promise<SegmentRecord> {
    const match = await findByBusinessCode(code);
    const action = status === "ACTIVE" ? "activate" : "deactivate";
    const dto = await payableApi.post<SegmentDto>(`${ROOT}/${getRecordId(String(match.id))}/${action}`);
    const rows = await payableApi.get<SegmentDto[]>(ROOT);
    return toRecord(dto, rows);
  },
  async listParentOptions(currentSegmentId?: string): Promise<SegmentRecord[]> {
    const rows = await payableApi.get<SegmentDto[]>(ROOT);
    return rows
      .filter((row) => row.active && row.code !== currentSegmentId)
      .map((row) => toRecord(row, rows));
  },
};
