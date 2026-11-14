import { contentService, getContentErrorMessage } from "@/features/master-data/content/data/content.service";
import { http, HttpResponse } from "msw";
import { server } from "@tests/unit/mocks/server";
import { describe, expect, it } from "vitest";

const BASE = "http://localhost:3000";
const ENDPOINT = `${BASE}/master-data/contents`;
const apiRecord = {
  id: 7,
  sectionName: "FAQ",
  body: "Payment questions",
  active: true,
};

describe("contentService", () => {
  it("maps and paginates list records while trimming search", async () => {
    let requestedSearch: string | null = null;
    server.use(
      http.get(ENDPOINT, ({ request }) => {
        requestedSearch = new URL(request.url).searchParams.get("search");
        return HttpResponse.json({ data: [apiRecord, { ...apiRecord, id: 8, active: false }], message: "ok", status: "SUCCESS" });
      }),
    );

    const result = await contentService.list({ page: 2, pageSize: 1, search: " FAQ " });

    expect(requestedSearch).toBe("FAQ");
    expect(result).toEqual({
      items: [{ id: "8", sectionName: "FAQ", content: "Payment questions", status: "INACTIVE" }],
      page: 2,
      pageSize: 1,
      totalItems: 2,
      totalPages: 2,
    });
  });

  it("maps detail records and rejects non-numeric IDs before making a request", async () => {
    server.use(
      http.get(`${ENDPOINT}/7`, () => HttpResponse.json({ data: apiRecord, message: "ok", status: "SUCCESS" })),
    );

    await expect(contentService.get("7")).resolves.toEqual({
      id: "7",
      sectionName: "FAQ",
      content: "Payment questions",
      status: "ACTIVE",
    });
    await expect(contentService.get("CONTENT-7")).rejects.toThrow("Invalid Content ID");
  });

  it("maps create/update inputs to the backend body contract", async () => {
    let createBody: unknown;
    let updateBody: unknown;
    server.use(
      http.post(ENDPOINT, async ({ request }) => {
        createBody = await request.json();
        return HttpResponse.json({ data: apiRecord, message: "created", status: "SUCCESS" });
      }),
      http.put(`${ENDPOINT}/7`, async ({ request }) => {
        updateBody = await request.json();
        return HttpResponse.json({ data: { ...apiRecord, body: "Updated" }, message: "updated", status: "SUCCESS" });
      }),
    );
    const input = { sectionName: "FAQ" as const, content: "Payment questions", status: "ACTIVE" as const };

    await contentService.create(input);
    await contentService.update("7", { ...input, content: "Updated" });

    expect(createBody).toEqual({ sectionName: "FAQ", body: "Payment questions", active: true });
    expect(updateBody).toEqual({ sectionName: "FAQ", body: "Updated", active: true });
  });

  it("calls the appropriate status endpoint and maps the response", async () => {
    const paths: string[] = [];
    server.use(
      http.post(`${ENDPOINT}/7/:action`, ({ request }) => {
        paths.push(new URL(request.url).pathname);
        return HttpResponse.json({ data: { ...apiRecord, active: false }, message: "ok", status: "SUCCESS" });
      }),
    );

    const result = await contentService.setStatus("7", "INACTIVE");

    expect(paths).toEqual(["/master-data/contents/7/deactivate"]);
    expect(result.status).toBe("INACTIVE");
  });
});

describe("getContentErrorMessage", () => {
  it("prefers an API response message and falls back for unknown errors", () => {
    expect(getContentErrorMessage({ response: { data: { message: "Duplicate Content" } } })).toBe("Duplicate Content");
    expect(getContentErrorMessage({ response: { data: { detail: "An active Content already exists." } } }))
      .toBe("An active Content already exists.");
    expect(getContentErrorMessage("unexpected", "Save failed")).toBe("Save failed");
  });
});
