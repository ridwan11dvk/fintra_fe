import type { DepartmentInput, DepartmentListParams, DepartmentListResult, DepartmentRecord, DepartmentStatus } from "./department.types";
import { departmentApiAdapter } from "./department.api-adapter";
import { usePayableMasterDataApi } from "../../shared/payable-api";

async function getDevelopmentAdapter() {
  if (!import.meta.env.DEV) throw new Error("Department API is not integrated. Development fixtures are disabled outside development mode.");
  return (await import("./department.dev-adapter")).departmentDevAdapter;
}

export const departmentService = {
  async list(params?: DepartmentListParams): Promise<DepartmentListResult> { return usePayableMasterDataApi ? departmentApiAdapter.list(params) : (await getDevelopmentAdapter()).list(params); },
  async get(id: string): Promise<DepartmentRecord> { return usePayableMasterDataApi ? departmentApiAdapter.get(id) : (await getDevelopmentAdapter()).get(id); },
  async create(input: DepartmentInput): Promise<DepartmentRecord> { return usePayableMasterDataApi ? departmentApiAdapter.create(input) : (await getDevelopmentAdapter()).create(input); },
  async update(id: string, input: DepartmentInput): Promise<DepartmentRecord> { return usePayableMasterDataApi ? departmentApiAdapter.update(id, input) : (await getDevelopmentAdapter()).update(id, input); },
  async setStatus(id: string, status: DepartmentStatus): Promise<DepartmentRecord> { return usePayableMasterDataApi ? departmentApiAdapter.setStatus(id, status) : (await getDevelopmentAdapter()).setStatus(id, status); },
};
