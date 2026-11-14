import { apiClient } from "@railfinance/core/lib";
import type { PagedApiResponse, PaginationParams } from "@railfinance/core/types";
import { bankService } from "../../bank/data/bank.service";
import type { HouseBankResponse } from "@/features/master-data/house-bank/data/house-bank.types";
import { houseBankService } from "@/features/master-data/house-bank/data/house-bank.service";
import type {
  ChequeRegisterHouseBankOption,
  ChequeRegisterInput,
  ChequeRegisterListParams,
  ChequeRegisterListResult,
  ChequeRegisterRecord,
  ChequeRegisterStatus,
} from "./cheque-register.types";

const CHEQUE_REGISTER_ENDPOINT = "/master-data/cheque-registers";
const HOUSE_BANK_PAGE_SIZE = 100;
const CHEQUE_REGISTER_STATUSES: ReadonlySet<ChequeRegisterStatus> = new Set([
  "OPEN",
  "BOOKED",
  "CANCEL",
  "RELEASE",
]);

type HouseBankWithBankName = HouseBankResponse & { bankName: string };

function houseBankLabel(bank: HouseBankWithBankName): string {
  return `${bank.bankName} - ${bank.accountNumber} - ${bank.accountName}`;
}

interface ApiEnvelope<T> {
  data: T;
  message: string;
  status: string;
}

interface ChequeRegisterApiRecord {
  id: number;
  chequeNumber: string;
  houseBankId: number;
  houseBankName: string;
  status: string;
  releaseDate: string | null;
  active: boolean;
}

interface ChequeRegisterApiInput {
  chequeNumber: string;
  houseBankId: number;
  status: ChequeRegisterStatus;
  releaseDate: string | null;
  active: boolean;
}

interface ChequeRegisterPage {
  content: ChequeRegisterApiRecord[];
  pagination: {
    total: number;
    pageSize: number;
    pageNumber: number;
    totalPages: number;
    currentPage: number;
  };
}

function toNumericId(id: string, label: string): number {
  const numericId = Number(id);
  if (!Number.isSafeInteger(numericId) || numericId < 1) {
    throw new Error(`Invalid ${label}: ${id}`);
  }
  return numericId;
}

function toChequeRegisterStatus(status: string): ChequeRegisterStatus {
  const normalizedStatus = status.toUpperCase() as ChequeRegisterStatus;
  if (!CHEQUE_REGISTER_STATUSES.has(normalizedStatus)) {
    throw new Error(`Unsupported Cheque Register status: ${status}`);
  }
  return normalizedStatus;
}

function toChequeRegisterRecord(
  record: ChequeRegisterApiRecord,
  houseBanks: readonly HouseBankWithBankName[],
): ChequeRegisterRecord {
  const houseBank = houseBanks.find((item) => item.id === record.houseBankId);
  return {
    id: String(record.id),
    houseBankId: String(record.houseBankId),
    houseBankName: houseBank ? houseBankLabel(houseBank) : record.houseBankName || String(record.houseBankId),
    houseBankInstitutionName: houseBank?.bankName,
    houseBankAccountNumber: houseBank?.accountNumber,
    houseBankAccountName: houseBank?.accountName,
    chequeNumber: record.chequeNumber,
    status: toChequeRegisterStatus(record.status),
    releaseDate: record.releaseDate ?? "",
    isActive: record.active,
  };
}

function toChequeRegisterApiInput(input: ChequeRegisterInput): ChequeRegisterApiInput {
  return {
    chequeNumber: input.chequeNumber.trim(),
    houseBankId: toNumericId(input.houseBankId, "House Bank ID"),
    status: input.status,
    releaseDate: input.status === "RELEASE" ? input.releaseDate : null,
    active: input.isActive,
  };
}

async function getAllHouseBankRecords(): Promise<HouseBankWithBankName[]> {
  const records: HouseBankResponse[] = [];
  let page = 0;
  let totalPages = 1;

  while (page < totalPages) {
    const params: PaginationParams = { page, size: HOUSE_BANK_PAGE_SIZE };
    const response: PagedApiResponse<HouseBankResponse> =
      await houseBankService.listHouseBanks(params);
    const result = response.data;
    if (!result) {
      throw new Error(response.message || "Unable to load House Bank records");
    }
    records.push(...result.content);
    totalPages = result.pagination.totalPages;
    page += 1;
  }

  const bankNames = new Map<string, string>();
  let bankPage = 0;
  let bankTotalPages = 1;
  while (bankPage < bankTotalPages) {
    const response = await bankService.listBanks({ page: bankPage, size: HOUSE_BANK_PAGE_SIZE });
    if (!response.data) throw new Error(response.message || "Unable to load Banks");
    for (const bank of response.data.content) bankNames.set(bank.code, bank.name);
    bankTotalPages = response.data.pagination.totalPages;
    bankPage += 1;
  }
  return records.map((record) => ({
    ...record,
    bankName: bankNames.get(record.bankCode) || record.bankCode,
  }));
}

async function postChequeRegister(input: ChequeRegisterInput): Promise<ChequeRegisterApiRecord> {
  const response = await apiClient.post<ApiEnvelope<ChequeRegisterApiRecord>>(
    CHEQUE_REGISTER_ENDPOINT,
    toChequeRegisterApiInput(input),
  );
  return response.data.data;
}

async function createChequeRegister(input: ChequeRegisterInput): Promise<ChequeRegisterRecord> {
  const houseBanks = await getAllHouseBankRecords();
  const record = await postChequeRegister(input);
  return toChequeRegisterRecord(record, houseBanks);
}

export function getChequeRegisterErrorMessage(
  error: unknown,
  fallback = "Unable to save Cheque Register",
): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = error as {
      response?: { data?: { message?: unknown; detail?: unknown } };
    };
    const apiMessage = response.response?.data?.message;
    if (typeof apiMessage === "string") return apiMessage;
    const apiDetail = response.response?.data?.detail;
    if (typeof apiDetail === "string") return apiDetail;
  }
  return error instanceof Error ? error.message : fallback;
}

export const chequeRegisterService = {
  async getHouseBanks(): Promise<ChequeRegisterHouseBankOption[]> {
    const houseBanks = await getAllHouseBankRecords();
    return houseBanks
      .filter((houseBank) => houseBank.isActive)
      .map((houseBank) => ({
        id: String(houseBank.id),
        name: houseBankLabel(houseBank),
        status: "ACTIVE",
      }));
  },

  async list(params: ChequeRegisterListParams = {}): Promise<ChequeRegisterListResult> {
    const page = Math.max(0, Math.trunc(params.page ?? 0));
    const pageSize = Math.max(1, Math.trunc(params.pageSize ?? 10));
    const [chequeResponse, houseBanks] = await Promise.all([
      apiClient.get<ApiEnvelope<ChequeRegisterPage>>(CHEQUE_REGISTER_ENDPOINT, {
        params: { page, size: pageSize, search: params.search?.trim() || undefined },
      }),
      getAllHouseBankRecords(),
    ]);
    const result = chequeResponse.data.data;
    const currentPage = result.pagination.currentPage;

    return {
      items: result.content.map((record) => toChequeRegisterRecord(record, houseBanks)),
      page: currentPage,
      pageSize: result.pagination.pageSize,
      totalItems: result.pagination.total,
      totalPages: result.pagination.totalPages,
    };
  },

  async get(id: string): Promise<ChequeRegisterRecord> {
    const [response, houseBanks] = await Promise.all([
      apiClient.get<ApiEnvelope<ChequeRegisterApiRecord>>(
        `${CHEQUE_REGISTER_ENDPOINT}/${toNumericId(id, "Cheque Register ID")}`,
      ),
      getAllHouseBankRecords(),
    ]);
    return toChequeRegisterRecord(response.data.data, houseBanks);
  },

  async create(input: ChequeRegisterInput): Promise<ChequeRegisterRecord> {
    return createChequeRegister(input);
  },

  async createBatch(inputs: ChequeRegisterInput[]): Promise<ChequeRegisterRecord[]> {
    if (inputs.length === 0) throw new Error("At least one Cheque Number is required");

    const duplicateNumbers = new Set<string>();
    for (const input of inputs) {
      const duplicateKey = `${input.houseBankId.toLowerCase()}:${input.chequeNumber.trim().toLowerCase()}`;
      if (duplicateNumbers.has(duplicateKey)) {
        throw new Error("Cheque Number must be unique per House Bank. No rows were submitted.");
      }
      duplicateNumbers.add(duplicateKey);
    }

    const houseBanks = await getAllHouseBankRecords();
    const response = await apiClient.post<ApiEnvelope<ChequeRegisterApiRecord[]>>(
      `${CHEQUE_REGISTER_ENDPOINT}/bulk`,
      inputs.map(toChequeRegisterApiInput),
    );
    return response.data.data.map((record) => toChequeRegisterRecord(record, houseBanks));
  },

  async update(id: string, input: ChequeRegisterInput): Promise<ChequeRegisterRecord> {
    const houseBanks = await getAllHouseBankRecords();
    const response = await apiClient.put<ApiEnvelope<ChequeRegisterApiRecord>>(
      `${CHEQUE_REGISTER_ENDPOINT}/${toNumericId(id, "Cheque Register ID")}`,
      toChequeRegisterApiInput(input),
    );
    return toChequeRegisterRecord(response.data.data, houseBanks);
  },

  async setActive(id: string, isActive: boolean): Promise<ChequeRegisterRecord> {
    const endpoint = isActive ? "activate" : "deactivate";
    const houseBanks = await getAllHouseBankRecords();
    const response = await apiClient.post<ApiEnvelope<ChequeRegisterApiRecord>>(
      `${CHEQUE_REGISTER_ENDPOINT}/${toNumericId(id, "Cheque Register ID")}/${endpoint}`,
    );
    return toChequeRegisterRecord(response.data.data, houseBanks);
  },
};
