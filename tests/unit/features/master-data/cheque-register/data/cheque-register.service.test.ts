import { chequeRegisterService } from "@/features/master-data/cheque-register/data/cheque-register.service";
import type { ChequeRegisterInput } from "@/features/master-data/cheque-register/data/cheque-register.types";
import { server } from "@tests/unit/mocks/server";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

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

function houseBankHandler() {
  return http.get(`${BASE}/master/house-bank`, () =>
    HttpResponse.json(houseBankListResponse()),
  );
}

describe("chequeRegisterService", () => {
  it("maps a paginated API response and forwards the page and search", async () => {
    let requestedUrl = "";
    server.use(
      http.get(`${BASE}/master-data/cheque-registers`, ({ request }) => {
        requestedUrl = request.url;
        return HttpResponse.json(apiEnvelope(chequeRegisterPage([
            chequeRegisterResponse(),
            chequeRegisterResponse({
              id: 43,
              chequeNumber: "CHQ-043",
              houseBankId: 2,
              houseBankName: "Inactive Account",
              status: "BOOKED",
            }),
          ])));
      }),
      houseBankHandler(),
    );

    const result = await chequeRegisterService.list({
      page: 1,
      pageSize: 10,
      search: "Operating",
    });

    expect(new URL(requestedUrl).searchParams.get("page")).toBe("1");
    expect(new URL(requestedUrl).searchParams.get("size")).toBe("10");
    expect(new URL(requestedUrl).searchParams.get("search")).toBe("Operating");
    expect(result.items).toHaveLength(2);
    expect(result.items[0]?.houseBankId).toBe("1");
    expect(result.page).toBe(1);
    expect(result.totalItems).toBe(2);
  });

  it("uses the backend House Bank id in the single-create payload", async () => {
    let createBody: unknown;
    server.use(
      houseBankHandler(),
      http.post(`${BASE}/master-data/cheque-registers`, async ({ request }) => {
        createBody = await request.json();
        return HttpResponse.json(apiEnvelope(chequeRegisterResponse()));
      }),
    );

    const input: ChequeRegisterInput = {
      houseBankId: "1",
      chequeNumber: "CHQ-042",
      status: "OPEN",
      releaseDate: "",
      isActive: true,
    };
    const result = await chequeRegisterService.create(input);

    expect(createBody).toEqual({
      chequeNumber: "CHQ-042",
      houseBankId: 1,
      status: "OPEN",
      releaseDate: null,
      active: true,
    });
    expect(result.houseBankName).toBe("00012345 - Bank Central Asia");
  });

  it("submits multi-row create through the atomic bulk endpoint", async () => {
    let createBody: unknown;
    server.use(
      houseBankHandler(),
      http.post(`${BASE}/master-data/cheque-registers/bulk`, async ({ request }) => {
        createBody = await request.json();
        return HttpResponse.json(apiEnvelope([
          chequeRegisterResponse(),
          chequeRegisterResponse({ id: 43, chequeNumber: "CHQ-043" }),
        ]));
      }),
    );

    const result = await chequeRegisterService.createBatch([
        {
          houseBankId: "1",
          chequeNumber: "CHQ-043",
          status: "OPEN",
          releaseDate: "",
          isActive: true,
        },
        {
          houseBankId: "1",
          chequeNumber: "CHQ-044",
          status: "OPEN",
          releaseDate: "",
          isActive: true,
        },
      ]);
    expect(createBody).toEqual([
      { chequeNumber: "CHQ-043", houseBankId: 1, status: "OPEN", releaseDate: null, active: true },
      { chequeNumber: "CHQ-044", houseBankId: 1, status: "OPEN", releaseDate: null, active: true },
    ]);
    expect(result).toHaveLength(2);
  });

  it("sends manual Release Date through the update contract", async () => {
    let updateBody: unknown;
    server.use(
      houseBankHandler(),
      http.put(`${BASE}/master-data/cheque-registers/:id`, async ({ request }) => {
        updateBody = await request.json();
        return HttpResponse.json(
          apiEnvelope(
            chequeRegisterResponse({
              status: "RELEASE",
              releaseDate: "2026-10-19",
            }),
          ),
        );
      }),
    );

    const input: ChequeRegisterInput = {
      houseBankId: "1",
      chequeNumber: "CHQ-042",
      status: "RELEASE",
      releaseDate: "2026-10-19",
      isActive: true,
    };
    const result = await chequeRegisterService.update("42", input);

    expect(updateBody).toEqual({
      chequeNumber: "CHQ-042",
      houseBankId: 1,
      status: "RELEASE",
      releaseDate: "2026-10-19",
      active: true,
    });
    expect(result.releaseDate).toBe("2026-10-19");
  });

  it("offers only active House Banks and uses the numeric backend ID as the form value", async () => {
    server.use(houseBankHandler());

    const options = await chequeRegisterService.getHouseBanks();

    expect(options).toEqual([
      { id: "1", name: "00012345 - Bank Central Asia", status: "ACTIVE" },
    ]);
  });
});
