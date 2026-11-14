import type { SegmentRecord } from "../data/segment.types";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { NativeSelect, NativeSelectOption } from "@railfinance/core/ui/native-select";
import { Switch } from "@railfinance/core/ui/switch";
import { Textarea } from "@railfinance/core/ui/textarea";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ReactNode } from "react";
import type { SegmentFormData } from "../data/segment.schema";
import styles from "./segment-form-fields.module.css";

interface SegmentFormFieldsProps {
  register: UseFormRegister<SegmentFormData>;
  errors: FieldErrors<SegmentFormData>;
  parentOptions: Array<{ segmentId: string; segmentName: string }>;
  parentOptionsDisabled: boolean;
  currentRecord?: SegmentRecord;
  selectedStatus: SegmentFormData["status"];
  onStatusChange: (isActive: boolean) => void;
}

function FormRow({
  htmlFor,
  label,
  required = false,
  multiline = false,
  children,
}: Readonly<{ htmlFor: string; label: string; required?: boolean; multiline?: boolean; children: ReactNode }>) {
  return (
    <div className={`${styles.row} ${multiline ? styles.multilineRow : ""}`}>
      <Label htmlFor={htmlFor} className={`${styles.label} ${multiline ? styles.topLabel : ""}`}>
        {label}{required && <span className="text-destructive"> *</span>}
      </Label>
      <div className={styles.controlCell}>{children}</div>
    </div>
  );
}

export function SegmentFormFields({
  register,
  errors,
  parentOptions,
  parentOptionsDisabled,
  currentRecord,
  selectedStatus,
  onStatusChange,
}: Readonly<SegmentFormFieldsProps>) {
  const selectedParentInactive = currentRecord?.parentSegmentId
    && !parentOptions.some((parent) => parent.segmentId === currentRecord.parentSegmentId);

  return (
    <div className={styles.layout}>
      <FormRow htmlFor="segment-id" label="Segment ID" required>
        <Input
          id="segment-id"
          className={styles.inputControl}
          placeholder="Enter Segment ID (e.g. SEG-001)"
          maxLength={32}
          aria-invalid={Boolean(errors.segmentId)}
          {...register("segmentId")}
        />
        {errors.segmentId && <p className="mt-1 text-xs text-destructive" role="alert">{errors.segmentId.message}</p>}
      </FormRow>

      <FormRow htmlFor="segment-name" label="Segment Name" required>
        <Input
          id="segment-name"
          className={styles.inputControl}
          placeholder="Enter Segment Name"
          maxLength={120}
          aria-invalid={Boolean(errors.segmentName)}
          {...register("segmentName")}
        />
        {errors.segmentName && <p className="mt-1 text-xs text-destructive" role="alert">{errors.segmentName.message}</p>}
      </FormRow>

      <FormRow htmlFor="parent-segment" label="Parent Segment">
        <NativeSelect
          id="parent-segment"
          className={styles.selectControl}
          {...register("parentSegmentId", { setValueAs: (value: string) => value || null })}
          disabled={parentOptionsDisabled}
        >
          <NativeSelectOption value="">Select Parent Segment</NativeSelectOption>
          {selectedParentInactive && currentRecord?.parentSegmentId && (
            <NativeSelectOption value={currentRecord.parentSegmentId}>
              {currentRecord.parentSegmentName ?? currentRecord.parentSegmentId} (Inactive)
            </NativeSelectOption>
          )}
          {parentOptions.map((parent) => (
            <NativeSelectOption key={parent.segmentId} value={parent.segmentId}>{parent.segmentName}</NativeSelectOption>
          ))}
        </NativeSelect>
      </FormRow>

      <FormRow htmlFor="segment-description" label="Description" multiline>
        <Textarea
          id="segment-description"
          className={styles.textareaControl}
          placeholder="Enter Description"
          maxLength={500}
          {...register("description")}
        />
      </FormRow>

      <FormRow htmlFor="segment-status" label="Status" required>
        <div className="flex items-center gap-3">
          <Switch
            id="segment-status"
            aria-label="Segment status"
            checked={selectedStatus === "ACTIVE"}
            onCheckedChange={onStatusChange}
          />
          <span className="text-sm">{selectedStatus === "ACTIVE" ? "Active" : "Inactive"}</span>
        </div>
      </FormRow>
    </div>
  );
}
