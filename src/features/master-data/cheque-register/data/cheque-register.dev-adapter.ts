import { masterDataFixtures } from "@/features/master-data/dev/master-data.fixtures";
import type { ChequeRegisterInput, ChequeRegisterListParams, ChequeRegisterListResult, ChequeRegisterRecord } from "./cheque-register.types";

const records: ChequeRegisterRecord[] = masterDataFixtures.chequeRegisters.map((item) => ({ ...item }));
const banks = masterDataFixtures.chequeRegisterHouseBanks;
const copy = (item: ChequeRegisterRecord): ChequeRegisterRecord => ({ ...item });

export const chequeRegisterDevAdapter = {
  async getHouseBanks() { return banks.map((bank) => ({ ...bank })); },
  async list(params: ChequeRegisterListParams = {}): Promise<ChequeRegisterListResult> {
    const page = Math.max(1, Math.trunc(params.page ?? 1)); const pageSize = Math.max(1, Math.trunc(params.pageSize ?? 10)); const search = params.search?.trim().toLowerCase();
    const filtered = search ? records.filter((item) => [item.chequeNumber, item.houseBankName].some((value) => value.toLowerCase().includes(search))) : records;
    return { items: filtered.slice((page - 1) * pageSize, page * pageSize).map(copy), page, pageSize, totalItems: filtered.length, totalPages: Math.ceil(filtered.length / pageSize) };
  },
  async get(id: string) {
    const item = records.find((record) => record.id === id);
    if (!item) throw new Error(`Cheque Register "${id}" was not found.`);
    return copy(item);
  },
  async create(input: ChequeRegisterInput) {
    const [item] = await this.createBatch([input]);
    if (!item) throw new Error("Cheque Register was not returned after creation");
    return item;
  },
  async createBatch(inputs: ChequeRegisterInput[]) {
    const batchKeys = new Set<string>();
    const items = inputs.map((input, index) => {
      const bank = banks.find((item) => item.id === input.houseBankId);
      if (!bank) throw new Error("House Bank was not found");
      if (bank.status !== "ACTIVE") throw new Error("Inactive House Bank cannot be selected for a new Cheque Register");
      const normalizedNumber = input.chequeNumber.trim().toLowerCase();
      const duplicateKey = `${input.houseBankId}:${normalizedNumber}`;
      if (batchKeys.has(duplicateKey) || records.some((item) => item.houseBankId === input.houseBankId && item.chequeNumber.trim().toLowerCase() === normalizedNumber)) {
        throw new Error("Cheque Number must be unique per House Bank. No rows were added.");
      }
      batchKeys.add(duplicateKey);
      return {
        ...input,
        id: `CHQ-REG-${String(records.length + index + 1).padStart(3, "0")}`,
        houseBankName: bank.name,
      } satisfies ChequeRegisterRecord;
    });
    records.push(...items);
    return items.map(copy);
  },
  async update(id: string, input: ChequeRegisterInput) {
    const index = records.findIndex((item) => item.id === id);
    if (index < 0) throw new Error(`Cheque Register "${id}" was not found.`);
    const bank = banks.find((item) => item.id === input.houseBankId);
    if (!bank) throw new Error("House Bank was not found");
    if (bank.status !== "ACTIVE" && bank.id !== records[index].houseBankId) throw new Error("Inactive House Bank cannot be selected for a new Cheque Register");
    if (records.some((item) => item.id !== id && item.houseBankId === input.houseBankId && item.chequeNumber.toLowerCase() === input.chequeNumber.trim().toLowerCase())) {
      throw new Error("Cheque Number must be unique per House Bank");
    }
    records[index] = { ...records[index], ...input, houseBankName: bank.name }; return copy(records[index]);
  },
  async setActive(id: string, isActive: boolean) {
    const item = records.find((record) => record.id === id);
    if (!item) {
      throw new Error(`Cheque Register "${id}" was not found.`);
    }
    item.isActive = isActive;
    return copy(item);
  },
};
