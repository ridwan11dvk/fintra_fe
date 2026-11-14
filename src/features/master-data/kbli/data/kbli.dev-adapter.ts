import { masterDataFixtures } from "@/features/master-data/dev/master-data.fixtures";
import type { KbliInput, KbliListParams, KbliListResult, KbliRecord, KbliStatus } from "./kbli.types";

const records: KbliRecord[] = masterDataFixtures.kbliRecords.map((record) => ({ ...record }));
const copy = (record: KbliRecord): KbliRecord => ({ ...record });

export const kbliDevAdapter = {
  async list(params: KbliListParams = {}): Promise<KbliListResult> {
    const page = Math.max(1, Math.trunc(params.page ?? 1));
    const pageSize = Math.max(1, Math.trunc(params.pageSize ?? 10));
    const search = params.search?.trim().toLocaleLowerCase();
    const filtered = search ? records.filter((record) =>
      [record.code, record.businessFieldName, record.category].some((value) => value.toLocaleLowerCase().includes(search)),
    ) : records;
    const totalPages = Math.ceil(filtered.length / pageSize);
    const start = (page - 1) * pageSize;
    return { items: filtered.slice(start, start + pageSize).map(copy), page, pageSize, totalItems: filtered.length, totalPages };
  },
  async get(id: string): Promise<KbliRecord> {
    const record = records.find((candidate) => candidate.id === id);
    if (!record) throw new Error(`KBLI "${id}" was not found.`);
    return copy(record);
  },
  async create(input: KbliInput): Promise<KbliRecord> {
    const code = input.code.trim();
    if (records.some((record) => record.code.toLocaleLowerCase() === code.toLocaleLowerCase())) throw new Error("KBLI Code sudah digunakan");
    const record = { ...input, code, category: input.category.trim(), businessFieldName: input.businessFieldName.trim(), id: `KBLI-${code}` };
    records.push(record);
    return copy(record);
  },
  async update(id: string, input: KbliInput): Promise<KbliRecord> {
    const index = records.findIndex((record) => record.id === id);
    if (index < 0) throw new Error(`KBLI "${id}" was not found.`);
    const code = input.code.trim();
    if (records.some((record) => record.id !== id && record.code.toLocaleLowerCase() === code.toLocaleLowerCase())) throw new Error("KBLI Code sudah digunakan");
    records[index] = { ...records[index], ...input, code, category: input.category.trim(), businessFieldName: input.businessFieldName.trim() };
    return copy(records[index]);
  },
  async setStatus(id: string, status: KbliStatus): Promise<KbliRecord> {
    const record = records.find((candidate) => candidate.id === id);
    if (!record) throw new Error(`KBLI "${id}" was not found.`);
    record.status = status;
    return copy(record);
  },
};
