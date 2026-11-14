import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@tests/unit/mocks/server";
import { stageProcessService } from "@/features/master-data/stage-process/data/stage-process.service";

const endpoint = /\/master-data\/stage-processes$/;
const record = { stageCode: "stable-code", name: "Verification", processType: "Verification", roleGroup: "Finance", sequence: 1, slaDays: 1.5, version: 0 };

describe("Stage Process real API service", () => {
  it("maps backend identity and decimal values without fixtures", async () => {
    server.use(http.get(endpoint, () => HttpResponse.json({ data: [record] })));
    const result = await stageProcessService.list();
    expect(result).toEqual([{ id: "stable-code", processName: "Verification", processType: "Verification", roleGroup: "Finance", sequence: 1, slaDays: 1.5, version: 0 }]);
  });

  it("sends one collection request with stable IDs and versions", async () => {
    let requests = 0;
    server.use(http.put(endpoint, async ({ request }) => {
      requests++;
      expect(await request.json()).toEqual({ items: [record] });
      return HttpResponse.json({ data: [{ ...record, version: 1 }] });
    }));
    const result = await stageProcessService.save([{ id: record.stageCode, processName: record.name, roleGroup: record.roleGroup, processType: "Verification", sequence: 1, slaDays: 1.5, version: 0 }]);
    expect(requests).toBe(1);
    expect(result[0].version).toBe(1);
  });

  it("surfaces backend validation and does not fall back to mock data", async () => {
    server.use(http.get(endpoint, () => HttpResponse.json({ message: "Configuration unavailable" }, { status: 503 })));
    await expect(stageProcessService.list()).rejects.toThrow("Configuration unavailable");
  });
});
