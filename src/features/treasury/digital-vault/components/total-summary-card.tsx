import { useStationSummaryTotal } from "@/features/treasury";
import type { InputValue } from "@railfinance/core/types";
import { Card, CardContent, CardTitle } from "@railfinance/core/ui/card";
import { cn, formatAbbr } from "@railfinance/core/lib";
import { ProgressLoader } from "@railfinance/core/components/loader";
import { Separator } from "@railfinance/core/ui/separator";
import { useIsMobile } from "@railfinance/core/hooks";

export type TotalSummaryCardProps = {
  filters?: Record<string, InputValue>;
};

interface SummaryStat {
  label: string;
  dotClassName: string;
  value: number;
}

function StatColumn({
  label,
  dotClassName,
  value,
  isLoading,
}: Readonly<SummaryStat & { isLoading: boolean }>) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className={cn("size-2.5 rounded-full", dotClassName)} />
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
      </div>
      {isLoading ? (
        <ProgressLoader size="sm" className="items-start gap-0 p-0" />
      ) : (
        <div className="flex items-end gap-2">
          <span className="text-2xl font-semibold text-muted-foreground">
            Rp
          </span>
          <span className="text-2xl font-semibold text-foreground">
            {formatAbbr(value)}
          </span>
        </div>
      )}
    </div>
  );
}

export function TotalSummaryCard({ filters }: Readonly<TotalSummaryCardProps>) {
  const { data, isLoading } = useStationSummaryTotal(filters);
  const isMobile = useIsMobile();

  const stats: SummaryStat[] = [
    {
      label: "Total Closure",
      dotClassName: "bg-orange-500",
      value: data?.data?.totalAllClosureAmount ?? 0,
    },
    {
      label: "Total Deposit",
      dotClassName: "bg-indigo-500",
      value: data?.data?.totalAllDepositAmount ?? 0,
    },
    {
      label: "Total Credit",
      dotClassName: "bg-blue-500",
      value: data?.data?.totalAllCreditAmount ?? 0,
    },
    {
      label: "Total Completed",
      dotClassName: "bg-green-500",
      value: data?.data?.totalAllCompleteAmount ?? 0,
    },
  ];

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-5">
        <CardTitle className="text-lg">Overview</CardTitle>
        <div
          className={cn(
            "flex gap-4",
            isMobile ? "flex-col" : "flex-row items-stretch",
          )}
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex flex-1 items-stretch gap-4">
              <StatColumn {...stat} isLoading={isLoading} />
              {index < stats.length - 1 && (
                <Separator orientation={isMobile ? "horizontal" : "vertical"} />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default TotalSummaryCard;
