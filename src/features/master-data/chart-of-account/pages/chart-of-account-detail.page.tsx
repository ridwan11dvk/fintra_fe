import { Button, Label, Page, PageHeader, Separator } from "@railfinance/core";
import { useNavigate, useParams } from "react-router";
import { useGetChartOfAccountById } from "../data";
import {
  CHART_OF_ACCOUNT_DETAIL_PAGE_TITLE,
  CHART_OF_ACCOUNT_LIST_PAGE_TITLE,
  CHART_OF_ACCOUNT_READ_PERMISSION,
  CHART_OF_ACCOUNT_URL,
  getChartOfAccountDetailUrl,
  getChartOfAccountEditUrl,
} from "../data/chart-of-account.utils";

export function ChartOfAccountDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useGetChartOfAccountById(id || "", {
    enabled: !!id,
  });

  const coa = data?.data;

  const handleBack = () => {
    navigate(CHART_OF_ACCOUNT_URL);
  };

  const handleEdit = () => {
    if (id) {
      navigate(getChartOfAccountEditUrl(id));
    }
  };

  return (
    <Page
      type="base"
      title={CHART_OF_ACCOUNT_DETAIL_PAGE_TITLE}
      permission={CHART_OF_ACCOUNT_READ_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: CHART_OF_ACCOUNT_LIST_PAGE_TITLE,
          url: CHART_OF_ACCOUNT_URL,
        },
        {
          title: CHART_OF_ACCOUNT_DETAIL_PAGE_TITLE,
          url: id ? getChartOfAccountDetailUrl(id) : CHART_OF_ACCOUNT_URL,
        },
      ]}
    >
      <div className="space-y-6 w-full">
        <PageHeader
          title={CHART_OF_ACCOUNT_DETAIL_PAGE_TITLE}
          withBackButton={false}
        />
        <Separator className="w-full" />

        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            Loading chart of account details...
          </div>
        ) : (
          <div className="space-y-8 w-full">
            <div className="space-y-6 w-full">
              {/* Row 1: Chart of Account Name */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="w-72 shrink-0 text-sm font-medium text-foreground">
                  Chart of Account Name
                </Label>
                <span className="text-sm text-foreground">
                  {coa?.name || "—"}
                </span>
              </div>

              {/* Row 2: Chart of Account Code */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="w-72 shrink-0 text-sm font-medium text-foreground">
                  Chart of Account Code
                </Label>
                <span className="text-sm text-foreground">
                  {coa?.code || "—"}
                </span>
              </div>

              {/* Row 3: Level */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="w-72 shrink-0 text-sm font-medium text-foreground">
                  Level
                </Label>
                <span className="text-sm text-foreground">
                  {coa?.level ?? "—"}
                </span>
              </div>

              {/* Row 4: Description */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <Label className="w-72 shrink-0 text-sm font-medium text-foreground sm:pt-0.5">
                  Description
                </Label>
                <span className="text-sm text-foreground leading-relaxed max-w-2xl">
                  {coa?.description || "—"}
                </span>
              </div>
            </div>

            {/* Bottom Actions stretching full width */}
            <div className="pt-6 border-t border-border flex items-center justify-end gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                className="h-10 px-6 rounded-lg font-medium"
                onClick={handleBack}
              >
                Back
              </Button>
              <Button
                type="button"
                className="h-10 px-6 rounded-lg bg-[#1b2559] hover:bg-[#1b2559]/90 text-white font-medium"
                onClick={handleEdit}
              >
                Edit
              </Button>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}

export default ChartOfAccountDetailPage;
