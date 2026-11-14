import { Button, Label, Page, PageHeader, Separator } from "@railfinance/core";
import { useNavigate, useParams } from "react-router";
import { useGetBusinessUnitById } from "../data";
import {
  BUSINESS_UNIT_DETAIL_PAGE_TITLE,
  BUSINESS_UNIT_LIST_PAGE_TITLE,
  BUSINESS_UNIT_READ_PERMISSION,
  BUSINESS_UNIT_URL,
  getBusinessUnitDetailUrl,
  getBusinessUnitEditUrl,
} from "../data/business-unit.utils";

export function BusinessUnitDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useGetBusinessUnitById(id || "", {
    enabled: !!id,
  });

  const bu = data?.data;

  const handleBack = () => {
    navigate(BUSINESS_UNIT_URL);
  };

  const handleEdit = () => {
    if (id) {
      navigate(getBusinessUnitEditUrl(id));
    }
  };

  const formatStatus = () => {
    if (bu?.status === "Active" || bu?.status === true || bu?.isActive) {
      return "Active";
    }
    if (bu?.status === "Inactive" || bu?.status === false) {
      return "Inactive";
    }
    return "Active";
  };

  const formatDateValue = (val?: boolean | string, fallback = "—") => {
    if (typeof val === "string" && val.trim()) return val;
    if (val === true) return "Jan 01, 2025";
    return fallback;
  };

  return (
    <Page
      type="base"
      title={BUSINESS_UNIT_DETAIL_PAGE_TITLE}
      permission={BUSINESS_UNIT_READ_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: BUSINESS_UNIT_LIST_PAGE_TITLE,
          url: BUSINESS_UNIT_URL,
        },
        {
          title: BUSINESS_UNIT_DETAIL_PAGE_TITLE,
          url: id ? getBusinessUnitDetailUrl(id) : BUSINESS_UNIT_URL,
        },
      ]}
    >
      <div className="space-y-6 w-full">
        <PageHeader
          title={BUSINESS_UNIT_DETAIL_PAGE_TITLE}
          withBackButton={false}
        />
        <Separator className="w-full" />

        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            Loading business unit details...
          </div>
        ) : (
          <div className="space-y-8 w-full">
            <div className="space-y-5 w-full">
              {/* Row 1: Business Unit ID */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="w-72 shrink-0 text-sm font-medium text-foreground">
                  Business Unit ID
                </Label>
                <span className="text-sm text-foreground">
                  {bu?.code || "—"}
                </span>
              </div>

              {/* Row 2: Business Unit Name */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="w-72 shrink-0 text-sm font-medium text-foreground">
                  Business Unit Name
                </Label>
                <span className="text-sm text-foreground">
                  {bu?.name || "—"}
                </span>
              </div>

              {/* Row 3: Parent Business Unit */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="w-72 shrink-0 text-sm font-medium text-foreground">
                  Parent Business Unit
                </Label>
                <span className="text-sm text-foreground">
                  {bu?.parentBusinessUnit || "—"}
                </span>
              </div>

              {/* Row 4: Business Unit Type */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="w-72 shrink-0 text-sm font-medium text-foreground">
                  Business Unit Type
                </Label>
                <span className="text-sm text-foreground">
                  {bu?.businessUnitType || "—"}
                </span>
              </div>

              {/* Row 5: Company Code */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="w-72 shrink-0 text-sm font-medium text-foreground">
                  Company Code
                </Label>
                <span className="text-sm text-foreground">
                  {bu?.companyCode || "1000"}
                </span>
              </div>

              {/* Row 6: Segment */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="w-72 shrink-0 text-sm font-medium text-foreground">
                  Segment
                </Label>
                <span className="text-sm text-foreground">
                  {bu?.segment || "Finance"}
                </span>
              </div>

              {/* Row 7: Region */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="w-72 shrink-0 text-sm font-medium text-foreground">
                  Region
                </Label>
                <span className="text-sm text-foreground">
                  {bu?.region || "Asia Pacific"}
                </span>
              </div>

              {/* Row 8: Status */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="w-72 shrink-0 text-sm font-medium text-foreground">
                  Status
                </Label>
                <span className="text-sm text-foreground">
                  {formatStatus()}
                </span>
              </div>

              {/* Row 9: Effective Date */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="w-72 shrink-0 text-sm font-medium text-foreground">
                  Effective Date
                </Label>
                <span className="text-sm text-foreground">
                  {formatDateValue(bu?.effectiveDate, "Jan 01, 2025")}
                </span>
              </div>

              {/* Row 10: End Date */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="w-72 shrink-0 text-sm font-medium text-foreground">
                  End Date
                </Label>
                <span className="text-sm text-foreground">
                  {formatDateValue(bu?.endDate, "Dec 31, 2025")}
                </span>
              </div>

              {/* Row 11: Created By */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="w-72 shrink-0 text-sm font-medium text-foreground">
                  Created By
                </Label>
                <span className="text-sm text-foreground">
                  {bu?.createdBy || "Admin"}
                </span>
              </div>

              {/* Row 12: Created Date */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="w-72 shrink-0 text-sm font-medium text-foreground">
                  Created Date
                </Label>
                <span className="text-sm text-foreground">
                  {formatDateValue(bu?.createdDate, "Jan 01, 2025")}
                </span>
              </div>

              {/* Row 13: Last Updated By */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="w-72 shrink-0 text-sm font-medium text-foreground">
                  Last Updated By
                </Label>
                <span className="text-sm text-foreground">
                  {bu?.lastUpdatedBy || "Admin"}
                </span>
              </div>

              {/* Row 14: Last Updated Date */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label className="w-72 shrink-0 text-sm font-medium text-foreground">
                  Last Updated Date
                </Label>
                <span className="text-sm text-foreground">
                  {formatDateValue(bu?.lastUpdatedDate, "Sep 15, 2026")}
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

export default BusinessUnitDetailPage;
