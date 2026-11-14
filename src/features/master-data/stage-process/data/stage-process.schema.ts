import { z } from "zod";
import { stageProcessTypes } from "./stage-process.types";

export const stageProcessSchema = z.object({
  id: z.string().min(1),
  sequence: z.number().int().min(1),
  roleGroup: z.string().min(1),
  processName: z.string().trim().min(1, "Process Name is required").max(250),
  processType: z.enum(stageProcessTypes, { message: "Process Type is required" }),
  slaDays: z.number({ message: "SLA harus berupa angka" }).min(1, "SLA minimal 1 hari"),
  version: z.number().int().min(0),
});

function validateCatalog(
  items: { id: string; roleGroup: string; processName: string; sequence: number }[],
  context: z.RefinementCtx,
) {
  const names = new Set<string>();
  const ids = new Set<string>();
  const sequences = new Set<number>();
  items.forEach((item, index) => {
    const key = JSON.stringify([item.roleGroup.trim().toLowerCase(), item.processName.trim().toLowerCase()]);
    if (names.has(key)) context.addIssue({ code: "custom", path: [index, "processName"], message: "Process Name must be unique within its category" });
    if (ids.has(item.id)) context.addIssue({ code: "custom", path: [index, "id"], message: "Duplicate stage identity" });
    if (sequences.has(item.sequence)) context.addIssue({ code: "custom", path: [index, "sequence"], message: "Duplicate stage order" });
    names.add(key);
    ids.add(item.id);
    sequences.add(item.sequence);
  });
}

export const stageProcessListSchema = z.array(stageProcessSchema).superRefine(validateCatalog);

const slaInputSchema = z.string().trim().min(1, "SLA wajib diisi")
  .transform((value) => Number(value.replace(",", ".")))
  .pipe(stageProcessSchema.shape.slaDays);

export const stageProcessFormSchema = z.object({
  items: z.array(stageProcessSchema.extend({ slaDays: slaInputSchema })).superRefine(validateCatalog),
});
export type StageProcessFormValues = z.input<typeof stageProcessFormSchema>;
export type StageProcessFormOutput = z.output<typeof stageProcessFormSchema>;
