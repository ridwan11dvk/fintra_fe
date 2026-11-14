import type { departmentDevAdapter as DepartmentDevAdapter } from "@/features/master-data/department/data/department.dev-adapter";
import { beforeEach, describe, expect, it, vi } from "vitest";

let adapter: typeof DepartmentDevAdapter;

beforeEach(async () => {
  vi.resetModules();
  ({ departmentDevAdapter: adapter } = await import("@/features/master-data/department/data/department.dev-adapter"));
});

describe("departmentDevAdapter", () => {
  it("searches and paginates the Department list", async () => {
    const firstPage = await adapter.list({ page: 1, pageSize: 10 });
    const secondPage = await adapter.list({ page: 2, pageSize: 10 });

    expect(firstPage.totalItems).toBe(16);
    expect(firstPage.totalPages).toBe(2);
    expect(firstPage.items).toHaveLength(10);
    expect(secondPage.items).toHaveLength(6);

    const search = await adapter.list({ search: "finance", pageSize: 10 });
    expect(search.items.map((record) => record.name)).toEqual(expect.arrayContaining(["Finance", "Finance Operations", "Risk Management"]));
  });

  it("creates with trimmed values and rejects duplicate codes case-insensitively", async () => {
    const created = await adapter.create({ name: "  Training  ", code: "TRN-001", parentDepartmentId: null, status: "ACTIVE" });

    expect(created.name).toBe("Training");
    expect(created.code).toBe("TRN-001");
    await expect(adapter.create({ name: "Duplicate", code: "trn-001", parentDepartmentId: null, status: "ACTIVE" })).rejects.toThrow("unique");
  });

  it("requires an active parent and rejects self-parenting", async () => {
    await expect(adapter.create({ name: "Child", code: "CH-001", parentDepartmentId: "DEPT-OPS-001", status: "ACTIVE" })).rejects.toThrow("active");
    await expect(adapter.create({ name: "Orphan", code: "ORPH-001", parentDepartmentId: "missing-parent", status: "ACTIVE" })).rejects.toThrow("not found");
    const created = await adapter.create({ name: "Parent Check", code: "PC-001", parentDepartmentId: null, status: "ACTIVE" });
    await expect(adapter.update(created.id, { name: created.name, code: created.code, parentDepartmentId: created.id, status: created.status })).rejects.toThrow("own parent");
  });

  it("rejects hierarchy cycles", async () => {
    const parent = await adapter.create({ name: "Cycle Parent", code: "CYC-P", parentDepartmentId: null, status: "ACTIVE" });
    const child = await adapter.create({ name: "Cycle Child", code: "CYC-C", parentDepartmentId: parent.id, status: "ACTIVE" });

    await expect(adapter.update(parent.id, { ...parent, parentDepartmentId: child.id })).rejects.toThrow("descendants");
  });

  it("updates Department fields and Active/Inactive status", async () => {
    const created = await adapter.create({ name: "Status Check", code: "STAT-001", parentDepartmentId: null, status: "ACTIVE" });
    const updated = await adapter.update(created.id, { name: "Status Review", code: "STAT-002", parentDepartmentId: null, status: "INACTIVE" });
    const statusChanged = await adapter.setStatus(updated.id, "ACTIVE");

    expect(statusChanged).toMatchObject({ name: "Status Review", code: "STAT-002", status: "ACTIVE" });
  });
});
