import { Badge, Button, Label } from "@railfinance/core";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { getLayerBadgeVariant, type ApprovalLevelItem } from "../data";

interface ApprovalLevelListProps {
  levels: ApprovalLevelItem[];
  onEdit: (level: ApprovalLevelItem) => void;
  onDelete: (id: string) => void;
  onReorder: (levels: ApprovalLevelItem[]) => void;
}

export function ApprovalLevelList({
  levels,
  onEdit,
  onDelete,
  onReorder,
}: Readonly<ApprovalLevelListProps>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  if (levels.length === 0) {
    return null;
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const moveLevel = (fromIndex: number, toIndex: number) => {
    const updated = [...levels];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onReorder(updated.map((item, idx) => ({ ...item, order: idx + 1 })));
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }
    moveLevel(draggedIndex, targetIndex);
    setDraggedIndex(null);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLLIElement>,
    index: number,
  ) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    const targetIndex = event.key === "ArrowUp" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= levels.length) return;
    moveLevel(index, targetIndex);
  };

  return (
    <ul className="space-y-3">
      {levels.map((item, index) => (
        <li
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(index)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          className="flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl border border-border bg-card hover:border-foreground/20 transition-colors shadow-2xs"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Order Number Circle */}
            <div className="size-7 rounded-full bg-[#1b2559] text-white flex items-center justify-center font-semibold text-xs shrink-0 select-none">
              {item.order}
            </div>

            {/* Layer Tag & Title & Description */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={getLayerBadgeVariant(item.layer)}
                  className="text-[11px] font-normal px-2.5 py-0.5 rounded-full"
                >
                  {item.categoryName || item.layer}
                </Badge>
                <Label className="font-semibold text-sm text-foreground">
                  {item.processName || item.title}
                </Label>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {item.description}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Role: {item.roleSetting === "limit-based"
                  ? item.limits?.map((limit) => limit.roleName).filter(Boolean).join(" / ") || "Not selected"
                  : item.roleName || "Not selected — edit this level"}
              </p>
            </div>
          </div>
          {/* Actions: Edit & Delete */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-9 rounded-lg border-border hover:bg-muted text-muted-foreground hover:text-foreground"
              aria-label={`Edit ${item.processName || item.title}`}
              onClick={() => onEdit(item)}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="size-9 rounded-lg bg-[#d92d20] hover:bg-[#d92d20]/90 text-white"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ApprovalLevelList;
