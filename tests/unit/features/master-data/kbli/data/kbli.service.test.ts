import {
  getKbliErrorMessage,
  kbliService,
} from "@/features/master-data/kbli/data/kbli.service";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/master-data/shared/payable-api", async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import("@/features/master-data/shared/payable-api")
    >();
  return {
    ...actual,
    usePayableMasterDataApi: true,
  };
});

const BASE = "http://localhost:3000";
const ENDPOINT = `${BASE}/master-data/kbli`;

const record = {
  id: 7,
  code: "47111",
  category: "Retail",
  businessFieldName: "Retail trade",
  active: true,
};

describe("kbliService", () => {
  it("[FSSC-KBLI-001] lists KBLI records through the API adapter", async () => {
    server.use(
      http.get(ENDPOINT, () =>
        HttpResponse.json({
          status: "SUCCESS",
          message: "ok",
          data: [record],
        }),
      ),
    );

    const result = await kbliService.list();

    expect(result.items).toEqual([
      {
        id: "7",
        code: "47111",
        category: "Retail",
        businessFieldName: "Retail trade",
        status: "ACTIVE",
      },
    ]);
  });

  it("[FSSC-KBLI-003] searches KBLI records by keyword", async () => {
    server.use(
      http.get(ENDPOINT, () =>
        HttpResponse.json({
          status: "SUCCESS",
          message: "ok",
          data: [record, { ...record, id: 8, code: "47112", category: "Wholesale" }],
        }),
      ),
    );

    const result = await kbliService.list({ search: "wholesale" });

    expect(result.items.map((item) => item.id)).toEqual(["8"]);
  });

  it("[FSSC-KBLI-012] creates a KBLI record", async () => {
    server.use(
      http.post(ENDPOINT, async ({ request }) => {
        const body = await request.json();
        expect(body).toEqual({
          code: "47111",
          category: "Retail",
          businessFieldName: "Retail trade",
          active: true,
        });
        return HttpResponse.json({
          status: "SUCCESS",
          message: "created",
          data: record,
        });
      }),
    );

    const created = await kbliService.create({
      code: "47111",
      category: "Retail",
      businessFieldName: "Retail trade",
      status: "ACTIVE",
    });

    expect(created.status).toBe("ACTIVE");
  });

  it("[FSSC-KBLI-027] updates a KBLI record", async () => {
    server.use(
      http.put(`${ENDPOINT}/7`, async ({ request }) => {
        const body = await request.json();
        expect(body).toMatchObject({
          businessFieldName: "Updated retail trade",
        });
        return HttpResponse.json({
          status: "SUCCESS",
          message: "updated",
          data: { ...record, businessFieldName: "Updated retail trade" },
        });
      }),
    );

    const updated = await kbliService.update("7", {
      code: "47111",
      category: "Retail",
      businessFieldName: "Updated retail trade",
      status: "ACTIVE",
    });

    expect(updated.businessFieldName).toBe("Updated retail trade");
  });

  it("[FSSC-KBLI-025] sets KBLI status to inactive", async () => {
    server.use(
      http.post(`${ENDPOINT}/7/deactivate`, () =>
        HttpResponse.json({
          status: "SUCCESS",
          message: "deactivated",
          data: { ...record, active: false },
        }),
      ),
    );

    const deactivated = await kbliService.setStatus("7", "INACTIVE");

    expect(deactivated.status).toBe("INACTIVE");
  });
});

describe("getKbliErrorMessage", () => {
  it("returns API message from axios-like errors", () => {
    expect(
      getKbliErrorMessage({
        response: { data: { message: "Duplicate KBLI code" } },
      }),
    ).toBe("Duplicate KBLI code");
  });

  it("falls back to Error.message", () => {
    expect(getKbliErrorMessage(new Error("Network down"))).toBe("Network down");
  });

  it("uses default message for unknown errors", () => {
    expect(getKbliErrorMessage(null)).toBe("Unable to save KBLI.");
  });
});
