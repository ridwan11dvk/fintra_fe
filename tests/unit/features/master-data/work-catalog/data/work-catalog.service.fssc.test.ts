import { workCatalogService } from "@/features/master-data/work-catalog/data/work-catalog.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

const BASE = "http://localhost:3000";

const requestPayload = {
  workType: "Pengangkutan",
  subCategoryId: 1,
  groupCategoryId: 1,
  mainCategoryId: 1,
  cashflowCategoryId: 1,
  procurementSchemaId: 1,
  description: "Jasa angkut barang",
  taxes: [
    { taxSubject: "BADAN_USAHA" as const, taxRateId: 1 },
    { taxSubject: "PERORANGAN" as const, taxRateId: 2 },
  ],
};

describe("workCatalogService FSSC-WC", () => {
  it("FSSC-WC-002: lists Work Catalog records from the API", async () => {
    const result = await workCatalogService.listWorkCatalogs({ page: 1, size: 10 });
    expect(result.status).toBe("SUCCESS");
    expect(result.data?.content.length).toBeGreaterThan(0);
  });

  it("FSSC-WC-003: forwards search keyword when listing", async () => {
    let search: string | null = null;
    server.use(
      http.get(`${BASE}/master/work-catalog`, ({ request }) => {
        search = new URL(request.url).searchParams.get("search");
        return HttpResponse.json({
          status: "SUCCESS",
          message: "ok",
          data: {
            content: [],
            pagination: {
              total: 0,
              pageSize: 10,
              pageNumber: 1,
              totalPages: 0,
              currentPage: 1,
              from: 0,
              to: 0,
            },
          },
        });
      }),
    );
    await workCatalogService.listWorkCatalogs({ page: 1, size: 10, search: "angkut" });
    expect(search).toBe("angkut");
  });

  it("FSSC-WC-004: returns empty content when search finds nothing", async () => {
    server.use(
      http.get(`${BASE}/master/work-catalog`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          message: "ok",
          data: {
            content: [],
            pagination: {
              total: 0,
              pageSize: 10,
              pageNumber: 1,
              totalPages: 0,
              currentPage: 1,
              from: 0,
              to: 0,
            },
          },
        }),
      ),
    );
    const result = await workCatalogService.listWorkCatalogs({
      page: 1,
      size: 10,
      search: "zzz-none",
    });
    expect(result.data?.content).toEqual([]);
    expect(result.data?.pagination.total).toBe(0);
  });

  it("FSSC-WC-007: exposes total and page indicators from pagination", async () => {
    const result = await workCatalogService.listWorkCatalogs({ page: 1, size: 10 });
    expect(result.data?.pagination.total).toBeDefined();
    expect(result.data?.pagination.currentPage).toBeDefined();
  });

  it("FSSC-WC-008: requests the next page via page param", async () => {
    let page: string | null = null;
    server.use(
      http.get(`${BASE}/master/work-catalog`, ({ request }) => {
        page = new URL(request.url).searchParams.get("page");
        return HttpResponse.json({
          status: "SUCCESS",
          message: "ok",
          data: {
            content: [],
            pagination: {
              total: 20,
              pageSize: 10,
              pageNumber: 2,
              totalPages: 2,
              currentPage: 2,
              from: 11,
              to: 20,
            },
          },
        });
      }),
    );
    await workCatalogService.listWorkCatalogs({ page: 2, size: 10 });
    expect(page).toBe("2");
  });

  it("FSSC-WC-010: keeps search when requesting another page", async () => {
    let url: URL | null = null;
    server.use(
      http.get(`${BASE}/master/work-catalog`, ({ request }) => {
        url = new URL(request.url);
        return HttpResponse.json({
          status: "SUCCESS",
          message: "ok",
          data: {
            content: [],
            pagination: {
              total: 0,
              pageSize: 10,
              pageNumber: 2,
              totalPages: 0,
              currentPage: 2,
              from: 0,
              to: 0,
            },
          },
        });
      }),
    );
    await workCatalogService.listWorkCatalogs({
      page: 2,
      size: 10,
      search: "angkut",
    });
    expect(url?.searchParams.get("page")).toBe("2");
    expect(url?.searchParams.get("search")).toBe("angkut");
  });

  it("FSSC-WC-015: surfaces duplicate Work Type create errors from the API", async () => {
    server.use(
      http.post(`${BASE}/master/work-catalog`, () =>
        HttpResponse.json(
          { status: "ERROR", message: "Work Type already exists" },
          { status: 400 },
        ),
      ),
    );
    await expect(workCatalogService.createWorkCatalog(requestPayload)).rejects.toThrow();
  });

  it("FSSC-WC-043: loads a Work Catalog by id for View", async () => {
    const result = await workCatalogService.getWorkCatalogById(1);
    expect(result.status).toBe("SUCCESS");
    expect(result.data?.id).toBe(1);
  });

  it("FSSC-WC-050: updates Work Type to a unique value", async () => {
    let body: { workType?: string } | undefined;
    server.use(
      http.put(`${BASE}/master/work-catalog/1`, async ({ request }) => {
        body = (await request.json()) as { workType?: string };
        return HttpResponse.json({
          status: "SUCCESS",
          message: "ok",
          data: { id: 1, ...requestPayload, workType: "Unique Type" },
        });
      }),
    );
    await workCatalogService.updateWorkCatalog(1, {
      ...requestPayload,
      workType: "Unique Type",
    });
    expect(body?.workType).toBe("Unique Type");
  });

  it("FSSC-WC-061: deactivates an active Work Catalog", async () => {
    const result = await workCatalogService.deactivateWorkCatalog(1);
    expect(result.status).toBe("SUCCESS");
  });

  it("FSSC-WC-065: activates an inactive Work Catalog", async () => {
    const result = await workCatalogService.activateWorkCatalog(1);
    expect(result.status).toBe("SUCCESS");
  });

  it("FSSC-WC-066: active Work Types are available via active listing", async () => {
    const result = await workCatalogService.getActiveWorkCatalogs();
    expect(result.status).toBe("SUCCESS");
    expect(result.data?.every((row) => row.isActive)).toBe(true);
  });
});
