/**
 * Posting Auto - Status Summary Card
 * Displays pending, posted, error, and SAP status counts
 */

import { Badge } from "@railfinance/core/ui/badge";
import { Skeleton } from "@railfinance/core/ui/skeleton";
import { usePostingAutoStatusSummary } from "../data/posting-auto.query";

export function PostingAutoStatusSummaryCard() {
  const { data: response, isLoading } = usePostingAutoStatusSummary();
  const summary = response?.data;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i + ""} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <div className="bg-card border rounded-lg p-3 text-center">
        <p className="text-xs text-muted-foreground mb-1">Pending</p>
        <Badge variant="secondary" className="text-base font-bold px-3 py-1">
          {summary.pendingCount}
        </Badge>
      </div>
      <div className="bg-card border rounded-lg p-3 text-center">
        <p className="text-xs text-muted-foreground mb-1">Posted</p>
        <Badge variant="default" className="text-base font-bold px-3 py-1">
          {summary.postedCount}
        </Badge>
      </div>
      <div className="bg-card border rounded-lg p-3 text-center">
        <p className="text-xs text-muted-foreground mb-1">Error</p>
        <Badge variant="destructive" className="text-base font-bold px-3 py-1">
          {summary.errorCount}
        </Badge>
      </div>
      <div className="bg-card border rounded-lg p-3 text-center">
        <p className="text-xs text-muted-foreground mb-1">SAP Success</p>
        <Badge variant="default" className="text-base font-bold px-3 py-1">
          {summary.sapSuccessCount}
        </Badge>
      </div>
      <div className="bg-card border rounded-lg p-3 text-center">
        <p className="text-xs text-muted-foreground mb-1">SAP Error</p>
        <Badge variant="destructive" className="text-base font-bold px-3 py-1">
          {summary.sapErrorCount}
        </Badge>
      </div>
      <div className="bg-card border rounded-lg p-3 text-center">
        <p className="text-xs text-muted-foreground mb-1">SAP Cancel</p>
        <Badge variant="secondary" className="text-base font-bold px-3 py-1">
          {summary.sapCancelCount}
        </Badge>
      </div>
    </div>
  );
}
