import type {
  ProfitCenterInput,
  ProfitCenterListParams,
  ProfitCenterListResult,
  ProfitCenterRecord,
} from "./profit-center.types";
import { profitCenterApiAdapter } from "./profit-center.api-adapter";
import { usePayableMasterDataApi } from "../../shared/payable-api";

async function getDevelopmentAdapter() {
  if (!import.meta.env.DEV) {
    throw new Error("Profit Center API is not integrated. Development fixtures are disabled outside development mode.");
  }
  return (await import("./profit-center.dev-adapter")).profitCenterDevAdapter;
}

export const profitCenterService = {
  async list(params?: ProfitCenterListParams): Promise<ProfitCenterListResult> {
    return usePayableMasterDataApi ? profitCenterApiAdapter.list(params) : (await getDevelopmentAdapter()).list(params);
  },
  async get(id: string): Promise<ProfitCenterRecord> {
    return usePayableMasterDataApi ? profitCenterApiAdapter.get(id) : (await getDevelopmentAdapter()).get(id);
  },
  async create(input: ProfitCenterInput): Promise<ProfitCenterRecord> {
    return usePayableMasterDataApi ? profitCenterApiAdapter.create(input) : (await getDevelopmentAdapter()).create(input);
  },
  async update(id: string, input: ProfitCenterInput): Promise<ProfitCenterRecord> {
    return usePayableMasterDataApi ? profitCenterApiAdapter.update(id, input) : (await getDevelopmentAdapter()).update(id, input);
  },
  async setStatus(id: string, status: ProfitCenterRecord["status"]): Promise<ProfitCenterRecord> {
    return usePayableMasterDataApi ? profitCenterApiAdapter.setStatus(id, status) : (await getDevelopmentAdapter()).setStatus(id, status);
  },
  async listActiveSegmentOptions() {
    return usePayableMasterDataApi ? profitCenterApiAdapter.listActiveSegmentOptions() : (await getDevelopmentAdapter()).listActiveSegmentOptions();
  },
  async listResponsiblePeople() {
    return usePayableMasterDataApi ? profitCenterApiAdapter.listResponsiblePeople() : (await getDevelopmentAdapter()).listResponsiblePeople();
  },
};
