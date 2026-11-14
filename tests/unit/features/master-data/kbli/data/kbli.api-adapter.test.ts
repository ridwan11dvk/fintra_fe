import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { kbliApiAdapter } from "@/features/master-data/kbli/data/kbli.api-adapter";
import { payableApi } from "@/features/master-data/shared/payable-api";
import { server } from "@tests/unit/mocks/server";

const BASE = "http://localhost:3000";
const ENDPOINT = `${BASE}/master-data/kbli`;
const PAYABLE_PATH = "/api/master-data/kbli";
const PAYABLE_ENDPOINT = `${BASE}${PAYABLE_PATH}`;
const record = {
  id: 7,
  code: "47111",
  category: "Retail",
  businessFieldName: "Retail trade",
  active: true,
};
const secondRecord = {
  ...record,
  id: 8,
  code: "47112",
  category: "Wholesale",
  businessFieldName: "Retail services",
};
const expectedRecord = {
  id: "7",
  code: record.code,
  category: record.category,
  businessFieldName: record.businessFieldName,
  status: "ACTIVE" as const,
};
const expectedSecondRecord = {
  id: "8",
  code: secondRecord.code,
  category: secondRecord.category,
  businessFieldName: secondRecord.businessFieldName,
  status: "ACTIVE" as const,
};

function apiResponse<T>(data: T) {
  return { data, message: "KBLI request completed", status: "SUCCESS" as const };
}

describe("kbliApiAdapter", () => {
  it("uses the core API route and unwraps responses for list, detail, and writes", async () => {
    const requestPaths: string[] = [];
    let createBody: unknown;
    let updateBody: unknown;

    const trackPath = (request: Request) => {
      requestPaths.push(new URL(request.url).pathname);
    };

    server.use(
      http.get(ENDPOINT, ({ request }) => {
        trackPath(request);
        return HttpResponse.json(apiResponse([record]));
      }),
      http.get(`${ENDPOINT}/7`, ({ request }) => {
        trackPath(request);
        return HttpResponse.json(apiResponse(record));
      }),
      http.post(ENDPOINT, async ({ request }) => {
        trackPath(request);
        createBody = await request.json();
        return HttpResponse.json(apiResponse(record));
      }),
      http.put(`${ENDPOINT}/7`, async ({ request }) => {
        trackPath(request);
        updateBody = await request.json();
        return HttpResponse.json(apiResponse({ ...record, businessFieldName: "Updated retail trade" }));
      }),
      http.post(`${ENDPOINT}/7/activate`, ({ request }) => {
        trackPath(request);
        return HttpResponse.json(apiResponse(record));
      }),
      http.post(`${ENDPOINT}/7/deactivate`, ({ request }) => {
        trackPath(request);
        return HttpResponse.json(apiResponse({ ...record, active: false }));
      }),
    );

    const list = await kbliApiAdapter.list({ page: 1, pageSize: 10 });
    const detail = await kbliApiAdapter.get("7");
    const input = {
      code: "47111",
      category: "Retail",
      businessFieldName: "Retail trade",
      status: "ACTIVE" as const,
    };
    const created = await kbliApiAdapter.create(input);
    const updated = await kbliApiAdapter.update("7", { ...input, businessFieldName: "Updated retail trade" });
    const activated = await kbliApiAdapter.setStatus("7", "ACTIVE");
    const deactivated = await kbliApiAdapter.setStatus("7", "INACTIVE");

    expect(requestPaths).toEqual([
      "/master-data/kbli",
      "/master-data/kbli/7",
      "/master-data/kbli",
      "/master-data/kbli/7",
      "/master-data/kbli/7/activate",
      "/master-data/kbli/7/deactivate",
    ]);
    expect(list.items).toEqual([expectedRecord]);
    expect(detail).toEqual(expectedRecord);
    expect(createBody).toEqual({ code: "47111", category: "Retail", businessFieldName: "Retail trade", active: true });
    expect(updateBody).toEqual({ code: "47111", category: "Retail", businessFieldName: "Updated retail trade", active: true });
    expect(created.status).toBe("ACTIVE");
    expect(updated.businessFieldName).toBe("Updated retail trade");
    expect(activated.status).toBe("ACTIVE");
    expect(deactivated.status).toBe("INACTIVE");
  });

  it.each([
    { search: "47111", expectedId: "7" },
    { search: "Retail trade", expectedId: "7" },
    { search: "wholesale", expectedId: "8" },
  ])("searches KBLI code, business field, and category: $search", async ({ search, expectedId }) => {
    server.use(http.get(ENDPOINT, () => HttpResponse.json(apiResponse([record, secondRecord]))));

    const result = await kbliApiAdapter.list({ search });

    expect(result.items.map((item) => item.id)).toEqual([expectedId]);
  });

  it("returns an empty result for an unmatched search", async () => {
    server.use(http.get(ENDPOINT, () => HttpResponse.json(apiResponse([record]))));

    await expect(kbliApiAdapter.list({ search: "unmatched" })).resolves.toMatchObject({
      items: [],
      totalItems: 0,
    });
  });

  it("paginates matching results without losing the search", async () => {
    server.use(http.get(ENDPOINT, () => HttpResponse.json(apiResponse([record, secondRecord]))));

    await expect(kbliApiAdapter.list({ search: "retail", page: 2, pageSize: 1 })).resolves.toEqual({
      items: [expectedSecondRecord],
      page: 2,
      pageSize: 1,
      totalItems: 2,
      totalPages: 2,
    });
  });

  it("accepts the legacy success envelope", async () => {
    server.use(http.get(ENDPOINT, () => HttpResponse.json({ success: true, data: [record] })));

    await expect(kbliApiAdapter.list()).resolves.toMatchObject({ items: [expectedRecord] });
  });

  it("accepts a raw record array response", async () => {
    server.use(http.get(ENDPOINT, () => HttpResponse.json([record])));

    await expect(kbliApiAdapter.list()).resolves.toMatchObject({ items: [expectedRecord] });
  });

  it.each([
    { status: "ERROR", message: "KBLI is unavailable" },
    { success: false, message: "KBLI is unavailable" },
  ])("rejects a KBLI error envelope with its message", async (payload) => {
    server.use(http.get(ENDPOINT, () => HttpResponse.json(payload)));

    await expect(kbliApiAdapter.list()).rejects.toThrow("KBLI is unavailable");
  });

  it("preserves HTTP authorization rejection", async () => {
    server.use(http.get(ENDPOINT, () => HttpResponse.json({ message: "Access denied" }, { status: 403 })));

    await expect(kbliApiAdapter.list()).rejects.toThrow();
  });
});

describe("payableApi error handling", () => {
  it.each([
    ["status error", { status: "ERROR", message: "Access denied" }],
    ["success flag error", { success: false, message: "Access denied" }],
  ])("rejects a %s envelope", async (_label, payload) => {
    server.use(http.get("*/api/master-data/kbli", () => HttpResponse.json(payload)));

    await expect(payableApi.get(PAYABLE_PATH)).rejects.toThrow("Access denied");
  });
});
