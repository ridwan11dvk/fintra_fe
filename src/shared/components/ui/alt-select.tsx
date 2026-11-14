"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@railfinance/core/lib";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@railfinance/core/ui/input-group";

const AltSelectAnchorContext = React.createContext<{
  anchorEl: HTMLElement | null;
  setAnchorEl: (el: HTMLElement | null) => void;
} | null>(null);

// automatic close if outside is scrolled
function AltSelect({
  children,
  open: openProp,
  defaultOpen,
  onOpenChange,
  ...props
}: Readonly<React.ComponentProps<typeof ComboboxPrimitive.Root>>) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen || false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  // get tipe parameter kedua secara dinamis dari definisi library
  type OpenChangeDetails = Parameters<
    NonNullable<
      React.ComponentProps<typeof ComboboxPrimitive.Root>["onOpenChange"]
    >
  >[1];

  const handleOpenChange = React.useCallback(
    (newOpen: boolean, details: OpenChangeDetails) => {
      if (!isControlled) setInternalOpen(newOpen);
      onOpenChange?.(newOpen, details);
    },
    [isControlled, onOpenChange],
  );

  React.useEffect(() => {
    if (!open) return;

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const isInsideDropdown =
        target?.closest?.('[data-slot="alt-select-content"]') ||
        target?.closest?.('[data-slot="alt-select-list"]');

      if (isInsideDropdown) return;

      // send objek kosong yang di-cast ke tipe yang diharapkan
      handleOpenChange(false, {} as OpenChangeDetails);
    };

    window.addEventListener("scroll", handleScroll, {
      capture: true,
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [open, handleOpenChange]);

  const contextValue = React.useMemo(
    () => ({ anchorEl, setAnchorEl }),
    [anchorEl],
  );

  return (
    <AltSelectAnchorContext.Provider value={contextValue}>
      <ComboboxPrimitive.Root
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      >
        {children}
      </ComboboxPrimitive.Root>
    </AltSelectAnchorContext.Provider>
  );
}

// sub component
function AltSelectValue({ ...props }: Readonly<ComboboxPrimitive.Value.Props>) {
  return <ComboboxPrimitive.Value data-slot="alt-select-value" {...props} />;
}

function AltSelectTrigger({
  className,
  children,
  ...props
}: Readonly<ComboboxPrimitive.Trigger.Props>) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="alt-select-trigger"
      className={cn("[&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      {children}
      <ChevronDownIcon
        data-slot="alt-select-trigger-icon"
        className="text-muted-foreground pointer-events-none size-4"
      />
    </ComboboxPrimitive.Trigger>
  );
}

function AltSelectClear({
  className,
  ...props
}: Readonly<ComboboxPrimitive.Clear.Props>) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="alt-select-clear"
      render={<InputGroupButton variant="ghost" size="icon-xs" />}
      className={cn(className)}
      {...props}
    >
      <XIcon className="pointer-events-none" />
    </ComboboxPrimitive.Clear>
  );
}

function AltSelectInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  onClear,
  startIcon,
  ...props
}: Readonly<
  ComboboxPrimitive.Input.Props & {
    showTrigger?: boolean;
    showClear?: boolean;
    onClear?: () => void;
    startIcon?: React.ReactNode;
  }
>) {
  const context = React.useContext(AltSelectAnchorContext);

  return (
    <InputGroup ref={context?.setAnchorEl} className={cn("w-auto", className)}>
      {startIcon && (
        <InputGroupAddon align="inline-start">{startIcon}</InputGroupAddon>
      )}
      <ComboboxPrimitive.Input
        render={<InputGroupInput disabled={disabled} />}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        {showTrigger && (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            asChild
            data-slot="input-group-button"
            className="group-has-data-[slot=alt-select-clear]/input-group:hidden data-pressed:bg-transparent"
            disabled={disabled}
          >
            <AltSelectTrigger />
          </InputGroupButton>
        )}
        {showClear && <AltSelectClear disabled={disabled} onClick={onClear} />}
      </InputGroupAddon>
      {children}
    </InputGroup>
  );
}

function AltSelectContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor: anchorProp,
  ...props
}: Readonly<
  ComboboxPrimitive.Popup.Props &
    Pick<
      ComboboxPrimitive.Positioner.Props,
      "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
    >
>) {
  const context = React.useContext(AltSelectAnchorContext);
  const anchor = anchorProp ?? context?.anchorEl;

  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-50"
      >
        <ComboboxPrimitive.Popup
          data-slot="alt-select-content"
          data-chips={!!anchor}
          className={cn(
            "bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:border-input/30 group/alt-select-content relative max-h-96 w-(--anchor-width) max-w-(--available-width) min-w-(--anchor-width) origin-(--transform-origin) overflow-hidden rounded-md shadow-md ring-1 duration-100 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:shadow-none",
            "pointer-events-auto",
            className,
          )}
          // pastikan event wheel tidak diblokir oleh container luar
          onWheel={(e) => e.stopPropagation()}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

function AltSelectList({
  className,
  ...props
}: Readonly<ComboboxPrimitive.List.Props>) {
  return (
    <ComboboxPrimitive.List
      data-slot="alt-select-list"
      className={cn(
        "max-h-[min(calc(--spacing(96)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto p-1 data-empty:p-0 pointer-events-auto overscroll-contain touch-pan-y",
        className,
      )}
      {...props}
    />
  );
}

function AltSelectItem({
  className,
  children,
  ...props
}: Readonly<ComboboxPrimitive.Item.Props>) {
  return (
    <ComboboxPrimitive.Item
      data-slot="alt-select-item"
      className={cn(
        "mx-1 first:mt-1 mb-1 data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[selected]:bg-primary/7 data-[selected]:text-primary data-[selected]:font-medium relative flex w-[calc(100%-0.5rem)] cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        data-slot="alt-select-item-indicator"
        render={
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
        }
      >
        <CheckIcon className="pointer-events-none size-4 pointer-coarse:size-5" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}

function AltSelectEmpty({
  className,
  ...props
}: Readonly<ComboboxPrimitive.Empty.Props>) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="alt-select-empty"
      className={cn(
        "text-muted-foreground hidden w-full flex-col items-center justify-center gap-1.5 py-4 text-center text-sm group-data-empty/alt-select-content:flex",
        className,
      )}
      {...props}
    />
  );
}

export {
  AltSelect,
  AltSelectContent,
  AltSelectEmpty,
  AltSelectInput,
  AltSelectItem,
  AltSelectList,
  AltSelectTrigger,
  AltSelectValue,
};
