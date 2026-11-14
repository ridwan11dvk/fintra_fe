import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@railfinance/core/ui/button";
import { toast } from "@railfinance/core/lib";
import { UnsavedChangesModal } from "../../shared/unsaved-changes-modal";
import { stageProcessFormSchema, type StageProcessFormOutput, type StageProcessFormValues } from "../data/stage-process.schema";
import type { StageProcessRecord } from "../data/stage-process.types";
import { useSaveStageProcesses } from "../data/stage-process.query";
import { stageRoleGroups } from "../data/stage-process.types";
import { StageProcessRow } from "./stage-process-row";

const processOrder: readonly string[] = ["Partner Submission","Update/Revise Invoice Submission","Business Unit Submission","Accountability Report","Business Unit Verification","Substantive Approval","Budget Availability Request","Budget Availability Approval","Payment Readiness Check","Dispute & Resolution","Reconciliation","Financial Control","Financial Authority","Set Source of Fund","Payment Preparation","Cashout Verification","Cashout Authorization","Payment Execution"];

function formValues(records: StageProcessRecord[]): StageProcessFormValues {
  return { items: [...records].sort((a, b) => {
    const groupDifference = stageRoleGroups.indexOf(a.roleGroup as (typeof stageRoleGroups)[number]) - stageRoleGroups.indexOf(b.roleGroup as (typeof stageRoleGroups)[number]);
    return groupDifference || processOrder.indexOf(a.processName) - processOrder.indexOf(b.processName);
  }).map((record) => ({ ...record, slaDays: String(record.slaDays) })) };
}

export function StageProcessForm({ records }: Readonly<{ records: StageProcessRecord[] }>) {
  const [showUnsaved, setShowUnsaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const mutation = useSaveStageProcesses();
  const form = useForm<StageProcessFormValues, unknown, StageProcessFormOutput>({
    defaultValues: formValues(records), resolver: zodResolver(stageProcessFormSchema), mode: "onChange",
  });
  const array = useFieldArray({ control: form.control, name: "items", keyName: "fieldKey" });
  const { isDirty, isValid, errors } = form.formState;

  const moveStage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= array.fields.length) return;
    if (array.fields[index].roleGroup !== array.fields[target].roleGroup) return;
    const next = [...array.fields];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    array.replace(
      next.map((item, itemIndex) => ({
        id: item.id,
        sequence: itemIndex + 1,
        roleGroup: item.roleGroup,
        processName: item.processName,
        processType: item.processType,
        slaDays: item.slaDays,
        version: item.version,
      })),
    );
  };
  const groups = new Map<string, { row: (typeof array.fields)[number]; index: number }[]>();
  array.fields.forEach((row, index) => {
    const group = groups.get(row.roleGroup) ?? [];
    group.push({ row, index });
    groups.set(row.roleGroup, group);
  });

  const save = form.handleSubmit(async ({ items }) => {
    setSaveError(null);
    try {
      const saved = await mutation.mutateAsync(items);
      form.reset(formValues(saved));
      setShowUnsaved(false);
      toast.success("Process & Reference updated successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save Process & Reference";
      setSaveError(message);
      toast.error(message);
    }
  });

  const cancel = () => {
    form.reset(formValues(records));
    setSaveError(null);
    setShowUnsaved(false);
  };

  return <form data-testid="stage-process-form" onSubmit={(event) => { void save(event); }}>
    <section className="mt-5 pb-24" aria-labelledby="process-reference-title">
      <h2 id="process-reference-title" className="text-lg font-semibold leading-6">SLA Setup</h2>
      {saveError && <p role="alert" className="mt-4 text-sm text-destructive">{saveError}</p>}
      <div className="mt-5 space-y-5">
        {[...groups].map(([roleGroup, rows], groupIndex) => <section key={roleGroup} className={groupIndex > 0 ? "border-t border-border pt-5" : ""} aria-labelledby={`stage-group-${groupIndex}`}>
          <h3 id={`stage-group-${groupIndex}`} className="text-sm font-semibold text-orange-600">{roleGroup}</h3>
          <div className="mt-4 space-y-4">{rows.map(({ row, index }) => <StageProcessRow key={row.fieldKey} id={row.id} index={index} disabled={mutation.isPending} register={form.register} onMove={moveStage} nameError={errors.items?.[index]?.processName?.message} typeError={errors.items?.[index]?.processType?.message} slaError={errors.items?.[index]?.slaDays?.message} />)}</div>
        </section>)}
      </div>
    </section>
    <div className="fixed bottom-0 left-[var(--sidebar-width)] right-0 z-50 flex justify-end gap-3 border-t border-border bg-background px-6 py-4">
      <Button type="button" variant="outline" onClick={() => setShowUnsaved(true)} disabled={!isDirty || mutation.isPending}>Cancel</Button>
      <Button type="submit" disabled={!isDirty || !isValid || mutation.isPending}>{mutation.isPending ? "Saving…" : "Save"}</Button>
    </div>
    <UnsavedChangesModal open={showUnsaved} onOpenChange={setShowUnsaved} onDiscard={cancel} compact onSave={() => { void save(); }} saveDisabled={!isValid || mutation.isPending} />
  </form>;
}
