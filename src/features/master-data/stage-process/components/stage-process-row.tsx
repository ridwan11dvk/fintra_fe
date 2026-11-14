import type { UseFormRegister } from "react-hook-form";
import { GripVertical } from "lucide-react";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { NativeSelect, NativeSelectOption } from "@railfinance/core/ui/native-select";
import { stageProcessTypes } from "../data/stage-process.types";
import type { StageProcessFormValues } from "../data/stage-process.schema";

interface StageProcessRowProps {
  id: string;
  index: number;
  disabled: boolean;
  register: UseFormRegister<StageProcessFormValues>;
  onMove: (index: number, direction: -1 | 1) => void;
  nameError?: string;
  typeError?: string;
  slaError?: string;
}

export function StageProcessRow({ id, index, disabled, register, onMove, nameError, typeError, slaError }: Readonly<StageProcessRowProps>) {
  return <div data-testid={`stage-row-${id}`} className="grid min-h-24 grid-cols-[2rem_minmax(0,1fr)] items-center gap-x-3 gap-y-4 rounded-2xl border border-border bg-background p-4 md:grid-cols-[2rem_repeat(3,minmax(0,1fr))]">
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        aria-label={`Reorder ${id}`}
        disabled={disabled}
        className="flex size-6 items-center justify-center rounded text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-50"
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") {
            event.preventDefault();
            onMove(index, -1);
          } else if (event.key === "ArrowDown") {
            event.preventDefault();
            onMove(index, 1);
          }
        }}
      >
        <GripVertical className="size-4" aria-hidden="true" />
      </button>
      <span className="flex size-[30px] items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{index + 1}</span>
    </div>
    <div className="col-span-2 col-start-1 grid min-w-0 grid-cols-3 gap-4 md:col-span-3 md:col-start-2">
      <div className="min-w-0">
        <Label className="mb-1.5 block text-sm font-normal" htmlFor={`${id}-name`}>Process Name <span aria-hidden="true" className="text-destructive">*</span></Label>
        <Input id={`${id}-name`} className="h-10 rounded-lg shadow-sm" disabled={disabled} aria-invalid={Boolean(nameError)} aria-describedby={nameError ? `${id}-name-error` : undefined} {...register(`items.${index}.processName`)} />
        {nameError && <p id={`${id}-name-error`} className="mt-1 text-xs text-destructive">{nameError}</p>}
      </div>
      <div className="min-w-0">
        <Label className="mb-1.5 block text-sm font-normal" htmlFor={`${id}-type`}>Process Type <span aria-hidden="true" className="text-destructive">*</span></Label>
        <NativeSelect id={`${id}-type`} className="w-full [&>select]:h-10 [&>select]:rounded-lg [&>select]:shadow-sm" disabled aria-invalid={Boolean(typeError)} {...register(`items.${index}.processType`)}>
          {stageProcessTypes.map((type) => <NativeSelectOption key={type} value={type}>{type}</NativeSelectOption>)}
        </NativeSelect>
        {typeError && <p className="mt-1 text-xs text-destructive">{typeError}</p>}
      </div>
      <div className="min-w-0">
        <Label className="mb-1.5 block text-sm font-normal" htmlFor={`${id}-sla`}>SLA (Days) <span aria-hidden="true" className="text-destructive">*</span></Label>
        <Input id={`${id}-sla`} type="text" inputMode="decimal" className="h-10 rounded-lg shadow-sm" disabled={disabled} aria-invalid={Boolean(slaError)} aria-describedby={slaError ? `${id}-sla-error` : undefined} {...register(`items.${index}.slaDays`)} />
        {slaError && <p id={`${id}-sla-error`} className="mt-1 text-xs text-destructive">{slaError}</p>}
      </div>
    </div>
  </div>;
}
