import { Button } from "@railfinance/core/ui/button";
import { Modal } from "@railfinance/core/components/modal";
import { Save } from "lucide-react";

interface UnsavedChangesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDiscard: () => void;
  onSave: () => void;
  onKeepEditing?: () => void;
  saveDisabled?: boolean;
  compact?: boolean;
}

export function UnsavedChangesModal({
  open,
  onOpenChange,
  onDiscard,
  onSave,
  onKeepEditing,
  saveDisabled = false,
  compact = false,
}: Readonly<UnsavedChangesModalProps>) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size={compact ? "sm" : "default"}
      title={compact ? (
        <span className="flex flex-col gap-3 px-3">
          <span className="relative isolate grid size-9 place-items-center rounded-full bg-amber-100 text-amber-700">
            <span aria-hidden="true" className="absolute -inset-2 -z-10 rounded-full border border-amber-500/15" />
            <span aria-hidden="true" className="absolute -inset-4 -z-10 rounded-full border border-amber-500/10" />
            <Save aria-hidden="true" className="size-4" />
          </span>
          <span className="text-lg font-bold text-foreground">Unsaved changes</span>
        </span>
      ) : "Unsaved changes"}
      showCloseButton={!onKeepEditing}
      footer={(
        <div className={`flex gap-2 ${compact ? "w-full" : "justify-end"}`}>
          <Button type="button" variant="outline" className={compact ? "flex-1" : undefined} onClick={onDiscard}>
            Discard
          </Button>
          {onKeepEditing && (
            <Button type="button" variant="outline" className={compact ? "flex-1" : undefined} onClick={onKeepEditing}>
              Keep editing
            </Button>
          )}
          <Button type="button" className={compact ? "flex-1" : undefined} onClick={onSave} disabled={saveDisabled}>
            Save changes
          </Button>
        </div>
      )}
    >
      <p className={compact ? "text-xs text-muted-foreground" : "text-sm text-muted-foreground"}>
        Do you want to save or discard changes?
      </p>
    </Modal>
  );
}
