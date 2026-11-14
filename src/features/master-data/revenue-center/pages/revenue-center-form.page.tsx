import {
  revenueCenterSchema,
  useCreateRevenueCenterMutation,
  useGetRevenueCenterById,
  useUpdateRevenueCenterMutation,
  type RevenueCenterResponse,
} from "../data";
import {
  REVENUE_CENTER_CREATE_PAGE_TITLE,
  REVENUE_CENTER_CREATE_PERMISSION,
  REVENUE_CENTER_CREATE_URL,
  REVENUE_CENTER_DETAIL_PAGE_TITLE,
  REVENUE_CENTER_EDIT_PAGE_TITLE,
  REVENUE_CENTER_LIST_PAGE_TITLE,
  REVENUE_CENTER_READ_PERMISSION,
  REVENUE_CENTER_UPDATE_PERMISSION,
  REVENUE_CENTER_URL,
  getRevenueCenterDetailUrl,
  getRevenueCenterEditUrl,
} from "../data/revenue-center.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGetBusinessAreaOptions,
  useGetCompanyOptions,
} from "@railfinance/core/masterdata";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import type { OptionItem } from "@railfinance/core/types";
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
  Visibility,
} from "@railfinance/core";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import type { z } from "zod";

type RevenueCenterFormMode = "create" | "edit" | "show";
type RevenueCenterFormInput = z.input<typeof revenueCenterSchema>;
type RevenueCenterFormValues = z.output<typeof revenueCenterSchema>;

const EMPTY_VALUES: RevenueCenterFormInput = {
  revenueCenterCode: "",
  revenueCenterName: "",
  parentRevenueCenter: "",
  segment: "",
  businessUnit: "",
  isActive: false,
};

function getDefaultRevenueCenterValues(
  defaultValues?: Partial<RevenueCenterResponse>,
): RevenueCenterFormInput {
  return {
    revenueCenterCode: defaultValues?.code || "",
    revenueCenterName: defaultValues?.name || "",
    parentRevenueCenter: defaultValues?.parent || "",
    segment: defaultValues?.segmentId || "",
    businessUnit: defaultValues?.businessUnitId || "",
    isActive: defaultValues?.isActive ?? false,
  };
}

function toSelectOptions(items?: OptionItem[]) {
  return (
    items?.map((item) => ({
      value: item.label,
      label: item.label,
    })) ?? []
  );
}

function ensureOption(
  options: { value: string; label: string }[],
  current?: string,
) {
  if (!current || options.some((option) => option.value === current)) {
    return options;
  }
  return [{ value: current, label: current }, ...options];
}

function DetailRow({
  label,
  value,
}: Readonly<{ label: string; value?: string | null }>) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <Label className="w-72 shrink-0 text-sm font-medium text-foreground">
        {label}
      </Label>
      <span className="text-sm text-foreground">{value || "—"}</span>
    </div>
  );
}

function RevenueCenterEditor({
  mode,
  initialValues,
  recordId,
}: Readonly<{
  mode: "create" | "edit";
  initialValues: RevenueCenterFormInput;
  recordId?: number;
}>) {
  const navigate = useNavigate();
  const { data: companiesData } = useGetCompanyOptions();
  const { data: businessAreasData } = useGetBusinessAreaOptions();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<RevenueCenterFormInput, unknown, RevenueCenterFormValues>({
    resolver: zodResolver(revenueCenterSchema),
    defaultValues: initialValues,
  });

  const createMutation = useCreateRevenueCenterMutation({
    onSuccess: () => {
      navigate(REVENUE_CENTER_URL);
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdateRevenueCenterMutation({
    onSuccess: () => {
      navigate(REVENUE_CENTER_URL);
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const parentOptions = ensureOption(
    toSelectOptions(companiesData?.data),
    initialValues.parentRevenueCenter || undefined,
  );
  const segmentOptions = ensureOption(
    toSelectOptions(companiesData?.data),
    initialValues.segment || undefined,
  );
  const businessUnitOptions = ensureOption(
    toSelectOptions(businessAreasData?.data),
    initialValues.businessUnit || undefined,
  );

  const onSubmit = (data: RevenueCenterFormValues) => {
    const requestData = {
      code: data.revenueCenterCode,
      name: data.revenueCenterName,
      parent: data.parentRevenueCenter ?? "",
      segmentId: data.segment ?? "",
      businessUnitId: data.businessUnit ?? "",
      isActive: data.isActive,
    };

    if (mode === "create") {
      createMutation.mutate(requestData);
      return;
    }

    if (recordId) {
      updateMutation.mutate({
        id: recordId,
        data: requestData,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
      <div className="w-full space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Label
            htmlFor="revenueCenterCode"
            className="w-72 shrink-0 text-sm font-medium text-foreground"
          >
            Revenue Center Code <span className="text-red-500">*</span>
          </Label>
          <div className="w-full sm:w-[460px]">
            <Input
              id="revenueCenterCode"
              placeholder="Enter Revenue Center Code"
              disabled={isSubmitting}
              maxLength={50}
              className={cn(
                errors.revenueCenterCode &&
                  "border-red-500 focus-visible:ring-red-500",
              )}
              {...register("revenueCenterCode")}
            />
            {errors.revenueCenterCode && (
              <p className="mt-1 text-xs text-red-500">
                {errors.revenueCenterCode.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
          <Label
            htmlFor="revenueCenterName"
            className="w-72 shrink-0 text-sm font-medium text-foreground sm:pt-2.5"
          >
            Revenue Center Name <span className="text-red-500">*</span>
          </Label>
          <div className="w-full sm:w-[460px]">
            <Textarea
              id="revenueCenterName"
              placeholder="Enter Revenue Center Name"
              disabled={isSubmitting}
              maxLength={255}
              className={cn(
                "resize-none",
                errors.revenueCenterName &&
                  "border-red-500 focus-visible:ring-red-500",
              )}
              {...register("revenueCenterName")}
            />
            {errors.revenueCenterName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.revenueCenterName.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Label className="w-72 shrink-0 text-sm font-medium text-foreground">
            Parent Revenue Center
          </Label>
          <div className="w-full sm:w-[460px]">
            <Controller
              control={control}
              name="parentRevenueCenter"
              render={({ field }) => (
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={!!errors.parentRevenueCenter}
                  >
                    <SelectValue placeholder="Select Parent Revenue Center" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.parentRevenueCenter && (
              <p className="mt-1 text-xs text-red-500">
                {errors.parentRevenueCenter.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Label className="w-72 shrink-0 text-sm font-medium text-foreground">
            Segment <span className="text-red-500">*</span>
          </Label>
          <div className="w-full sm:w-[460px]">
            <Controller
              control={control}
              name="segment"
              render={({ field }) => (
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full" aria-invalid={!!errors.segment}>
                    <SelectValue placeholder="Select Segment" />
                  </SelectTrigger>
                  <SelectContent>
                    {segmentOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.segment && (
              <p className="mt-1 text-xs text-red-500">{errors.segment.message}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Label className="w-72 shrink-0 text-sm font-medium text-foreground">
            Business Unit ID <span className="text-red-500">*</span>
          </Label>
          <div className="w-full sm:w-[460px]">
            <Controller
              control={control}
              name="businessUnit"
              render={({ field }) => (
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={!!errors.businessUnit}
                  >
                    <SelectValue placeholder="Select Business Unit ID" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessUnitOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.businessUnit && (
              <p className="mt-1 text-xs text-red-500">
                {errors.businessUnit.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Label className="w-72 shrink-0 text-sm font-medium text-foreground">
            Status <span className="text-red-500">*</span>
          </Label>
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <Switch
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
                disabled={isSubmitting}
              />
            )}
          />
        </div>
      </div>

      <div className="flex w-full items-center justify-end gap-3 border-t border-border pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(REVENUE_CENTER_URL)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Save
        </Button>
      </div>
    </form>
  );
}

function getRevenueCenterPageTitle(mode: RevenueCenterFormMode) {
  if (mode === "create") return REVENUE_CENTER_CREATE_PAGE_TITLE;
  if (mode === "edit") return REVENUE_CENTER_EDIT_PAGE_TITLE;
  return REVENUE_CENTER_DETAIL_PAGE_TITLE;
}

function getRevenueCenterPermission(mode: RevenueCenterFormMode) {
  if (mode === "create") return REVENUE_CENTER_CREATE_PERMISSION;
  if (mode === "edit") return REVENUE_CENTER_UPDATE_PERMISSION;
  return REVENUE_CENTER_READ_PERMISSION;
}

function getRevenueCenterPageUrl(
  mode: RevenueCenterFormMode,
  hasRecordId: boolean,
  recordId: number,
) {
  if (mode === "create") return REVENUE_CENTER_CREATE_URL;
  if (mode === "edit" && hasRecordId) return getRevenueCenterEditUrl(recordId);
  if (hasRecordId) return getRevenueCenterDetailUrl(recordId);
  return REVENUE_CENTER_URL;
}

interface RevenueCenterBodyProps {
  mode: RevenueCenterFormMode;
  record?: RevenueCenterResponse;
  needsRecord: boolean;
  hasRecordId: boolean;
  isLoadingDetail: boolean;
  isError: boolean;
  onBack: () => void;
}

function RevenueCenterBody({
  mode,
  record,
  needsRecord,
  hasRecordId,
  isLoadingDetail,
  isError,
  onBack,
}: Readonly<RevenueCenterBodyProps>) {
  const navigate = useNavigate();

  if (needsRecord && !hasRecordId) {
    return (
      <p className="text-sm text-destructive" role="alert">
        Revenue Center not found.
      </p>
    );
  }
  if (needsRecord && isLoadingDetail) {
    return (
      <output className="block py-12 text-center text-sm text-muted-foreground">
        Loading revenue center...
      </output>
    );
  }
  if (needsRecord && (isError || !record)) {
    return (
      <div>
        <p className="text-sm text-destructive" role="alert">
          Failed to load revenue center.
        </p>
        <Button type="button" variant="link" className="mt-4 px-0" onClick={onBack}>
          Back to Revenue Center
        </Button>
      </div>
    );
  }
  if (mode === "show" && record) {
    return (
      <div className="w-full space-y-8">
        <div className="w-full space-y-5">
          <DetailRow label="Revenue Center Code" value={record.code} />
          <DetailRow label="Revenue Center Name" value={record.name} />
          <DetailRow label="Parent Revenue Center" value={record.parent} />
          <DetailRow label="Segment" value={record.segmentId} />
          <DetailRow label="Business Unit ID" value={record.businessUnitId} />
          <DetailRow
            label="Status"
            value={record.isActive ? "Active" : "Inactive"}
          />
        </div>
        <div className="flex w-full items-center justify-end gap-3 border-t border-border pt-6">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Visibility permission={REVENUE_CENTER_UPDATE_PERMISSION}>
            <Button
              type="button"
              onClick={() => navigate(getRevenueCenterEditUrl(record.id))}
            >
              Edit
            </Button>
          </Visibility>
        </div>
      </div>
    );
  }
  if (record || mode === "create") {
    return (
      <RevenueCenterEditor
        mode={mode === "edit" ? "edit" : "create"}
        initialValues={
          record ? getDefaultRevenueCenterValues(record) : EMPTY_VALUES
        }
        recordId={record?.id}
      />
    );
  }
  return null;
}

export function RevenueCenterFormPage({
  mode,
}: Readonly<{ mode: RevenueCenterFormMode }>) {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const recordId = Number(id);
  const hasRecordId = Number.isFinite(recordId) && recordId > 0;
  const needsRecord = mode !== "create";

  const title = getRevenueCenterPageTitle(mode);
  const permission = getRevenueCenterPermission(mode);
  const currentUrl = getRevenueCenterPageUrl(mode, hasRecordId, recordId);

  const { data: detailData, isLoading: isLoadingDetail, isError } =
    useGetRevenueCenterById(hasRecordId ? recordId : 0, {
      enabled: needsRecord && hasRecordId,
    });
  const record = detailData?.data;

  const handleBack = () => {
    navigate(REVENUE_CENTER_URL);
  };

  return (
    <Page
      type="base"
      title={title}
      permission={permission}
      breadcrumbs={[
        { title: "Master Data", url: "#" },
        { title: REVENUE_CENTER_LIST_PAGE_TITLE, url: REVENUE_CENTER_URL },
        { title, url: currentUrl },
      ]}
    >
      <div className="w-full space-y-6">
        <PageHeader title={title} withBackButton={false} />
        <Separator className="w-full" />
        <RevenueCenterBody
          mode={mode}
          record={record}
          needsRecord={needsRecord}
          hasRecordId={hasRecordId}
          isLoadingDetail={isLoadingDetail}
          isError={isError}
          onBack={handleBack}
        />
      </div>
    </Page>
  );
}

export function RevenueCenterCreatePage() {
  return <RevenueCenterFormPage mode="create" />;
}

export function RevenueCenterEditPage() {
  return <RevenueCenterFormPage mode="edit" />;
}

export function RevenueCenterShowPage() {
  return <RevenueCenterFormPage mode="show" />;
}

export default RevenueCenterFormPage;
