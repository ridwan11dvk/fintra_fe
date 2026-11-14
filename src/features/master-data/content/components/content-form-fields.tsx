import { contentSections } from "../data/content.types";
import type { ContentFormValues } from "../data/content.schema";
import { Label } from "@railfinance/core/ui/label";
import { NativeSelect, NativeSelectOption } from "@railfinance/core/ui/native-select";
import { Textarea } from "@railfinance/core/ui/textarea";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ReactNode } from "react";
import styles from "./content-form-fields.module.css";

interface ContentFormFieldsProps {
  register: UseFormRegister<ContentFormValues>;
  errors: FieldErrors<ContentFormValues>;
  onContentChange: (content: string) => void;
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

export function ContentFormFields({ register, errors, onContentChange }: Readonly<ContentFormFieldsProps>) {
  const contentField = register("content");

  return (
    <div className={styles.layout}>
      <FormRow htmlFor="content-section" label="Section Name" required>
        <NativeSelect id="content-section" className={styles.control} {...register("sectionName")}>
          <NativeSelectOption value="">Select Section Name</NativeSelectOption>
          {contentSections.map((section) => <NativeSelectOption key={section} value={section}>{section}</NativeSelectOption>)}
        </NativeSelect>
        {errors.sectionName && <p role="alert" className="mt-1 text-xs text-destructive">{errors.sectionName.message}</p>}
      </FormRow>

      <FormRow htmlFor="content-value" label="Content" required multiline>
        <Textarea
          id="content-value"
          className={styles.textarea}
          maxLength={5000}
          placeholder="Enter content"
          aria-invalid={Boolean(errors.content)}
          {...contentField}
          onChange={(event) => {
            contentField.onChange(event);
            onContentChange(event.currentTarget.value);
          }}
        />
        {errors.content && <p role="alert" className="mt-1 text-xs text-destructive">{errors.content.message}</p>}
      </FormRow>

    </div>
  );
}
