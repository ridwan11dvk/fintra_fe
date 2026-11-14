import { Button } from "@railfinance/core/ui/button";
import { Search } from "lucide-react";

interface TableEmptyStateProps {
  readonly onResetFilter?: () => void;
}

export function TableEmptyState({ onResetFilter }: TableEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-8 py-10">
      <div className="flex flex-col items-center gap-4">
        <div className="relative size-12 rounded-xl border border-border bg-background">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex size-10 items-center justify-center rounded-lg border border-black/[0.08] bg-background shadow-sm">
            <Search className="size-6 text-muted-foreground" />
          </div>
        </div>
        <div className="flex max-w-[352px] flex-col items-center gap-1 text-center">
          <p className="w-full text-base font-semibold text-foreground">
            No results found
          </p>
          <p className="w-full text-sm text-muted-foreground">
            No items match your current filters. Try adjusting or clearing them.
          </p>
        </div>
      </div>
      {onResetFilter && (
        <Button variant="link-outline" size="sm" onClick={onResetFilter}>
          Reset filter
        </Button>
      )}
    </div>
  );
}
