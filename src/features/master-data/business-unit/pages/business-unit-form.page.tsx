import {
  Button,
  Input,
  Label,
  Page,
  PageHeader,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
  Textarea,
  toast,
} from "@railfinance/core";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import {
  businessUnitQueryKeys,
  useCreateBusinessUnitMutation,
  useGetBusinessUnitById,
  useUpdateBusinessUnitMutation,
  type BusinessUnitFormData,
} from "../data";
import {
  BUSINESS_UNIT_CREATE_PAGE_TITLE,
  BUSINESS_UNIT_CREATE_PERMISSION,
  BUSINESS_UNIT_CREATE_URL,
  BUSINESS_UNIT_EDIT_PAGE_TITLE,
  BUSINESS_UNIT_LIST_PAGE_TITLE,
  BUSINESS_UNIT_UPDATE_PERMISSION,
  BUSINESS_UNIT_URL,
  getBusinessUnitEditUrl,
} from "../data/business-unit.utils";

const BUSINESS_UNIT_TYPES = ["Department", "Division", "Branch", "Subsidiary"];

const COMPANY_CODES = ["1000", "2000", "3000", "4000"];

export function BusinessUnitFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);

  const title = isEdit
    ? BUSINESS_UNIT_EDIT_PAGE_TITLE
    : BUSINESS_UNIT_CREATE_PAGE_TITLE;

  const permission = isEdit
    ? BUSINESS_UNIT_UPDATE_PERMISSION
    : BUSINESS_UNIT_CREATE_PERMISSION;

  const currentUrl =
    isEdit && id ? getBusinessUnitEditUrl(id) : BUSINESS_UNIT_CREATE_URL;

  const { data: detailData, isLoading: isLoadingDetail } =
    useGetBusinessUnitById(id || "", {
      enabled: isEdit,
    });

  const bu = detailData?.data;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BusinessUnitFormData>({
    values:
      isEdit && bu
        ? {
            code: bu.code || "",
            parentBusinessUnit: bu.parentBusinessUnit || "",
            status:
              bu.status === true ||
              bu.status === "Active" ||
              bu.isActive === true,
            name: bu.name || "",
            businessUnitType: bu.businessUnitType || "",
            companyCode: bu.companyCode || "",
            segment: bu.segment || "",
            region: bu.region || "",
            effectiveDate: Boolean(bu.effectiveDate),
            endDate: Boolean(bu.endDate),
            createdBy: bu.createdBy || "",
            createdDate: Boolean(bu.createdDate),
            lastUpdatedBy: bu.lastUpdatedBy || "",
            lastUpdatedDate: Boolean(bu.lastUpdatedDate),
            description: bu.description || "",
          }
        : undefined,
    defaultValues: {
      code: "",
      parentBusinessUnit: "",
      status: false,
      name: "",
      businessUnitType: "",
      companyCode: "",
      segment: "",
      region: "",
      effectiveDate: false,
      endDate: false,
      createdBy: "",
      createdDate: false,
      lastUpdatedBy: "",
      lastUpdatedDate: false,
      description: "",
    },
  });

  const createMutation = useCreateBusinessUnitMutation();
  const updateMutation = useUpdateBusinessUnitMutation();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Track field values for save button active/disabled state
  const watchedCode = useWatch({ control, name: "code" });
  const watchedName = useWatch({ control, name: "name" });
  const isFormValid =
    Boolean(watchedCode?.trim()) && Boolean(watchedName?.trim());

  const onSubmit = async (values: BusinessUnitFormData) => {
    const payload = {
      code: values.code.trim(),
      name: values.name.trim(),
      parentBusinessUnit: values.parentBusinessUnit?.trim() || undefined,
      status: values.status,
      businessUnitType: values.businessUnitType?.trim() || undefined,
      companyCode: values.companyCode?.trim() || undefined,
      segment: values.segment?.trim() || undefined,
      region: values.region?.trim() || undefined,
      effectiveDate: values.effectiveDate ? "Jan 01, 2025" : undefined,
      endDate: values.endDate ? "Dec 31, 2025" : undefined,
      createdBy: values.createdBy?.trim() || "Admin",
      createdDate: values.createdDate ? "Jan 01, 2025" : undefined,
      lastUpdatedBy: values.lastUpdatedBy?.trim() || "Admin",
      lastUpdatedDate: values.lastUpdatedDate ? "Sep 15, 2026" : undefined,
      description: values.description?.trim() || "",
      isActive: values.status,
    };

    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id, data: payload });
        queryClient.invalidateQueries({
          queryKey: businessUnitQueryKeys.all,
        });
        navigate(BUSINESS_UNIT_URL, {
          state: {
            bannerAlert: {
              title: "Business Unit updated successfully",
              description:
                "The Business Unit information has been saved and is now up to date.",
            },
          },
        });
      } else {
        await createMutation.mutateAsync(payload);
        queryClient.invalidateQueries({
          queryKey: businessUnitQueryKeys.all,
        });
        navigate(BUSINESS_UNIT_URL, {
          state: {
            bannerAlert: {
              title: "Business Unit added successfully",
              description:
                "The Business Unit information has been saved and is now up to date.",
            },
          },
        });
      }
    } catch {
      toast.error(
        isEdit
          ? "Failed to update Business Unit"
          : "Failed to create Business Unit",
      );
    }
  };

  const handleCancel = () => {
    navigate(BUSINESS_UNIT_URL);
  };

  return (
    <Page
      type="base"
      title={title}
      permission={permission}
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
          title,
          url: currentUrl,
        },
      ]}
    >
      <div className="space-y-6 w-full">
        <PageHeader title={title} withBackButton={false} />
        <Separator className="w-full" />

        {isEdit && isLoadingDetail ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            Loading business unit data...
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full">
            <div className="space-y-5 w-full">
              {/* Row 1: Business Unit ID */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label
                  htmlFor="code"
                  className="w-72 shrink-0 text-sm font-medium text-foreground"
                >
                  Business Unit ID
                </Label>
                <div className="w-full sm:w-[460px]">
                  <Input
                    id="code"
                    placeholder="Enter Business Unit ID"
                    {...register("code", {
                      required: "Business Unit ID is required",
                    })}
                    disabled={isSubmitting}
                  />
                  {errors.code && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.code.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Parent Business Unit */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label
                  htmlFor="parentBusinessUnit"
                  className="w-72 shrink-0 text-sm font-medium text-foreground"
                >
                  Parent Business Unit
                </Label>
                <div className="w-full sm:w-[460px]">
                  <Input
                    id="parentBusinessUnit"
                    placeholder="Enter Parent Business Unit"
                    {...register("parentBusinessUnit")}
                    disabled={isSubmitting}
                  />
                  {errors.parentBusinessUnit && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.parentBusinessUnit.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 3: Status */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label
                  htmlFor="status"
                  className="w-72 shrink-0 text-sm font-medium text-foreground"
                >
                  Status
                </Label>
                <div className="flex items-center">
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Switch
                        id="status"
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Row 4: Business Unit Name (Textarea) */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <Label
                  htmlFor="name"
                  className="w-72 shrink-0 text-sm font-medium text-foreground sm:pt-2.5"
                >
                  Business Unit Name
                </Label>
                <div className="w-full sm:w-[460px]">
                  <Textarea
                    id="name"
                    placeholder="Enter Business Unit Name"
                    rows={4}
                    {...register("name", {
                      required: "Business Unit name is required",
                    })}
                    disabled={isSubmitting}
                    className="resize-none"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 5: Business Unit Type */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label
                  htmlFor="businessUnitType"
                  className="w-72 shrink-0 text-sm font-medium text-foreground"
                >
                  Business Unit Type
                </Label>
                <div className="w-full sm:w-[460px]">
                  <Controller
                    control={control}
                    name="businessUnitType"
                    render={({ field }) => {
                      const selectedVal = field.value || "";
                      return (
                        <Select
                          key={`select-bu-type-${selectedVal || "none"}`}
                          value={selectedVal}
                          onValueChange={field.onChange}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger
                            id="businessUnitType"
                            className="w-full"
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {BUSINESS_UNIT_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                            {selectedVal &&
                              !BUSINESS_UNIT_TYPES.includes(selectedVal) && (
                                <SelectItem
                                  key={selectedVal}
                                  value={selectedVal}
                                >
                                  {selectedVal}
                                </SelectItem>
                              )}
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                </div>
              </div>

              {/* Row 6: Company Code */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label
                  htmlFor="companyCode"
                  className="w-72 shrink-0 text-sm font-medium text-foreground"
                >
                  Company Code
                </Label>
                <div className="w-full sm:w-[460px]">
                  <Controller
                    control={control}
                    name="companyCode"
                    render={({ field }) => {
                      const selectedVal = field.value || "";
                      return (
                        <Select
                          key={`select-company-code-${selectedVal || "none"}`}
                          value={selectedVal}
                          onValueChange={field.onChange}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger id="companyCode" className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {COMPANY_CODES.map((code) => (
                              <SelectItem key={code} value={code}>
                                {code}
                              </SelectItem>
                            ))}
                            {selectedVal &&
                              !COMPANY_CODES.includes(selectedVal) && (
                                <SelectItem
                                  key={selectedVal}
                                  value={selectedVal}
                                >
                                  {selectedVal}
                                </SelectItem>
                              )}
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                </div>
              </div>

              {/* Row 7: Segment */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label
                  htmlFor="segment"
                  className="w-72 shrink-0 text-sm font-medium text-foreground"
                >
                  Segment
                </Label>
                <div className="w-full sm:w-[460px]">
                  <Input
                    id="segment"
                    placeholder="Enter Segment"
                    {...register("segment")}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Row 8: Region */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label
                  htmlFor="region"
                  className="w-72 shrink-0 text-sm font-medium text-foreground"
                >
                  Region
                </Label>
                <div className="w-full sm:w-[460px]">
                  <Input
                    id="region"
                    placeholder="Enter Region"
                    {...register("region")}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Row 9: Effective Date */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label
                  htmlFor="effectiveDate"
                  className="w-72 shrink-0 text-sm font-medium text-foreground"
                >
                  Effective Date
                </Label>
                <div className="flex items-center">
                  <Controller
                    control={control}
                    name="effectiveDate"
                    render={({ field }) => (
                      <Switch
                        id="effectiveDate"
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Row 10: End Date */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label
                  htmlFor="endDate"
                  className="w-72 shrink-0 text-sm font-medium text-foreground"
                >
                  End Date
                </Label>
                <div className="flex items-center">
                  <Controller
                    control={control}
                    name="endDate"
                    render={({ field }) => (
                      <Switch
                        id="endDate"
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Row 11: Created By */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label
                  htmlFor="createdBy"
                  className="w-72 shrink-0 text-sm font-medium text-foreground"
                >
                  Created By
                </Label>
                <div className="w-full sm:w-[460px]">
                  <Input
                    id="createdBy"
                    placeholder="Enter Created By"
                    {...register("createdBy")}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Row 12: Created Date */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label
                  htmlFor="createdDate"
                  className="w-72 shrink-0 text-sm font-medium text-foreground"
                >
                  Created Date
                </Label>
                <div className="flex items-center">
                  <Controller
                    control={control}
                    name="createdDate"
                    render={({ field }) => (
                      <Switch
                        id="createdDate"
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Row 13: Last Updated By */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label
                  htmlFor="lastUpdatedBy"
                  className="w-72 shrink-0 text-sm font-medium text-foreground"
                >
                  Last Updated By
                </Label>
                <div className="w-full sm:w-[460px]">
                  <Input
                    id="lastUpdatedBy"
                    placeholder="Enter Last Updated By"
                    {...register("lastUpdatedBy")}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Row 14: Last Updated Date */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <Label
                  htmlFor="lastUpdatedDate"
                  className="w-72 shrink-0 text-sm font-medium text-foreground"
                >
                  Last Updated Date
                </Label>
                <div className="flex items-center">
                  <Controller
                    control={control}
                    name="lastUpdatedDate"
                    render={({ field }) => (
                      <Switch
                        id="lastUpdatedDate"
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Separator & Actions stretching full width */}
            <div className="pt-6 border-t border-border flex items-center justify-end gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                className="h-10 px-6 rounded-lg font-medium"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="h-10 px-6 rounded-lg bg-[#1b2559] hover:bg-[#1b2559]/90 text-white font-medium disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Page>
  );
}

export default BusinessUnitFormPage;
