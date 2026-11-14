import { Card, CardContent, CardHeader, CardTitle } from "@railfinance/core/ui/card";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import type { ReactNode } from "react";

/**
 * A titled card that groups a set of form fields.
 */
export function UserFormSection({
  title,
  description,
  children,
}: Readonly<{
  title: string;
  description?: string;
  children: ReactNode;
}>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

/**
 * Label + control row. The label keeps a fixed width so every field in the
 * form aligns on the same column.
 */
export function FormFieldRow({
  label,
  htmlFor,
  required,
  error,
  children,
}: Readonly<{
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: { message?: string };
  children: ReactNode;
}>) {
  return (
    <div className="flex flex-col md:flex-row items-start md:gap-4">
      <Label
        htmlFor={htmlFor}
        className="text-sm font-medium w-40 pt-2 shrink-0"
      >
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="flex-1 space-y-1 w-full">
        {children}
        {error && <p className="text-sm text-destructive">{error.message}</p>}
      </div>
    </div>
  );
}

/**
 * Text input bound to a react-hook-form field.
 */
export function FormTextField({
  id,
  label,
  required,
  error,
  placeholder,
  disabled,
  ...inputProps
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: { message?: string };
  placeholder?: string;
  disabled?: boolean;
} & React.ComponentProps<"input">) {
  return (
    <FormFieldRow
      label={label}
      htmlFor={id}
      required={required}
      error={error}
    >
      <Input
        id={id}
        placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
        aria-invalid={!!error}
        disabled={disabled}
        {...inputProps}
      />
    </FormFieldRow>
  );
}
