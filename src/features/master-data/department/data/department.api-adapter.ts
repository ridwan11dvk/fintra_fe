import { getRecordId, payableApi, toPagedResult } from "../../shared/payable-api";
import type { DepartmentInput, DepartmentListParams, DepartmentListResult, DepartmentRecord, DepartmentStatus } from "./department.types";

type DepartmentDto = { id: number; code: string; name: string; parentCode: string | null; active: boolean };
const ROOT = "/api/master-data/departments";

function toRecord(dto: DepartmentDto, idsByCode: Map<string, string>): DepartmentRecord {
  return {
    id: String(dto.id),
    code: dto.code,
    name: dto.name,
    parentDepartmentId: dto.parentCode ? idsByCode.get(dto.parentCode) ?? dto.parentCode : null,
    status: dto.active ? "ACTIVE" : "INACTIVE",
  };
}

async function getIdMap(): Promise<Map<string, string>> {
  const rows = await payableApi.get<DepartmentDto[]>(ROOT);
  return new Map(rows.map((row) => [row.code, String(row.id)]));
}

async function toBody(input: DepartmentInput) {
  let parentCode: string | null = null;
  if (input.parentDepartmentId) {
    const rows = await payableApi.get<DepartmentDto[]>(ROOT);
    const parent = rows.find((row) => String(row.id) === input.parentDepartmentId);
    if (!parent) throw new Error("The selected parent Department no longer exists. Refresh the form and try again.");
    parentCode = parent.code;
  }
  return { code: input.code, name: input.name, parentCode, active: input.status === "ACTIVE" };
}

export const departmentApiAdapter = {
  async list(params: DepartmentListParams = {}): Promise<DepartmentListResult> {
    const rows = await payableApi.get<DepartmentDto[]>(ROOT);
    const idsByCode = new Map(rows.map((row) => [row.code, String(row.id)]));
    let records = rows.map((row) => toRecord(row, idsByCode));
    const search = params.search?.trim().toLocaleLowerCase();
    if (search) {
      records = records.filter((row) => {
        const parentName = records.find((candidate) => candidate.id === row.parentDepartmentId)?.name ?? "";
        return [row.code, row.name, parentName].some((value) => value.toLocaleLowerCase().includes(search));
      });
    }
    return toPagedResult(records, params.page, params.pageSize);
  },
  async get(id: string): Promise<DepartmentRecord> {
    const [row, idsByCode] = await Promise.all([
      payableApi.get<DepartmentDto>(`${ROOT}/${getRecordId(id)}`),
      getIdMap(),
    ]);
    return toRecord(row, idsByCode);
  },
  async create(input: DepartmentInput): Promise<DepartmentRecord> {
    const [body, idsByCode] = await Promise.all([toBody(input), getIdMap()]);
    const row = await payableApi.post<DepartmentDto>(ROOT, body);
    return toRecord(row, idsByCode);
  },
  async update(id: string, input: DepartmentInput): Promise<DepartmentRecord> {
    const [body, idsByCode] = await Promise.all([toBody(input), getIdMap()]);
    const row = await payableApi.put<DepartmentDto>(`${ROOT}/${getRecordId(id)}`, body);
    return toRecord(row, idsByCode);
  },
  async setStatus(id: string, status: DepartmentStatus): Promise<DepartmentRecord> {
    const [row, idsByCode] = await Promise.all([
      payableApi.post<DepartmentDto>(`${ROOT}/${getRecordId(id)}/${status === "ACTIVE" ? "activate" : "deactivate"}`),
      getIdMap(),
    ]);
    return toRecord(row, idsByCode);
  },
};
