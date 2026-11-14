import type { ApiResponse } from "@railfinance/core";
import { http, HttpResponse } from "msw";

const BASE = "http://localhost:3000";
const LIST_URL = `${BASE}/master-data/cashflow-categories`;

export const mockCashflowCategoryDto = {
  id: 1,
  code: "OPEX",
  label: "Operating Expense",
  description: "OPEX cashflow category",
  active: true,
};

export const mockCashflowCategoryDtoInactive = {
  id: 2,
  code: "CAPEX",
  label: "Capital Expense",
  description: "CAPEX cashflow category",
  active: false,
};

const listPayload = {
  status: "SUCCESS" as const,
  message: "Data fetched successfully",
  data: [mockCashflowCategoryDto, mockCashflowCategoryDtoInactive],
};

const singlePayload = (
  dto: typeof mockCashflowCategoryDto,
  message = "Data fetched successfully",
): ApiResponse<typeof dto> => ({
  status: "SUCCESS",
  message,
  data: dto,
});

export const cashflowCategoryHandlers = [
  http.get(LIST_URL, () => HttpResponse.json(listPayload)),
  http.get("*/master-data/cashflow-categories", () => HttpResponse.json(listPayload)),

  http.get(`${LIST_URL}/:id`, ({ params }) => {
    const id = Number(params.id);
    const dto =
      id === mockCashflowCategoryDtoInactive.id
        ? mockCashflowCategoryDtoInactive
        : mockCashflowCategoryDto;
    return HttpResponse.json(singlePayload(dto));
  }),
  http.get("*/master-data/cashflow-categories/:id", ({ params }) => {
    const id = Number(params.id);
    const dto =
      id === mockCashflowCategoryDtoInactive.id
        ? mockCashflowCategoryDtoInactive
        : mockCashflowCategoryDto;
    return HttpResponse.json(singlePayload(dto));
  }),

  http.post(LIST_URL, async ({ request }) => {
    const body = (await request.json()) as { label?: string; description?: string };
    return HttpResponse.json(
      singlePayload(
        {
          id: 3,
          code: "NEW",
          label: body.label ?? "",
          description: body.description ?? "",
          active: true,
        },
        "Cashflow category created",
      ),
      { status: 201 },
    );
  }),
  http.post("*/master-data/cashflow-categories", async ({ request }) => {
    const body = (await request.json()) as { label?: string; description?: string };
    return HttpResponse.json(
      singlePayload(
        {
          id: 3,
          code: "NEW",
          label: body.label ?? "",
          description: body.description ?? "",
          active: true,
        },
        "Cashflow category created",
      ),
      { status: 201 },
    );
  }),

  http.put(`${LIST_URL}/:id`, async ({ request }) => {
    const body = (await request.json()) as { label?: string; description?: string };
    return HttpResponse.json(
      singlePayload(
        {
          ...mockCashflowCategoryDto,
          label: body.label ?? mockCashflowCategoryDto.label,
          description: body.description ?? mockCashflowCategoryDto.description,
        },
        "Cashflow category updated",
      ),
    );
  }),
  http.put("*/master-data/cashflow-categories/:id", async ({ request }) => {
    const body = (await request.json()) as { label?: string; description?: string };
    return HttpResponse.json(
      singlePayload(
        {
          ...mockCashflowCategoryDto,
          label: body.label ?? mockCashflowCategoryDto.label,
          description: body.description ?? mockCashflowCategoryDto.description,
        },
        "Cashflow category updated",
      ),
    );
  }),

  http.patch(`${LIST_URL}/:id/activate`, () =>
    HttpResponse.json(
      singlePayload(
        { ...mockCashflowCategoryDtoInactive, active: true },
        "Cashflow category activated",
      ),
    ),
  ),
  http.patch("*/master-data/cashflow-categories/:id/activate", () =>
    HttpResponse.json(
      singlePayload(
        { ...mockCashflowCategoryDtoInactive, active: true },
        "Cashflow category activated",
      ),
    ),
  ),

  http.patch(`${LIST_URL}/:id/deactivate`, () =>
    HttpResponse.json(
      singlePayload(
        { ...mockCashflowCategoryDto, active: false },
        "Cashflow category deactivated",
      ),
    ),
  ),
  http.patch("*/master-data/cashflow-categories/:id/deactivate", () =>
    HttpResponse.json(
      singlePayload(
        { ...mockCashflowCategoryDto, active: false },
        "Cashflow category deactivated",
      ),
    ),
  ),
];
