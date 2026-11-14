import type { ProfitCenterRecord } from "../data/profit-center.types";
import { profitCenterSchema } from "../data/profit-center.schema";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { NativeSelect, NativeSelectOption } from "@railfinance/core/ui/native-select";
import { Switch } from "@railfinance/core/ui/switch";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ReactNode } from "react";
import type { z } from "zod";
import styles from "./profit-center-form-fields.module.css";

export type ProfitCenterFormData = z.output<typeof profitCenterSchema>;

interface ProfitCenterFormFieldsProps {
  register: UseFormRegister<ProfitCenterFormData>;
  errors: FieldErrors<ProfitCenterFormData>;
  segments: Array<{ segmentId: string; segmentName: string }>;
  responsiblePeople: string[];
  currentRecord?: ProfitCenterRecord;
  selectedStatus: ProfitCenterFormData["status"];
  onStatusChange: (isActive: boolean) => void;
}

function FormRow({
  htmlFor,
  label,
  required = false,
  children,
}: Readonly<{ htmlFor: string; label: string; required?: boolean; children: ReactNode }>) {
  return (
    <div className={styles.row}>
      <Label htmlFor={htmlFor} className={styles.label}>
        {label}{required && <span className="text-destructive"> *</span>}
      </Label>
      <div className={styles.controlCell}>{children}</div>
    </div>
  );
}

export function ProfitCenterFormFields({
  register,
  errors,
  segments,
  responsiblePeople,
  currentRecord,
  selectedStatus,
  onStatusChange,
}: Readonly<ProfitCenterFormFieldsProps>) {
  const selectedSegmentInactive = currentRecord?.segmentId && !segments.some((segment) => segment.segmentId === currentRecord.segmentId);
  const selectedResponsibleMissing = currentRecord?.responsiblePerson && !responsiblePeople.includes(currentRecord.responsiblePerson);

  return (
    <div className={styles.layout}>
      <FormRow htmlFor="profit-center-id" label="Profit Center ID" required>
        <Input id="profit-center-id" className={styles.inputControl} placeholder="Enter Profit Center ID (e.g. PC-1001)" maxLength={32} aria-invalid={Boolean(errors.profitCenterId)} {...register("profitCenterId")} />
        {errors.profitCenterId && <p className="mt-1 text-xs text-destructive" role="alert">{errors.profitCenterId.message}</p>}
      </FormRow>

      <FormRow htmlFor="profit-center-name" label="Profit Center Name" required>
        <Input id="profit-center-name" className={styles.inputControl} placeholder="Enter Profit Center Name" maxLength={120} aria-invalid={Boolean(errors.profitCenterName)} {...register("profitCenterName")} />
        {errors.profitCenterName && <p className="mt-1 text-xs text-destructive" role="alert">{errors.profitCenterName.message}</p>}
      </FormRow>

      <FormRow htmlFor="parent-profit-center" label="Parent Profit Center">
        <Input id="parent-profit-center" className={styles.inputControl} placeholder="Enter Parent Profit Center ID (e.g. PC-0001)" maxLength={32} {...register("parentProfitCenterId")} />
      </FormRow>

      <FormRow htmlFor="profit-center-segment" label="Segment">
        <NativeSelect id="profit-center-segment" {...register("segmentId")}>
          <NativeSelectOption value="">Select Segment</NativeSelectOption>
          {selectedSegmentInactive && <NativeSelectOption value={currentRecord.segmentId}>{currentRecord.segmentName || currentRecord.segmentId} (Inactive)</NativeSelectOption>}
          {segments.map((segment) => <NativeSelectOption key={segment.segmentId} value={segment.segmentId}>{segment.segmentName}</NativeSelectOption>)}
        </NativeSelect>
      </FormRow>

      <FormRow htmlFor="business-unit-id" label="Business Unit ID" required>
        <Input id="business-unit-id" className={styles.inputControl} placeholder="Enter Business Unit ID (e.g. BU-001)" maxLength={32} aria-invalid={Boolean(errors.businessUnitId)} {...register("businessUnitId")} />
        {errors.businessUnitId && <p className="mt-1 text-xs text-destructive" role="alert">{errors.businessUnitId.message}</p>}
      </FormRow>

      <FormRow htmlFor="responsible-person" label="Responsible Person">
        <NativeSelect id="responsible-person" {...register("responsiblePerson")}>
          <NativeSelectOption value="">Select Responsible Person</NativeSelectOption>
          {selectedResponsibleMissing && <NativeSelectOption value={currentRecord.responsiblePerson}>{currentRecord.responsiblePerson}</NativeSelectOption>}
          {responsiblePeople.map((person) => <NativeSelectOption key={person} value={person}>{person}</NativeSelectOption>)}
        </NativeSelect>
        {responsiblePeople.length === 0 && (
          <output className="mt-1 block text-xs text-muted-foreground">
            No Responsible Person options are available from Payable yet. Existing values are retained; new records may leave this field blank.
          </output>
        )}
      </FormRow>

      <FormRow htmlFor="profit-center-status" label="Status" required>
        <div className="flex items-center gap-3">
          <Switch
            id="profit-center-status"
            aria-label="Profit Center status"
            checked={selectedStatus === "ACTIVE"}
            onCheckedChange={onStatusChange}
          />
          <span className="text-sm">{selectedStatus === "ACTIVE" ? "Active" : "Inactive"}</span>
        </div>
      </FormRow>
    </div>
  );
}
