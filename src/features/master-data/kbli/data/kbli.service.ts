import type { KbliInput, KbliListParams, KbliListResult, KbliRecord, KbliStatus } from "./kbli.types";
import { kbliApiAdapter } from "./kbli.api-adapter";
import { usePayableMasterDataApi } from "../../shared/payable-api";

async function getDevelopmentAdapter() {
  if (!import.meta.env.DEV) throw new Error("KBLI API is not integrated. Development fixtures are disabled outside development mode.");
  return (await import("./kbli.dev-adapter")).kbliDevAdapter;
}

export const kbliService = {
  async list(params?: KbliListParams): Promise<KbliListResult> { return usePayableMasterDataApi ? kbliApiAdapter.list(params) : (await getDevelopmentAdapter()).list(params); },
  async get(id: string): Promise<KbliRecord> { return usePayableMasterDataApi ? kbliApiAdapter.get(id) : (await getDevelopmentAdapter()).get(id); },
  async create(input: KbliInput): Promise<KbliRecord> { return usePayableMasterDataApi ? kbliApiAdapter.create(input) : (await getDevelopmentAdapter()).create(input); },
  async update(id: string, input: KbliInput): Promise<KbliRecord> { return usePayableMasterDataApi ? kbliApiAdapter.update(id, input) : (await getDevelopmentAdapter()).update(id, input); },
  async setStatus(id: string, status: KbliStatus): Promise<KbliRecord> { return usePayableMasterDataApi ? kbliApiAdapter.setStatus(id, status) : (await getDevelopmentAdapter()).setStatus(id, status); },
};

export function getKbliErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = error as { response?: { data?: { message?: unknown } } };
    const message = response.response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return error instanceof Error ? error.message : "Unable to save KBLI.";
}
