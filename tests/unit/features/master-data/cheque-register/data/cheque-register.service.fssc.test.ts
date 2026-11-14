import { chequeRegisterService } from "@/features/master-data/cheque-register/data/cheque-register.service";
import type { ChequeRegisterInput } from "@/features/master-data/cheque-register/data/cheque-register.types";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it, beforeEach } from "vitest";

const BASE = "http://localhost:3000";

function houseBankListResponse() {
  return {
    status: "SUCCESS",
    message: "House Banks loaded",
    data: {
      content: [
        {
          id: 1,
          accountId: "HB-001",
          accountNumber: "00012345",
          accountName: "Operating Account",
          companyCode: "1000",
          currencyCode: "IDR",
          erpCode: "ERP-001",
          bankCode: "BCA",
          isActive: true,
        },
        {
          id: 2,
          accountId: "HB-002",
          accountNumber: "00056789",
          accountName: "Inactive Account",
          companyCode: "1000",
          currencyCode: "IDR",
          erpCode: "ERP-002",
          bankCode: "BNI",
          isActive: false,
        },
      ],
      pagination: {
        total: 2,
        pageSize: 100,
        pageNumber: 0,
        currentPage: 0,
        totalPages: 1,
        from: 0,
        to: 1,
      },
    },
  };
}

function chequeRegisterResponse(overrides: Record<string, unknown> = {}) {
  return {
    id: 42,
    chequeNumber: "CHQ-042",
    houseBankId: 1,
    houseBankName: "Operating Account",
    status: "OPEN",
    releaseDate: null,
    active: true,
    ...overrides,
  };
}

function apiEnvelope(data: unknown) {
  return { status: "SUCCESS", message: "ok", data };
}

function chequeRegisterPage(content: unknown[]) {
  return {
    content,
    pagination: {
      total: content.length,
      pageSize: 10,
      pageNumber: 0,
      currentPage: 1,
      totalPages: 1,
      from: content.length === 0 ? 0 : 1,
      to: content.length,
    },
  };
}

const openInput: ChequeRegisterInput = {
  chequeNumber: "CHQ-100",
  houseBankId: "1",
  status: "OPEN",
  releaseDate: "",
  isActive: true,
};

describe("chequeRegisterService FSSC-CHQ", () => {
  beforeEach(() => {
    server.use(
      http.get(`${BASE}/master/house-bank`, () =>
        HttpResponse.json(houseBankListResponse()),
      ),
      http.get(`${BASE}/master-data/cheque-registers`, () =>
        HttpResponse.json(
          apiEnvelope(
            chequeRegisterPage([
              chequeRegisterResponse(),
              chequeRegisterResponse({
                id: 43,
                chequeNumber: "CHQ-043",
                status: "RELEASE",
                releaseDate: "2026-02-01",
              }),
            ]),
          ),
        ),
      ),
    );
  });

  it("FSSC-CHQ-002: lists Cheque Register records", async () => {
    const result = await chequeRegisterService.list({ page: 1, pageSize: 10, search: "" });
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("FSSC-CHQ-003: maps Open status Release Date as empty string", async () => {
    const result = await chequeRegisterService.list({ page: 1, pageSize: 10, search: "" });
    const open = result.items.find((row) => row.status === "OPEN");
    expect(open?.releaseDate).toBe("");
  });

  it("FSSC-CHQ-004: maps Release Date for Status Release", async () => {
    const result = await chequeRegisterService.list({ page: 1, pageSize: 10, search: "" });
    const released = result.items.find((row) => row.status === "RELEASE");
    expect(released?.releaseDate).toBe("2026-02-01");
  });

  it("FSSC-CHQ-005: forwards search keyword", async () => {
    let search: string | null = null;
    server.use(
      http.get(`${BASE}/master-data/cheque-registers`, ({ request }) => {
        search = new URL(request.url).searchParams.get("search");
        return HttpResponse.json(apiEnvelope(chequeRegisterPage([])));
      }),
    );
    await chequeRegisterService.list({ page: 1, pageSize: 10, search: "CHQ-042" });
    expect(search).toBe("CHQ-042");
  });

  it("FSSC-CHQ-006: returns empty list when search finds nothing", async () => {
    server.use(
      http.get(`${BASE}/master-data/cheque-registers`, () =>
        HttpResponse.json(apiEnvelope(chequeRegisterPage([]))),
      ),
    );
    const result = await chequeRegisterService.list({
      page: 1,
      pageSize: 10,
      search: "none",
    });
    expect(result.items).toEqual([]);
    expect(result.totalItems).toBe(0);
  });

  it("FSSC-CHQ-009: exposes total count for pagination", async () => {
    const result = await chequeRegisterService.list({ page: 1, pageSize: 10, search: "" });
    expect(result.totalItems).toBeGreaterThan(0);
  });

  it("FSSC-CHQ-021: House Bank options only include active rekening bank", async () => {
    const options = await chequeRegisterService.getHouseBanks();
    expect(options.every((row) => row.status === "ACTIVE")).toBe(true);
    expect(options.some((row) => row.id === "1")).toBe(true);
    expect(options.some((row) => row.id === "2")).toBe(false);
  });

  it("FSSC-CHQ-029: loads detail for View", async () => {
    server.use(
      http.get(`${BASE}/master-data/cheque-registers/42`, () =>
        HttpResponse.json(apiEnvelope(chequeRegisterResponse())),
      ),
    );
    const detail = await chequeRegisterService.get("42");
    expect(detail.chequeNumber).toBe("CHQ-042");
  });

  it("FSSC-CHQ-047: deactivates Cheque Register", async () => {
    server.use(
      http.post(`${BASE}/master-data/cheque-registers/42/deactivate`, () =>
        HttpResponse.json(apiEnvelope(chequeRegisterResponse({ active: false }))),
      ),
    );
    const result = await chequeRegisterService.setActive("42", false);
    expect(result.isActive).toBe(false);
  });

  it("FSSC-CHQ-051: activates Cheque Register", async () => {
    server.use(
      http.post(`${BASE}/master-data/cheque-registers/42/activate`, () =>
        HttpResponse.json(apiEnvelope(chequeRegisterResponse({ active: true }))),
      ),
    );
    const result = await chequeRegisterService.setActive("42", true);
    expect(result.isActive).toBe(true);
  });

  it("FSSC-CHQ-052: Open active cheques remain available after create", async () => {
    server.use(
      http.post(`${BASE}/master-data/cheque-registers/bulk`, async () =>
        HttpResponse.json(
          apiEnvelope([chequeRegisterResponse({ status: "OPEN", active: true })]),
        ),
      ),
    );
    const created = await chequeRegisterService.createBatch([openInput]);
    expect(created[0]?.status).toBe("OPEN");
    expect(created[0]?.isActive).toBe(true);
  });
});
