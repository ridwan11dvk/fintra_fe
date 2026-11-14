import { getRecordId, payableApi, toPagedResult } from "../../shared/payable-api";
import type { ProfitCenterInput, ProfitCenterListParams, ProfitCenterListResult, ProfitCenterRecord, ProfitCenterStatus } from "./profit-center.types";

type ProfitCenterDto = {
  id: number;
  code: string;
  name: string;
  businessUnitId: string | null;
  parentCode: string | null;
  segmentCode: string | null;
  responsiblePerson: string | null;
  active: boolean;
};
type SegmentDto = { id: number; code: string; name: string; parentCode: string | null; description: string | null; active: boolean };

const ROOT = "/api/master-data/profit-centers";
const SEGMENT_ROOT = "/api/master-data/segments";

function toRecord(dto: ProfitCenterDto, segments: SegmentDto[] = []): ProfitCenterRecord {
  return {
    backendId: dto.id,
    profitCenterId: dto.code,
    profitCenterName: dto.name,
    parentProfitCenterId: dto.parentCode ?? "",
    segmentId: dto.segmentCode ?? "",
    segmentName: segments.find((segment) => segment.code === dto.segmentCode)?.name,
    businessUnitId: dto.businessUnitId ?? "",
    responsiblePerson: dto.responsiblePerson ?? "",
    status: dto.active ? "ACTIVE" : "INACTIVE",
  };
}

function toBody(input: ProfitCenterInput, code = input.profitCenterId) {
  return {
    code,
    name: input.profitCenterName,
    businessUnitId: input.businessUnitId || null,
    parentCode: input.parentProfitCenterId || null,
    segmentCode: input.segmentId || null,
    responsiblePerson: input.responsiblePerson || null,
    active: input.status === "ACTIVE",
  };
}

async function findByCode(code: string): Promise<ProfitCenterDto> {
  const rows = await payableApi.get<ProfitCenterDto[]>(ROOT);
  const match = rows.find((row) => row.code === code);
  if (!match) throw new Error(`Profit Center "${code}" was not found.`);
  return match;
}

async function getSegments(): Promise<SegmentDto[]> {
  return payableApi.get<SegmentDto[]>(SEGMENT_ROOT);
}

export const profitCenterApiAdapter = {
  async list(params: ProfitCenterListParams = {}): Promise<ProfitCenterListResult> {
    const [rows, segments] = await Promise.all([
      payableApi.get<ProfitCenterDto[]>(ROOT),
      getSegments(),
    ]);
    let records = rows.map((row) => toRecord(row, segments));
    const search = params.search?.trim().toLocaleLowerCase();
    if (search) {
      records = records.filter((record) => [
        record.profitCenterId,
        record.profitCenterName,
        record.parentProfitCenterId,
        record.segmentId,
        record.segmentName ?? "",
        record.businessUnitId,
        record.responsiblePerson,
      ].some((value) => value.toLocaleLowerCase().includes(search)));
    }
    return toPagedResult(records, params.page, params.pageSize ?? 7);
  },
  async get(code: string): Promise<ProfitCenterRecord> {
    const match = await findByCode(code);
    const [row, segments] = await Promise.all([
      payableApi.get<ProfitCenterDto>(`${ROOT}/${getRecordId(String(match.id))}`),
      getSegments(),
    ]);
    return toRecord(row, segments);
  },
  async create(input: ProfitCenterInput): Promise<ProfitCenterRecord> {
    const [row, segments] = await Promise.all([
      payableApi.post<ProfitCenterDto>(ROOT, toBody(input)),
      getSegments(),
    ]);
    return toRecord(row, segments);
  },
  async update(code: string, input: ProfitCenterInput): Promise<ProfitCenterRecord> {
    const match = await findByCode(code);
    if (input.profitCenterId !== match.code) {
      throw new Error("Profit Center ID cannot be changed after creation; the Payable API keeps the existing code on update.");
    }
    const [row, segments] = await Promise.all([
      payableApi.put<ProfitCenterDto>(`${ROOT}/${getRecordId(String(match.id))}`, toBody(input, match.code)),
      getSegments(),
    ]);
    return toRecord(row, segments);
  },
  async setStatus(code: string, status: ProfitCenterStatus): Promise<ProfitCenterRecord> {
    const match = await findByCode(code);
    const action = status === "ACTIVE" ? "activate" : "deactivate";
    const [row, segments] = await Promise.all([
      payableApi.post<ProfitCenterDto>(`${ROOT}/${getRecordId(String(match.id))}/${action}`),
      getSegments(),
    ]);
    return toRecord(row, segments);
  },
  async listActiveSegmentOptions(): Promise<Array<{ segmentId: string; segmentName: string }>> {
    const rows = await getSegments();
    return rows.filter((row) => row.active).map((row) => ({ segmentId: row.code, segmentName: row.name }));
  },
  async listResponsiblePeople(): Promise<string[]> {
    // Payable has no people-options endpoint yet. The field is optional on the
    // current request DTO, so existing values are preserved and create can omit it.
    return [];
  },
};
