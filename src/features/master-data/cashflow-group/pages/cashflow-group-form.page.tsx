import { cashflowCategoryService } from "@/features/master-data/cashflow-category/data/cashflow-category.service";
import { UnsavedChangesModal } from "@/features/master-data/shared/unsaved-changes-modal";
import {
  cashflowGroupSchema,
  useCreateCashflowGroupMutation,
  useGetCashflowGroupById,
  useUpdateCashflowGroupMutation,
  type CashflowGroupResponse,
} from "../data";
import {
  CASHFLOW_GROUP_CREATE_PAGE_TITLE,
  CASHFLOW_GROUP_CREATE_PERMISSION,
  CASHFLOW_GROUP_CREATE_URL,
  CASHFLOW_GROUP_DETAIL_PAGE_TITLE,
  CASHFLOW_GROUP_EDIT_PAGE_TITLE,
  CASHFLOW_GROUP_LIST_PAGE_TITLE,
  CASHFLOW_GROUP_READ_PERMISSION,
  CASHFLOW_GROUP_UPDATE_PERMISSION,
  CASHFLOW_GROUP_URL,
  CASHFLOW_TYPE_OPTIONS,
  getCashflowGroupDetailUrl,
  getCashflowGroupEditUrl,
  getCashflowTypeLabel,
  getExceptionLabel,
} from "../data/cashflow-group.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { setFormErrorsFromApi } from "@railfinance/core/lib";
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
  Textarea,
  Visibility,
} from "@railfinance/core";
import { RadioGroup, RadioGroupItem } from "@railfinance/core/ui/radio-group";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import type { z } from "zod";

type CashflowGroupFormMode = "create" | "edit" | "show";
type CashflowGroupFormInput = z.input<typeof cashflowGroupSchema>;
type CashflowGroupFormValues = z.output<typeof cashflowGroupSchema>;

const EMPTY_VALUES: CashflowGroupFormInput = {
  code: "",
  name: "",
  cashflowGroupId: "",
  cashflowType: "RECIPIENT",
  exception: "1",
  description: "",
};

function toExceptionFormValue(value?: string | boolean): string {
  if (value === true || value === "1") return "1";
  if (value === false || value === "0") return "0";
  return "1";
}

function getDefaultValues(
  record?: Partial<CashflowGroupResponse>,
): CashflowGroupFormInput {
  return {
    code: record?.code || "",
    name: record?.name || "",
    cashflowGroupId: record?.cashflowGroupId || "",
    cashflowType: record?.cashflowType || "RECIPIENT",
    exception: toExceptionFormValue(record?.exception),
    description: record?.description || "",
  };
}

function DetailRow({
  label,
  value,
}: Readonly<{ label: string; value?: string | null }>) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
      <Label className="w-72 shrink-0 text-sm font-medium text-foreground">
        {label}
      </Label>
      <span className="text-sm text-foreground">{value || "—"}</span>
    </div>
  );
}

function CashflowGroupEditor({
  mode,
  initialValues,
  recordId,
  selectedGroupName,
}: Readonly<{
  mode: "create" | "edit";
  initialValues: CashflowGroupFormInput;
  recordId?: number;
  selectedGroupName?: string;
}>) {
  const navigate = useNavigate();
  const [showUnsaved, setShowUnsaved] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CashflowGroupFormInput, unknown, CashflowGroupFormValues>({
    resolver: zodResolver(cashflowGroupSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });
  const { data: categoryOptions } = useQuery({
    queryKey: ["cashflowCategories", "cashflow-group-options"],
    queryFn: () =>
      cashflowCategoryService.listCashflowCategories({ page: 0, size: 200 }),
  });

  const createMutation = useCreateCashflowGroupMutation({
    onSuccess: () => navigate(CASHFLOW_GROUP_URL),
    onError: (error) => setFormErrorsFromApi(error, setError),
  });
  const updateMutation = useUpdateCashflowGroupMutation({
    onSuccess: () => navigate(CASHFLOW_GROUP_URL),
    onError: (error) => setFormErrorsFromApi(error, setError),
  });
  const pending = createMutation.isPending || updateMutation.isPending;
  const name = useWatch({ control, name: "name" });
  const code = useWatch({ control, name: "code" });
  const cashflowGroupId = useWatch({ control, name: "cashflowGroupId" });
  const canSave = Boolean(code?.trim() && name?.trim() && cashflowGroupId?.trim());
  const options = (categoryOptions?.data?.content ?? []).filter(
    (option) => option.code,
  );
  const hasSelectedOption = options.some(
    (option) => option.code === cashflowGroupId,
  );

  const onSubmit = (data: CashflowGroupFormValues) => {
    const selected = options.find((option) => option.code === data.cashflowGroupId);
    const payload = {
      ...data,
      cashflowGroupName: selected?.name || selectedGroupName || data.cashflowGroupId,
    };
    if (mode === "create") {
      createMutation.mutate(payload);
      return;
    }
    if (recordId) updateMutation.mutate({ id: recordId, data: payload });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8">
          <Label
            htmlFor="cashflowGroupId"
            className="w-56 shrink-0 text-sm"
          >
            Cashflow Category <span className="text-red-500">*</span>
          </Label>
          <div className="w-full max-w-xl">
            <Controller
              name="cashflowGroupId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  disabled={pending}
                >
                  <SelectTrigger id="cashflowGroupId" className="w-full">
                    <SelectValue placeholder="Select Cashflow Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.value && !hasSelectedOption && (
                      <SelectItem value={field.value}>
                        {selectedGroupName || field.value}
                      </SelectItem>
                    )}
                    {options.map((option) => (
                      <SelectItem key={option.id} value={option.code}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.cashflowGroupId && (
              <p className="mt-1 text-xs text-red-500">
                {errors.cashflowGroupId.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8">
          <Label
            className="w-56 shrink-0 text-sm">
            Cashflow Category Code
          </Label>
          <span className="text-sm text-foreground">{cashflowGroupId || "-"}</span>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8">
          <Label
            htmlFor="code"
            className="w-56 shrink-0 text-sm"
          >
            Code <span className="text-red-500">*</span>
          </Label>
          <div className="w-full max-w-xl">
            <Input
              id="code"
              placeholder="Enter Code"
              maxLength={50}
              disabled={pending}
              aria-invalid={!!errors.code}
              {...register("code")}
            />
            {errors.code && (
              <p className="mt-1 text-xs text-red-500">{errors.code.message}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8">
          <Label
            htmlFor="name"
            className="w-56 shrink-0 text-sm"
          >
            Name <span className="text-red-500">*</span>
          </Label>
          <div className="w-full max-w-xl">
            <Input
              id="name"
              placeholder="Enter name"
              maxLength={200}
              disabled={pending}
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8">
          <Label className="w-56 shrink-0 text-sm">
            Cashflow type <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="cashflowType"
            control={control}
            render={({ field }) => (
              <RadioGroup
                variant="success"
                value={field.value}
                onValueChange={field.onChange}
                disabled={pending}
                className="flex w-auto flex-row items-center gap-6"
              >
                {CASHFLOW_TYPE_OPTIONS.map((option) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <RadioGroupItem
                      value={option.value}
                      id={`cashflow-type-${option.value}`}
                    />
                    <Label
                      htmlFor={`cashflow-type-${option.value}`}
                      className="font-normal"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8">
          <Label className="w-56 shrink-0 text-sm">
            Exception <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="exception"
            control={control}
            render={({ field }) => (
              <RadioGroup
                variant="success"
                value={toExceptionFormValue(field.value)}
                onValueChange={field.onChange}
                disabled={pending}
                className="flex w-auto flex-row items-center gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="1" id="exception-yes" />
                  <Label htmlFor="exception-yes" className="font-normal">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="0" id="exception-no" />
                  <Label htmlFor="exception-no" className="font-normal">
                    No
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-8">
          <Label
            htmlFor="description"
            className="w-56 shrink-0 pt-2 text-sm"
          >
            Description
          </Label>
          <div className="w-full">
            <Textarea
              id="description"
              rows={4}
              placeholder="Enter description"
              maxLength={500}
              disabled={pending}
              className="resize-y"
              aria-invalid={!!errors.description}
              {...register("description")}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex w-full items-center justify-end gap-3 border-t border-border pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (mode === "edit" && isDirty) {
                setShowUnsaved(true);
                return;
              }
              navigate(CASHFLOW_GROUP_URL);
            }}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={pending || isSubmitting || !canSave}>
            Save
          </Button>
        </div>
      </form>
      {mode === "edit" && (
        <UnsavedChangesModal
          open={showUnsaved}
          onOpenChange={setShowUnsaved}
          onDiscard={() => navigate(CASHFLOW_GROUP_URL)}
          onSave={() => {
            setShowUnsaved(false);
            void handleSubmit(onSubmit)();
          }}
          saveDisabled={pending || isSubmitting || !canSave}
          compact
        />
      )}
    </>
  );
}

function getCashflowGroupPageTitle(mode: CashflowGroupFormMode) {
  if (mode === "create") return CASHFLOW_GROUP_CREATE_PAGE_TITLE;
  if (mode === "edit") return CASHFLOW_GROUP_EDIT_PAGE_TITLE;
  return CASHFLOW_GROUP_DETAIL_PAGE_TITLE;
}

function getCashflowGroupPermission(mode: CashflowGroupFormMode) {
  if (mode === "create") return CASHFLOW_GROUP_CREATE_PERMISSION;
  if (mode === "edit") return CASHFLOW_GROUP_UPDATE_PERMISSION;
  return CASHFLOW_GROUP_READ_PERMISSION;
}

function getCashflowGroupPageUrl(
  mode: CashflowGroupFormMode,
  hasRecordId: boolean,
  recordId: number,
) {
  if (mode === "create") return CASHFLOW_GROUP_CREATE_URL;
  if (mode === "edit" && hasRecordId) return getCashflowGroupEditUrl(recordId);
  if (hasRecordId) return getCashflowGroupDetailUrl(recordId);
  return CASHFLOW_GROUP_URL;
}

interface CashflowGroupBodyProps {
  mode: CashflowGroupFormMode;
  record?: CashflowGroupResponse;
  needsRecord: boolean;
  hasRecordId: boolean;
  isLoading: boolean;
  isError: boolean;
}

function CashflowGroupBody({
  mode,
  record,
  needsRecord,
  hasRecordId,
  isLoading,
  isError,
}: Readonly<CashflowGroupBodyProps>) {
  const navigate = useNavigate();

  if (needsRecord && !hasRecordId) {
    return (
      <p className="text-sm text-destructive" role="alert">
        Cashflow Group not found.
      </p>
    );
  }
  if (needsRecord && isLoading) {
    return (
      <output className="block py-12 text-center text-sm text-muted-foreground">
        Loading cashflow group...
      </output>
    );
  }
  if (needsRecord && (isError || !record)) {
    return (
      <div>
        <p className="text-sm text-destructive" role="alert">
          Failed to load cashflow group.
        </p>
        <Button
          type="button"
          variant="link"
          className="mt-4 px-0"
          onClick={() => navigate(CASHFLOW_GROUP_URL)}
        >
          Back to Cashflow Group
        </Button>
      </div>
    );
  }
  if (mode === "show" && record) {
    return (
      <div className="w-full space-y-8">
        <div className="w-full space-y-5">
          <DetailRow label="Cashflow Category" value={record.cashflowGroupName} />
          <DetailRow
            label="Cashflow Category Code"
            value={record.cashflowGroupId || "-"}
          />
          <DetailRow label="Code" value={record.code} />
          <DetailRow label="Name" value={record.name} />
          <DetailRow
            label="Cashflow type"
            value={getCashflowTypeLabel(record.cashflowType)}
          />
          <DetailRow label="Exception" value={getExceptionLabel(record.exception)} />
          <DetailRow label="Description" value={record.description} />
        </div>
        <div className="flex w-full items-center justify-end gap-3 border-t border-border pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(CASHFLOW_GROUP_URL)}
          >
            Back
          </Button>
          <Visibility permission={CASHFLOW_GROUP_UPDATE_PERMISSION}>
            <Button
              type="button"
              onClick={() => navigate(getCashflowGroupEditUrl(record.id))}
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
      <CashflowGroupEditor
        mode={mode === "edit" ? "edit" : "create"}
        initialValues={record ? getDefaultValues(record) : EMPTY_VALUES}
        recordId={record?.id}
        selectedGroupName={record?.cashflowGroupName}
      />
    );
  }
  return null;
}

export function CashflowGroupFormPage({
  mode,
}: Readonly<{ mode: CashflowGroupFormMode }>) {
  const { id } = useParams<{ id?: string }>();
  const recordId = Number(id);
  const hasRecordId = Number.isFinite(recordId) && recordId > 0;
  const needsRecord = mode !== "create";
  const title = getCashflowGroupPageTitle(mode);
  const permission = getCashflowGroupPermission(mode);
  const currentUrl = getCashflowGroupPageUrl(mode, hasRecordId, recordId);
  const { data: detailData, isLoading, isError } = useGetCashflowGroupById(
    hasRecordId ? recordId : 0,
    { enabled: needsRecord && hasRecordId },
  );
  const record = detailData?.data;

  return (
    <Page
      type="base"
      title={title}
      permission={import.meta.env.DEV ? undefined : permission}
      breadcrumbs={[
        { title: "Master Data", url: "#" },
        { title: CASHFLOW_GROUP_LIST_PAGE_TITLE, url: CASHFLOW_GROUP_URL },
        { title, url: currentUrl },
      ]}
    >
      <div className="w-full space-y-6">
        <PageHeader title={title} withBackButton={false} />
        <Separator className="w-full" />
        <CashflowGroupBody
          mode={mode}
          record={record}
          needsRecord={needsRecord}
          hasRecordId={hasRecordId}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </Page>
  );
}

export function CashflowGroupCreatePage() {
  return <CashflowGroupFormPage mode="create" />;
}

export function CashflowGroupEditPage() {
  return <CashflowGroupFormPage mode="edit" />;
}

export function CashflowGroupShowPage() {
  return <CashflowGroupFormPage mode="show" />;
}

export default CashflowGroupFormPage;
