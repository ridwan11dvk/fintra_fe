import type { ApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";
const LIST_URL = `${BASE}/master-data/cashflow-groups`;
const PAYABLE_DELETE_URL = `${BASE}/api/master-data/cashflow-groups`;

export const mockCashflowGroupDto = {
  id: 1,
  code: "OPR-01",
  name: "Operating Receipt",
  categoryCode: "1",
  categoryName: "Operating",
  cashflowType: "RECIPIENT_TARGET",
  exception: "1",
  description: "Operating cash inflow",
  active: true,
  canDelete: true,
};

export const mockCashflowGroupDtoInactive = {
  id: 2,
  code: "INV-01",
  name: "Investing Provider",
  categoryCode: "2",
  categoryName: "Investing",
  cashflowType: "PROVIDER",
  exception: "0",
  description: "Investing cash outflow",
  active: false,
  canDelete: false,
};

const listPayload = {
  status: "SUCCESS" as const,
  message: "Data fetched successfully",
  data: [mockCashflowGroupDto, mockCashflowGroupDtoInactive],
};

const singlePayload = (
  dto: typeof mockCashflowGroupDto,
  message = "Data fetched successfully",
): ApiResponse<typeof dto> => ({
  status: "SUCCESS",
  message,
  data: dto,
});

export const cashflowGroupHandlers = [
  http.get(LIST_URL, () => HttpResponse.json(listPayload)),
  http.get("*/master-data/cashflow-groups", () => HttpResponse.json(listPayload)),

  http.get(`${LIST_URL}/:id`, ({ params }) => {
    const id = Number(params.id);
    const dto =
      id === mockCashflowGroupDtoInactive.id
        ? mockCashflowGroupDtoInactive
        : mockCashflowGroupDto;
    return HttpResponse.json(singlePayload(dto));
  }),
  http.get("*/master-data/cashflow-groups/:id", ({ params }) => {
    const id = Number(params.id);
    const dto =
      id === mockCashflowGroupDtoInactive.id
        ? mockCashflowGroupDtoInactive
        : mockCashflowGroupDto;
    return HttpResponse.json(singlePayload(dto));
  }),

  http.post(`${LIST_URL}`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      singlePayload(
        {
          id: 3,
          code: String(body.code ?? "NEW"),
          name: String(body.name ?? ""),
          categoryCode: String(body.categoryCode ?? ""),
          categoryName: "Operating",
          cashflowType: String(body.cashflowType ?? "RECIPIENT_TARGET"),
          exception: String(body.exception ?? ""),
          description: String(body.description ?? ""),
          active: true,
          canDelete: true,
        },
        "Cashflow group created",
      ),
      { status: 201 },
    );
  }),
  http.post("*/master-data/cashflow-groups", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      singlePayload(
        {
          id: 3,
          code: String(body.code ?? "NEW"),
          name: String(body.name ?? ""),
          categoryCode: String(body.categoryCode ?? ""),
          categoryName: "Operating",
          cashflowType: String(body.cashflowType ?? "RECIPIENT_TARGET"),
          exception: String(body.exception ?? ""),
          description: String(body.description ?? ""),
          active: true,
          canDelete: true,
        },
        "Cashflow group created",
      ),
      { status: 201 },
    );
  }),

  http.put(`${LIST_URL}/:id`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      singlePayload(
        {
          ...mockCashflowGroupDto,
          code: String(body.code ?? mockCashflowGroupDto.code),
          name: String(body.name ?? mockCashflowGroupDto.name),
          description: String(body.description ?? mockCashflowGroupDto.description),
        },
        "Cashflow group updated",
      ),
    );
  }),
  http.put("*/master-data/cashflow-groups/:id", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      singlePayload(
        {
          ...mockCashflowGroupDto,
          code: String(body.code ?? mockCashflowGroupDto.code),
          name: String(body.name ?? mockCashflowGroupDto.name),
          description: String(body.description ?? mockCashflowGroupDto.description),
        },
        "Cashflow group updated",
      ),
    );
  }),

  http.post(`${LIST_URL}/:id/activate`, () =>
    HttpResponse.json(
      singlePayload(
        { ...mockCashflowGroupDtoInactive, active: true },
        "Cashflow group activated",
      ),
    ),
  ),
  http.post("*/master-data/cashflow-groups/:id/activate", () =>
    HttpResponse.json(
      singlePayload(
        { ...mockCashflowGroupDtoInactive, active: true },
        "Cashflow group activated",
      ),
    ),
  ),

  http.post(`${LIST_URL}/:id/deactivate`, () =>
    HttpResponse.json(
      singlePayload(
        { ...mockCashflowGroupDto, active: false },
        "Cashflow group deactivated",
      ),
    ),
  ),
  http.post("*/master-data/cashflow-groups/:id/deactivate", () =>
    HttpResponse.json(
      singlePayload(
        { ...mockCashflowGroupDto, active: false },
        "Cashflow group deactivated",
      ),
    ),
  ),

  http.delete(`${PAYABLE_DELETE_URL}/:id`, () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Cashflow group deleted",
      data: null,
    }),
  ),
  http.delete("*/api/master-data/cashflow-groups/:id", () =>
    HttpResponse.json({
      status: "SUCCESS",
      message: "Cashflow group deleted",
      data: null,
    }),
  ),
];
