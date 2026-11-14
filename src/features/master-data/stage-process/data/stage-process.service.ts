import { apiClient } from "@railfinance/core/lib";
import { isAxiosError } from "axios";
import { z } from "zod";
import { stageProcessListSchema, stageProcessSchema } from "./stage-process.schema";
import type { StageProcessRecord } from "./stage-process.types";

const endpoint = "/master-data/stage-processes";
const apiStageSchema = stageProcessSchema.omit({ id: true, processName: true }).extend({
  stageCode: z.string().min(1), name: z.string().min(1),
});
const responseSchema = z.object({ data: z.array(apiStageSchema) });
const errorSchema = z.object({
  message: z.string().optional(),
  errors: z.array(z.object({ field: z.string().optional(), message: z.string() })).optional(),
});

function readRecords(body: unknown): StageProcessRecord[] {
  return responseSchema.parse(body).data.map(({ stageCode, name, ...record }) => ({
    ...record, id: stageCode, processName: name,
  }));
}

function apiError(error: unknown): Error {
  if (isAxiosError(error)) {
    const parsed = errorSchema.safeParse(error.response?.data);
    if (parsed.success) {
      return new Error(parsed.data.errors?.map((item) => item.message).join("; ")
        || parsed.data.message || "Unable to save Process & Reference");
    }
  }
  return error instanceof Error ? error : new Error("Unable to load Process & Reference");
}

export const stageProcessService = {
  async list(): Promise<StageProcessRecord[]> {
    try {
      const response = await apiClient.get<unknown>(endpoint);
      return readRecords(response.data);
    } catch (error) { throw apiError(error); }
  },
  async save(items: StageProcessRecord[]): Promise<StageProcessRecord[]> {
    const validated = stageProcessListSchema.parse(items);
    const payload = validated.map(({ id, processName, ...record }) => ({
      ...record, stageCode: id, name: processName,
    }));
    try {
      const response = await apiClient.put<unknown>(endpoint, { items: payload });
      return readRecords(response.data);
    } catch (error) { throw apiError(error); }
  },
};
