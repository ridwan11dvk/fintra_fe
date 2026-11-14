import {
  contentService,
  getContentErrorMessage,
} from "@/features/master-data/content/data/content.service";
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

describe("contentService FSSC-CNT", () => {
  it("FSSC-CNT-002: lists Content records", async () => {
    server.use(
      http.get(ENDPOINT, () =>
        HttpResponse.json({
          data: [apiRecord],
          message: "ok",
          status: "SUCCESS",
        }),
      ),
    );
    const result = await contentService.list({ page: 1, pageSize: 10 });
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.sectionName).toBe("FAQ");
  });

  it("FSSC-CNT-003: searches Content by trimmed keyword", async () => {
    let search: string | null = null;
    server.use(
      http.get(ENDPOINT, ({ request }) => {
        search = new URL(request.url).searchParams.get("search");
        return HttpResponse.json({
          data: [apiRecord],
          message: "ok",
          status: "SUCCESS",
        });
      }),
    );
    await contentService.list({ page: 1, pageSize: 10, search: " FAQ " });
    expect(search).toBe("FAQ");
  });

  it("FSSC-CNT-004: returns empty list when search finds nothing", async () => {
    server.use(
      http.get(ENDPOINT, () =>
        HttpResponse.json({ data: [], message: "ok", status: "SUCCESS" }),
      ),
    );
    const result = await contentService.list({
      page: 1,
      pageSize: 10,
      search: "none",
    });
    expect(result.items).toEqual([]);
    expect(result.totalItems).toBe(0);
  });

  it("FSSC-CNT-007: exposes total items for pagination", async () => {
    server.use(
      http.get(ENDPOINT, () =>
        HttpResponse.json({
          data: [apiRecord, { ...apiRecord, id: 8 }],
          message: "ok",
          status: "SUCCESS",
        }),
      ),
    );
    const result = await contentService.list({ page: 1, pageSize: 10 });
    expect(result.totalItems).toBe(2);
  });

  it("FSSC-CNT-015: surfaces duplicate active Section Name API errors", () => {
    expect(
      getContentErrorMessage({
        response: { data: { detail: "An active Content already exists." } },
      }),
    ).toBe("An active Content already exists.");
  });

  it("FSSC-CNT-017: loads Content detail for View", async () => {
    server.use(
      http.get(`${ENDPOINT}/7`, () =>
        HttpResponse.json({ data: apiRecord, message: "ok", status: "SUCCESS" }),
      ),
    );
    const detail = await contentService.get("7");
    expect(detail.sectionName).toBe("FAQ");
    expect(detail.content).toBe("Payment questions");
  });

  it("FSSC-CNT-018: View exposes Section Name and Content fields", async () => {
    server.use(
      http.get(`${ENDPOINT}/7`, () =>
        HttpResponse.json({ data: apiRecord, message: "ok", status: "SUCCESS" }),
      ),
    );
    const detail = await contentService.get("7");
    expect(detail).toMatchObject({
      sectionName: "FAQ",
      content: "Payment questions",
    });
  });

  it("FSSC-CNT-022: updates Content body successfully", async () => {
    server.use(
      http.put(`${ENDPOINT}/7`, async () =>
        HttpResponse.json({
          data: { ...apiRecord, body: "Updated FAQ" },
          message: "updated",
          status: "SUCCESS",
        }),
      ),
    );
    const result = await contentService.update("7", {
      sectionName: "FAQ",
      content: "Updated FAQ",
      status: "ACTIVE",
    });
    expect(result.content).toBe("Updated FAQ");
  });

  it("FSSC-CNT-033: deactivates Content", async () => {
    server.use(
      http.post(`${ENDPOINT}/7/deactivate`, () =>
        HttpResponse.json({
          data: { ...apiRecord, active: false },
          message: "ok",
          status: "SUCCESS",
        }),
      ),
    );
    const result = await contentService.setStatus("7", "INACTIVE");
    expect(result.status).toBe("INACTIVE");
  });

  it("FSSC-CNT-037: activates Content", async () => {
    server.use(
      http.post(`${ENDPOINT}/7/activate`, () =>
        HttpResponse.json({
          data: { ...apiRecord, active: true },
          message: "ok",
          status: "SUCCESS",
        }),
      ),
    );
    const result = await contentService.setStatus("7", "ACTIVE");
    expect(result.status).toBe("ACTIVE");
  });

  it("FSSC-CNT-040: inactive Content is mapped as INACTIVE status", async () => {
    server.use(
      http.get(ENDPOINT, () =>
        HttpResponse.json({
          data: [{ ...apiRecord, active: false }],
          message: "ok",
          status: "SUCCESS",
        }),
      ),
    );
    const result = await contentService.list({ page: 1, pageSize: 10 });
    expect(result.items[0]?.status).toBe("INACTIVE");
  });
});
