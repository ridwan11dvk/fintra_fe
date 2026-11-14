import { Modal } from "@railfinance/core";
import { ToggleLeft } from "lucide-react";

export interface StatusToggleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isActive?: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "default" | "destructive";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function StatusToggleModal({
  open,
  onOpenChange,
  isActive = false,
  title,
  description,
  confirmText,
  cancelText = "Cancel",
  confirmVariant,
  isLoading = false,
  onConfirm,
  onCancel,
}: Readonly<StatusToggleModalProps>) {
  const defaultTitle = isActive
    ? "Deactivate this data?"
    : "Activate this data";

  const defaultDescription = isActive
    ? "Are you sure you want to deactivate this data? This action might affect other configuration."
    : "Are you sure you want to activate this data? This action might affect other configuration.";

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      title={
        <div className="flex flex-col gap-3 text-left">
          {isActive ? (
            <div className="relative flex size-12 items-center justify-center rounded-full bg-red-100/70 text-red-600">
              <div className="absolute -inset-2 rounded-full border border-red-100/80 pointer-events-none" />
              <div className="absolute -inset-4 rounded-full border border-red-50/50 pointer-events-none" />
              <ToggleLeft className="size-6 text-red-600 stroke-[2.2]" />
            </div>
          ) : (
            <div className="relative flex size-12 items-center justify-center rounded-full bg-amber-100/80 text-amber-600">
              <div className="absolute -inset-2 rounded-full border border-amber-100/80 pointer-events-none" />
              <div className="absolute -inset-4 rounded-full border border-amber-50/50 pointer-events-none" />
              <ToggleLeft className="size-6 text-amber-600 stroke-[2.2]" />
            </div>
          )}
          <span className="text-lg font-bold text-foreground">
            {title ?? defaultTitle}
          </span>
        </div>
      }
      description={description ?? defaultDescription}
      confirmVariant={confirmVariant ?? (isActive ? "destructive" : "default")}
      confirmText={confirmText ?? (isActive ? "Deactivate" : "Activate")}
      cancelText={cancelText}
      isLoading={isLoading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      {null}
    </Modal>
  );
}

export default StatusToggleModal;
