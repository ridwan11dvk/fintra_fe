import { masterDataFixtures } from "@/features/master-data/dev/master-data.fixtures";
import type { DepartmentInput, DepartmentListParams, DepartmentListResult, DepartmentRecord, DepartmentStatus } from "./department.types";

const records: DepartmentRecord[] = masterDataFixtures.departments.map((record) => ({ ...record }));
const copy = (record: DepartmentRecord): DepartmentRecord => ({ ...record });

function validateParent(id: string | null, parentDepartmentId: string | null, currentParentId?: string | null): void {
  if (!parentDepartmentId) return;
  if (parentDepartmentId === id) throw new Error("A department cannot be its own parent");

  const parent = records.find((record) => record.id === parentDepartmentId);
  if (!parent) throw new Error("Parent Department was not found");
  if (parent.status !== "ACTIVE" && parentDepartmentId !== currentParentId) throw new Error("Parent Department must be active");

  const visited = new Set<string>();
  let ancestor: DepartmentRecord | undefined = parent;
  while (ancestor && !visited.has(ancestor.id)) {
    if (ancestor.id === id) throw new Error("A department cannot use one of its descendants as parent");
    visited.add(ancestor.id);
    ancestor = ancestor.parentDepartmentId
      ? records.find((record) => record.id === ancestor?.parentDepartmentId)
      : undefined;
  }
}

export const departmentDevAdapter = {
  async list(params: DepartmentListParams = {}): Promise<DepartmentListResult> {
    const page = Math.max(1, Math.trunc(params.page ?? 1));
    const pageSize = Math.max(1, Math.trunc(params.pageSize ?? 10));
    const search = params.search?.trim().toLocaleLowerCase();
    const filtered = search ? records.filter((record) => {
      const parent = records.find((candidate) => candidate.id === record.parentDepartmentId)?.name ?? "";
      return [record.name, record.code, parent].some((value) => value.toLocaleLowerCase().includes(search));
    }) : records;
    const totalPages = Math.ceil(filtered.length / pageSize);
    const start = (page - 1) * pageSize;
    return { items: filtered.slice(start, start + pageSize).map(copy), page, pageSize, totalItems: filtered.length, totalPages };
  },
  async get(id: string): Promise<DepartmentRecord> {
    const record = records.find((candidate) => candidate.id === id);
    if (!record) throw new Error(`Department "${id}" was not found.`);
    return copy(record);
  },
  async create(input: DepartmentInput): Promise<DepartmentRecord> {
    const code = input.code.trim();
    if (records.some((record) => record.code.toLocaleLowerCase() === code.toLocaleLowerCase())) throw new Error("Department Code must be unique");
    validateParent(null, input.parentDepartmentId);
    const record: DepartmentRecord = { ...input, name: input.name.trim(), code, id: `DEPT-${code}` };
    records.push(record);
    return copy(record);
  },
  async update(id: string, input: DepartmentInput): Promise<DepartmentRecord> {
    const index = records.findIndex((record) => record.id === id);
    if (index < 0) throw new Error(`Department "${id}" was not found.`);
    const code = input.code.trim();
    if (records.some((record) => record.id !== id && record.code.toLocaleLowerCase() === code.toLocaleLowerCase())) throw new Error("Department Code must be unique");
    validateParent(id, input.parentDepartmentId, records[index].parentDepartmentId);
    records[index] = { ...records[index], ...input, name: input.name.trim(), code };
    return copy(records[index]);
  },
  async setStatus(id: string, status: DepartmentStatus): Promise<DepartmentRecord> {
    const record = records.find((candidate) => candidate.id === id);
    if (!record) throw new Error(`Department "${id}" was not found.`);
    record.status = status;
    return copy(record);
  },
};
