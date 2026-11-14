import { UnsavedChangesModal } from "@/features/master-data/shared/unsaved-changes-modal";
import {
  cashflowCategorySchema,
  useCreateCashflowCategoryMutation,
  useGetCashflowCategoryById,
  useUpdateCashflowCategoryMutation,
  type CashflowCategoryResponse,
} from "../data";
import {
  CASHFLOW_CATEGORY_CREATE_PAGE_TITLE,
  CASHFLOW_CATEGORY_CREATE_PERMISSION,
  CASHFLOW_CATEGORY_CREATE_URL,
  CASHFLOW_CATEGORY_DETAIL_PAGE_TITLE,
  CASHFLOW_CATEGORY_EDIT_PAGE_TITLE,
  CASHFLOW_CATEGORY_LIST_PAGE_TITLE,
  CASHFLOW_CATEGORY_READ_PERMISSION,
  CASHFLOW_CATEGORY_UPDATE_PERMISSION,
  CASHFLOW_CATEGORY_URL,
  getCashflowCategoryDetailUrl,
  getCashflowCategoryEditUrl,
} from "../data/cashflow-category.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { setFormErrorsFromApi } from "@railfinance/core/lib";
import {
  Button,
  Input,
  Label,
  Page,
  PageHeader,
  Separator,
  Textarea,
  Visibility,
} from "@railfinance/core";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import type { z } from "zod";

type CashflowCategoryFormMode = "create" | "edit" | "show";
type CashflowCategoryFormInput = z.input<typeof cashflowCategorySchema>;
type CashflowCategoryFormValues = z.output<typeof cashflowCategorySchema>;

const EMPTY_VALUES: CashflowCategoryFormInput = {
  code: "",
  name: "",
  description: "",
};

function getDefaultValues(
  record?: Partial<CashflowCategoryResponse>,
): CashflowCategoryFormInput {
  return {
    code: record?.code || "",
    name: record?.name || "",
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

function CashflowCategoryEditor({
  mode,
  initialValues,
  recordId,
}: Readonly<{
  mode: "create" | "edit";
  initialValues: CashflowCategoryFormInput;
  recordId?: number;
}>) {
  const navigate = useNavigate();
  const [showUnsaved, setShowUnsaved] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CashflowCategoryFormInput, unknown, CashflowCategoryFormValues>({
    resolver: zodResolver(cashflowCategorySchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const createMutation = useCreateCashflowCategoryMutation({
    onSuccess: () => navigate(CASHFLOW_CATEGORY_URL),
    onError: (error) => setFormErrorsFromApi(error, setError),
  });
  const updateMutation = useUpdateCashflowCategoryMutation({
    onSuccess: () => navigate(CASHFLOW_CATEGORY_URL),
    onError: (error) => setFormErrorsFromApi(error, setError),
  });
  const pending = createMutation.isPending || updateMutation.isPending;
  const name = useWatch({ control, name: "name" });
  const code = useWatch({ control, name: "code" });
  const canSave = Boolean(code?.trim() && name?.trim());

  const onSubmit = (data: CashflowCategoryFormValues) => {
    if (mode === "create") {
      createMutation.mutate(data);
      return;
    }
    if (recordId) updateMutation.mutate({ id: recordId, data });
  };

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
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
            placeholder="Enter code"
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
            rows={10}
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
            navigate(CASHFLOW_CATEGORY_URL);
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
        onDiscard={() => navigate(CASHFLOW_CATEGORY_URL)}
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

function getCashflowCategoryPageTitle(mode: CashflowCategoryFormMode) {
  if (mode === "create") return CASHFLOW_CATEGORY_CREATE_PAGE_TITLE;
  if (mode === "edit") return CASHFLOW_CATEGORY_EDIT_PAGE_TITLE;
  return CASHFLOW_CATEGORY_DETAIL_PAGE_TITLE;
}

function getCashflowCategoryPermission(mode: CashflowCategoryFormMode) {
  if (mode === "create") return CASHFLOW_CATEGORY_CREATE_PERMISSION;
  if (mode === "edit") return CASHFLOW_CATEGORY_UPDATE_PERMISSION;
  return CASHFLOW_CATEGORY_READ_PERMISSION;
}

function getCashflowCategoryPageUrl(
  mode: CashflowCategoryFormMode,
  hasRecordId: boolean,
  recordId: number,
) {
  if (mode === "create") return CASHFLOW_CATEGORY_CREATE_URL;
  if (mode === "edit" && hasRecordId) {
    return getCashflowCategoryEditUrl(recordId);
  }
  if (hasRecordId) return getCashflowCategoryDetailUrl(recordId);
  return CASHFLOW_CATEGORY_URL;
}

interface CashflowCategoryBodyProps {
  mode: CashflowCategoryFormMode;
  record?: CashflowCategoryResponse;
  needsRecord: boolean;
  hasRecordId: boolean;
  isLoading: boolean;
  isError: boolean;
}

function CashflowCategoryBody({
  mode,
  record,
  needsRecord,
  hasRecordId,
  isLoading,
  isError,
}: Readonly<CashflowCategoryBodyProps>) {
  const navigate = useNavigate();

  if (needsRecord && !hasRecordId) {
    return (
      <p className="text-sm text-destructive" role="alert">
        Cashflow Category not found.
      </p>
    );
  }
  if (needsRecord && isLoading) {
    return (
      <output className="block py-12 text-center text-sm text-muted-foreground">
        Loading cashflow category...
      </output>
    );
  }
  if (needsRecord && (isError || !record)) {
    return (
      <div>
        <p className="text-sm text-destructive" role="alert">
          Failed to load cashflow category.
        </p>
        <Button
          type="button"
          variant="link"
          className="mt-4 px-0"
          onClick={() => navigate(CASHFLOW_CATEGORY_URL)}
        >
          Back to Cashflow Category
        </Button>
      </div>
    );
  }
  if (mode === "show" && record) {
    return (
      <div className="w-full space-y-8">
        <div className="w-full space-y-5">
          <DetailRow label="Code" value={record.code} />
          <DetailRow label="Name" value={record.name} />
          <DetailRow label="Description" value={record.description} />
        </div>
        <div className="flex w-full items-center justify-end gap-3 border-t border-border pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(CASHFLOW_CATEGORY_URL)}
          >
            Back
          </Button>
          <Visibility permission={CASHFLOW_CATEGORY_UPDATE_PERMISSION}>
            <Button
              type="button"
              onClick={() => navigate(getCashflowCategoryEditUrl(record.id))}
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
      <CashflowCategoryEditor
        mode={mode === "edit" ? "edit" : "create"}
        initialValues={record ? getDefaultValues(record) : EMPTY_VALUES}
        recordId={record?.id}
      />
    );
  }
  return null;
}

export function CashflowCategoryFormPage({
  mode,
}: Readonly<{ mode: CashflowCategoryFormMode }>) {
  const { id } = useParams<{ id?: string }>();
  const recordId = Number(id);
  const hasRecordId = Number.isFinite(recordId) && recordId > 0;
  const needsRecord = mode !== "create";
  const title = getCashflowCategoryPageTitle(mode);
  const permission = getCashflowCategoryPermission(mode);
  const currentUrl = getCashflowCategoryPageUrl(mode, hasRecordId, recordId);
  const { data: detailData, isLoading, isError } = useGetCashflowCategoryById(
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
        { title: CASHFLOW_CATEGORY_LIST_PAGE_TITLE, url: CASHFLOW_CATEGORY_URL },
        { title, url: currentUrl },
      ]}
    >
      <div className="w-full space-y-6">
        <PageHeader title={title} withBackButton={false} />
        <Separator className="w-full" />
        <CashflowCategoryBody
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

export function CashflowCategoryCreatePage() {
  return <CashflowCategoryFormPage mode="create" />;
}

export function CashflowCategoryEditPage() {
  return <CashflowCategoryFormPage mode="edit" />;
}

export function CashflowCategoryShowPage() {
  return <CashflowCategoryFormPage mode="show" />;
}

export default CashflowCategoryFormPage;
