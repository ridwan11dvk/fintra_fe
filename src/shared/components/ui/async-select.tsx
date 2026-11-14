import { cn } from "@railfinance/core/lib";
import { Loader, Search } from "lucide-react";
import * as React from "react";
import {
  AltSelect,
  AltSelectContent,
  AltSelectEmpty,
  AltSelectInput,
  AltSelectItem,
  AltSelectList,
} from "./alt-select";

export interface AsyncSelectProps<T> {
  readonly value: string;
  readonly onValueChange: (val: string, item?: T) => void;
  readonly searchValue: string;
  readonly onSearchChange: (val: string) => void;
  readonly items: readonly T[];
  readonly renderItem: (item: T) => React.ReactNode;
  readonly getKey: (item: T) => string;
  readonly getValue: (item: T) => string;

  readonly isLoading?: boolean;
  readonly isError?: boolean;
  readonly errorMessage?: string;
  readonly placeholder?: string;
  readonly emptyMessage?: React.ReactNode;
  readonly loadingMessage?: React.ReactNode;

  readonly disabled?: boolean;
  readonly maxLength?: number;
  readonly "aria-invalid"?: boolean;

  readonly className?: string;
  readonly inputClassName?: string;
  readonly contentClassName?: string;
  readonly listClassName?: string;

  readonly onFocus?: React.FocusEventHandler<HTMLInputElement>;
}

export function AsyncSelect<T>({
  value,
  onValueChange,
  searchValue,
  onSearchChange,
  items,
  renderItem,
  getKey,
  getValue,

  isLoading = false,
  isError = false,
  errorMessage,
  placeholder = "Search...",
  emptyMessage = "No items found",
  loadingMessage = "Loading...",

  disabled = false,
  maxLength,
  "aria-invalid": ariaInvalid,

  className,
  inputClassName,
  contentClassName,
  listClassName,

  onFocus,
}: AsyncSelectProps<T>) {
  return (
    <div className={cn("w-full", className)}>
      <AltSelect
        value={value}
        onValueChange={(val: unknown) => {
          // base-ui resolves to the `value` prop of the selected item, which is
          // always the string produced by `getValue` (see AltSelectItem below),
          // so anything else means "no selection".
          if (typeof val !== "string") {
            onValueChange("", undefined);
            return;
          }
          const item = items.find((i) => getValue(i) === val);
          onValueChange(val, item);
        }}
      >
        <AltSelectInput
          placeholder={placeholder}
          startIcon={
            isLoading ? (
              <Loader className="h-4 w-4 animate-spin text-muted-foreground/50 shrink-0" />
            ) : (
              <Search className="h-4 w-4 text-muted-foreground/50 shrink-0" />
            )
          }
          showClear={!!searchValue}
          onClear={() => onSearchChange("")}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={onFocus}
          disabled={disabled}
          maxLength={maxLength}
          aria-invalid={ariaInvalid}
          className={cn(
            isError
              ? "border-destructive has-[[data-slot=input-group-control]:focus-visible]:border-destructive has-[[data-slot=input-group-control]:focus-visible]:ring-destructive/20"
              : "border-muted",
            inputClassName,
          )}
        />
        <AltSelectContent
          className={cn(
            "z-100 max-h-75 shadow-lg rounded-lg border bg-popover text-popover-foreground",
            contentClassName,
          )}
        >
          <AltSelectList className={cn("max-h-72 p-1", listClassName)}>
            {(() => {
              if (isLoading) {
                return (
                  <div className="p-6 text-center">
                    <Loader className="h-5 w-5 animate-spin mx-auto text-primary" />
                    <p className="text-xs text-muted-foreground mt-2 font-medium">
                      {loadingMessage}
                    </p>
                  </div>
                );
              }
              if (items.length > 0) {
                return items.map((item) => (
                  <AltSelectItem
                    key={getKey(item)}
                    value={getValue(item)}
                    className="rounded-md hover:bg-muted/50 transition-colors px-2!"
                  >
                    {renderItem(item)}
                  </AltSelectItem>
                ));
              }
              if (searchValue !== "") {
                if (typeof emptyMessage === "string") {
                  return (
                    <AltSelectEmpty className="py-6 text-center text-sm text-muted-foreground font-medium">
                      {emptyMessage}
                    </AltSelectEmpty>
                  );
                }
                return emptyMessage;
              }
              return null;
            })()}
          </AltSelectList>
        </AltSelectContent>
      </AltSelect>
      {isError && errorMessage && (
        <p className="text-[11px] text-destructive font-medium mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
