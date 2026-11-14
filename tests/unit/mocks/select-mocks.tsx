import type React from "react";

type QuerySelectOption = {
  value: string;
  label: string;
  description?: string | null;
};

type QuerySelectMockProps = {
  value?: string | number | null;
  onValueChange?: (value: string) => void;
  options?: QuerySelectOption[];
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  id?: string;
  name?: string;
  className?: string;
  "aria-invalid"?: boolean;
};

/**
 * Mock for the `QuerySelect` component from `@railfinance/ui`.
 * Renders a native `<select>` so tests can interact via
 * `user.selectOptions` / `fireEvent.change`.
 */
export function mockQuerySelect(testId = "select") {
  return ({
    value,
    onValueChange,
    options,
    placeholder,
    disabled,
    multiple,
    id,
    name,
    className,
  }: QuerySelectMockProps) => (
    <select
      data-testid={testId}
      value={value == null ? "" : String(value)}
      onChange={(e) => onValueChange?.(e.target.value)}
      disabled={disabled}
      multiple={multiple}
      id={id}
      name={name}
      className={className}
    >
      <option value="">{placeholder}</option>
      {options?.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

/**
 * Mock for the `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`,
 * `SelectItem` components from `@railfinance/ui` — a simple wrapper that
 * renders a native select when the trigger is clicked is too complex for
 * unit tests, so we provide a controlled native select instead.
 */
export function mockSelect(testId = "select") {
  const Select = ({
    children,
    value,
    onValueChange,
    disabled,
  }: {
    children?: React.ReactNode;
    value?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
  }) => (
    <select
      data-testid={testId}
      value={value ?? ""}
      onChange={(e) => onValueChange?.(e.target.value)}
      disabled={disabled}
    >
      {children}
    </select>
  );

  const SelectTrigger = ({ children }: { children?: React.ReactNode }) => (
    <>{children}</>
  );

  const SelectValue = ({ placeholder }: { placeholder?: string }) => (
    <span>{placeholder}</span>
  );

  const SelectContent = ({ children }: { children?: React.ReactNode }) => (
    <>{children}</>
  );

  const SelectItem = ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <option value={value}>{children}</option>;

  return { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
}
