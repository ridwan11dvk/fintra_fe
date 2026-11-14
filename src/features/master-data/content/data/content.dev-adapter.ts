import { masterDataFixtures } from "@/features/master-data/dev/master-data.fixtures";
import type { ContentInput, ContentListParams, ContentListResult, ContentRecord, ContentStatus } from "./content.types";

const records: ContentRecord[] = masterDataFixtures.contents.map((item) => ({ ...item }));
const copy = (item: ContentRecord): ContentRecord => ({ ...item });

export const contentDevAdapter = {
  async list(params: ContentListParams = {}): Promise<ContentListResult> {
    const page = Math.max(1, Math.trunc(params.page ?? 1));
    const pageSize = Math.max(1, Math.trunc(params.pageSize ?? 10));
    const search = params.search?.trim().toLocaleLowerCase();
    const filtered = search ? records.filter((item) => [item.sectionName, item.content].some((value) => value.toLocaleLowerCase().includes(search))) : records;
    return { items: filtered.slice((page - 1) * pageSize, page * pageSize).map(copy), page, pageSize, totalItems: filtered.length, totalPages: Math.ceil(filtered.length / pageSize) };
  },
  async get(id: string) {
    const item = records.find((record) => record.id === id);
    if (!item) throw new Error(`Content "${id}" was not found.`);
    return copy(item);
  },
  async create(input: ContentInput) {
    if (records.some((item) => item.sectionName === input.sectionName && item.status === "ACTIVE")) throw new Error("This section already has active Content");
    const item: ContentRecord = { ...input, content: input.content.trim(), id: `CONTENT-${String(records.length + 1).padStart(3, "0")}`, status: "ACTIVE" };
    records.push(item); return copy(item);
  },
  async update(id: string, input: ContentInput) {
    const index = records.findIndex((item) => item.id === id);
    if (index < 0) throw new Error(`Content "${id}" was not found.`);
    if (records[index].status === "ACTIVE" && records.some((item) => item.id !== id && item.sectionName === input.sectionName && item.status === "ACTIVE")) throw new Error("This section already has active Content");
    records[index] = { ...records[index], ...input, content: input.content.trim() }; return copy(records[index]);
  },
  async setStatus(id: string, status: ContentStatus) {
    const item = records.find((record) => record.id === id);
    if (!item) throw new Error(`Content "${id}" was not found.`);
    if (status === "ACTIVE" && records.some((other) => other.id !== id && other.sectionName === item.sectionName && other.status === "ACTIVE")) throw new Error("This section already has active Content");
    item.status = status;
    return copy(item);
  },
};
