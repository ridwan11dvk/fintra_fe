import { setFormErrorsFromApi, apiClient } from "@railfinance/core/lib";
import { UnsavedChangesModal } from "@/features/master-data/shared/unsaved-changes-modal";
import {
  workCatalogSchema,
  useCreateWorkCatalogMutation,
  useGetWorkCatalogById,
  useUpdateWorkCatalogMutation,
  type WorkCatalogApplicableTax,
  type WorkCatalogResponse,
  type WorkCatalogTaxSubject,
} from "../data";
import {
  WORK_CATALOG_CREATE_PAGE_TITLE,
  WORK_CATALOG_CREATE_PERMISSION,
  WORK_CATALOG_CREATE_URL,
  WORK_CATALOG_DETAIL_PAGE_TITLE,
  WORK_CATALOG_EDIT_PAGE_TITLE,
  WORK_CATALOG_LIST_PAGE_TITLE,
  WORK_CATALOG_READ_PERMISSION,
  WORK_CATALOG_UPDATE_PERMISSION,
  WORK_CATALOG_URL,
  getWorkCatalogDetailUrl,
  getWorkCatalogEditUrl,
} from "../data/work-catalog.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetActiveTaxRates } from "@railfinance/core/masterdata";
import type { TaxRateResponse } from "@railfinance/core/masterdata";
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
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Controller, useFieldArray, useForm, useWatch, type Control, type UseFormSetValue } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import type { z } from "zod";

type WorkCatalogFormMode = "create" | "edit" | "show";
type WorkCatalogFormInput = z.input<typeof workCatalogSchema>;
type WorkCatalogFormValues = z.output<typeof workCatalogSchema>;
type TaxSubjectName = "businessEntityTaxes" | "individualTaxes";

interface TaxOption {
  id: string;
  name: string;
  coefficient: string;
  ratePercent: string;
}

const EMPTY_TAX = { taxId: "", coefficient: "", ratePercent: "" };

type NamedRef = {
  id?: number | null;
  name?: string | null;
};

type PaymentCategoryMapping = {
  sub?: NamedRef | null;
  group?: NamedRef | null;
  main?: NamedRef | null;
};

type SubCategoryOption = {
  value: string;
  label: string;
  groupCategoryId: string;
  groupCategoryLabel: string;
  mainCategoryId: string;
  mainCategoryLabel: string;
};

const EMPTY_VALUES: WorkCatalogFormInput = {
  workType: "",
  subCategoryId: "",
  groupCategoryId: "",
  mainCategoryId: "",
  cashflowCategoryId: "",
  procurementSchemaId: "",
  description: "",
  businessEntityTaxes: [{ ...EMPTY_TAX }],
  individualTaxes: [{ ...EMPTY_TAX }],
};

function optionLabel(
  options: ReadonlyArray<{ value: string; label: string }>,
  value?: string,
) {
  return options.find((option) => option.value === value)?.label || value;
}

type LookupOptionRow = {
  id?: number | string;
  value?: string;
  label?: string;
  code?: string;
  name?: string;
  alias?: string | null;
};

function readOptionRows(
  payload:
    | LookupOptionRow[]
    | {
        data?: LookupOptionRow[] | { content?: LookupOptionRow[] };
      },
): LookupOptionRow[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (payload?.data && "content" in payload.data) {
    return payload.data.content ?? [];
  }
  return [];
}

function toSelectOption(row: LookupOptionRow) {
  const value = String(
    (row.id != null && row.id !== "" ? row.id : null) ||
      row.value ||
      row.code ||
      row.label ||
      row.name ||
      "",
  );
  const label = String(
    row.label || row.name || row.value || row.code || row.id || "",
  );
  return { value, label };
}

function toNumericId(value: string) {
  const id = Number(value);
  return Number.isFinite(id) ? id : 0;
}

function toOptionalNumericId(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const id = Number(trimmed);
  return Number.isFinite(id) ? id : null;
}

function getWorkCatalogPageTitle(mode: WorkCatalogFormMode) {
  if (mode === "create") return WORK_CATALOG_CREATE_PAGE_TITLE;
  if (mode === "edit") return WORK_CATALOG_EDIT_PAGE_TITLE;
  return WORK_CATALOG_DETAIL_PAGE_TITLE;
}

function getWorkCatalogPermission(mode: WorkCatalogFormMode) {
  if (mode === "create") return WORK_CATALOG_CREATE_PERMISSION;
  if (mode === "edit") return WORK_CATALOG_UPDATE_PERMISSION;
  return WORK_CATALOG_READ_PERMISSION;
}

function getWorkCatalogPageUrl(
  mode: WorkCatalogFormMode,
  hasRecordId: boolean,
  recordId: number,
) {
  if (mode === "create") return WORK_CATALOG_CREATE_URL;
  if (mode === "edit" && hasRecordId) return getWorkCatalogEditUrl(recordId);
  if (hasRecordId) return getWorkCatalogDetailUrl(recordId);
  return WORK_CATALOG_URL;
}

function readPaymentCategoryMappings(
  payload:
    | PaymentCategoryMapping[]
    | {
        data?: PaymentCategoryMapping[];
      },
) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function toSubCategoryOption(
  row: PaymentCategoryMapping,
): SubCategoryOption | null {
  const subId = row.sub?.id;
  if (subId == null) return null;

  return {
    value: String(subId),
    label: String(row.sub?.name || subId),
    groupCategoryId: String(row.group?.id ?? ""),
    groupCategoryLabel: String(row.group?.name || ""),
    mainCategoryId: String(row.main?.id ?? ""),
    mainCategoryLabel: String(row.main?.name || ""),
  };
}

async function listSubWorkCategoryOptions() {
  const response = await apiClient.get<
    | PaymentCategoryMapping[]
    | { data?: PaymentCategoryMapping[] }
  >("/master/payment-categories");

  return readPaymentCategoryMappings(response.data)
    .map(toSubCategoryOption)
    .filter((option): option is SubCategoryOption => option !== null);
}

async function listCashflowCategoryOptions() {
  const response = await apiClient.get<
    | LookupOptionRow[]
    | { data?: LookupOptionRow[] | { content?: LookupOptionRow[] } }
  >("/master/cashflow-categories/options");

  return readOptionRows(response.data)
    .map(toSelectOption)
    .filter((option) => option.value);
}

async function listProcurementSchemaOptions() {
  const response = await apiClient.get<
    | LookupOptionRow[]
    | { data?: LookupOptionRow[] | { content?: LookupOptionRow[] } }
  >("/master/lookup-value/options", {
    params: { typeCode: "PROCUREMENT_SCHEMA" },
  });

  return readOptionRows(response.data)
    .map(toSelectOption)
    .filter((option) => option.value);
}

function formatCoefficient(tax: TaxRateResponse) {
  const numerator = tax.coefficientNumerator;
  const denominator = tax.coefficientDenominator;
  if (numerator == null) return "";
  if (denominator == null || denominator === 1) return String(numerator);
  return `${numerator}/${denominator}`;
}

function toTaxOption(tax: TaxRateResponse): TaxOption {
  return {
    id: String(tax.id),
    name: tax.name,
    coefficient: formatCoefficient(tax),
    ratePercent: tax.ratePercent == null ? "" : String(tax.ratePercent),
  };
}

function formatTaxDetailCoefficient(tax: {
  coefficientNumerator?: number | null;
  coefficientDenominator?: number | null;
  coefficient?: number | string | null;
}) {
  const numerator = tax.coefficientNumerator;
  const denominator = tax.coefficientDenominator;
  if (numerator != null) {
    if (denominator == null || denominator === 1) return String(numerator);
    return `${numerator}/${denominator}`;
  }
  if (tax.coefficient == null) return "";
  return String(tax.coefficient);
}

function taxesForSubject(
  record: Partial<WorkCatalogResponse> | undefined,
  subject: WorkCatalogTaxSubject,
): WorkCatalogApplicableTax[] {
  if (record?.taxes?.length) {
    return record.taxes
      .filter((tax) => tax.taxSubject === subject)
      .map((tax) => ({
        taxId: String(tax.taxRateId),
        taxName: tax.taxRateName ?? tax.taxName ?? undefined,
        coefficient: formatTaxDetailCoefficient(tax),
        ratePercent: tax.ratePercent,
      }));
  }

  return subject === "BADAN_USAHA"
    ? (record?.businessEntityTaxes ?? [])
    : (record?.individualTaxes ?? []);
}

function mapTaxRows(taxes?: WorkCatalogApplicableTax[]) {
  if (!taxes?.length) return [{ ...EMPTY_TAX }];
  return taxes.map((tax) => ({
    taxId: tax.taxId ? String(tax.taxId) : "",
    coefficient: tax.coefficient == null ? "" : String(tax.coefficient),
    ratePercent: tax.ratePercent == null ? "" : String(tax.ratePercent),
  }));
}

function idOrEmpty(value?: number | string | null) {
  if (value == null || value === "") return "";
  return String(value);
}

function refId(ref?: { id?: number | null } | null) {
  return idOrEmpty(ref?.id);
}

function refName(ref?: { name?: string | null } | null) {
  return ref?.name?.trim() || "";
}

function getDefaultWorkCatalogValues(
  defaultValues?: Partial<WorkCatalogResponse>,
): WorkCatalogFormInput {
  return {
    workType: defaultValues?.workType || "",
    subCategoryId: refId(defaultValues?.subCategory),
    groupCategoryId: refId(defaultValues?.groupCategory),
    mainCategoryId: refId(defaultValues?.mainCategory),
    cashflowCategoryId: refId(defaultValues?.cashflowCategory),
    procurementSchemaId: refId(defaultValues?.procurementSchema),
    description: defaultValues?.description || "",
    businessEntityTaxes: mapTaxRows(
      taxesForSubject(defaultValues, "BADAN_USAHA"),
    ),
    individualTaxes: mapTaxRows(taxesForSubject(defaultValues, "PERORANGAN")),
  };
}

function DetailRow({
  label,
  value,
}: Readonly<{ label: string; value?: string | null }>) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-8">
      <span className="w-64 shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value || "—"}</span>
    </div>
  );
}

function CatalogSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  error,
}: Readonly<{
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<{ value: string; label: string }>;
  placeholder: string;
  disabled?: boolean;
  error?: string;
}>) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8">
      <Label htmlFor={id} className="w-64 shrink-0 text-sm">
        {label} <span className="text-red-500">*</span>
      </Label>
      <div className="w-full max-w-xl">
        <Select value={value || undefined} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger id={id} className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}

function CatalogReadonly({
  id,
  label,
  value,
  placeholder,
  required = true,
}: Readonly<{
  id: string;
  label: string;
  value: string;
  placeholder: string;
  required?: boolean;
}>) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8">
      <Label htmlFor={id} className="w-64 shrink-0 text-sm text-muted-foreground">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </Label>
      <div className="w-full max-w-xl">
        <Input
          id={id}
          value={value}
          placeholder={placeholder}
          disabled
          className="bg-muted"
        />
      </div>
    </div>
  );
}

function TaxSubjectFields({
  name,
  title,
  options,
  control,
  setValue,
  disabled,
}: Readonly<{
  name: TaxSubjectName;
  title: string;
  options: TaxOption[];
  control: Control<WorkCatalogFormInput, unknown, WorkCatalogFormValues>;
  setValue: UseFormSetValue<WorkCatalogFormInput>;
  disabled: boolean;
}>) {
  const { fields, append, remove } = useFieldArray({ control, name });
  const rows = useWatch({ control, name }) ?? [];

  return (
    <section className="space-y-4 col-8" aria-labelledby={`${name}-heading`}>
      <h3 id={`${name}-heading`} className="text-sm font-medium text-foreground">
        {title}
      </h3>
      <div className="space-y-4">
        {fields.map((field, index) => {
          const selectedId = rows[index]?.taxId ?? "";
          const selected = options.find((option) => option.id === selectedId);
          const coefficient =
            rows[index]?.coefficient || selected?.coefficient || "";
          const ratePercent =
            rows[index]?.ratePercent || selected?.ratePercent || "";
          const selectableOptions = [
            ...(selectedId && !selected
              ? [
                  {
                    id: selectedId,
                    name: selectedId,
                    coefficient,
                    ratePercent,
                  },
                ]
              : []),
            ...options.filter(
              (option) =>
                option.id === selectedId ||
                !rows.some(
                  (row, rowIndex) =>
                    rowIndex !== index && row.taxId === option.id,
                ),
            ),
          ];
          return (
            <div key={field.id} className="flex items-start gap-3 w-3/4">
              <div className="min-w-0 flex-1 w-1/2 space-y-4 rounded-lg border p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <Label className="w-40 shrink-0 text-sm">
                    Applicable Tax <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedId || undefined}
                    onValueChange={(taxId) => {
                      const tax = options.find((option) => option.id === taxId);
                      setValue(`${name}.${index}.taxId`, taxId, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      setValue(
                        `${name}.${index}.coefficient`,
                        tax?.coefficient ?? "",
                        { shouldDirty: true },
                      );
                      setValue(
                        `${name}.${index}.ratePercent`,
                        tax?.ratePercent ?? "",
                        { shouldDirty: true },
                      );
                    }}
                    disabled={disabled}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectableOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <Label className="w-40 shrink-0 text-sm">
                    Coefficient & Rate (%)
                  </Label>
                  <div className="flex min-w-0 flex-1 gap-3">
                    <Input value={coefficient} disabled className="bg-muted" />
                    <Input value={ratePercent} disabled className="bg-muted" />
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="shrink-0"
                aria-label={`Remove applicable tax ${index + 1}`}
                onClick={() => remove(index)}
                disabled={disabled}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          );
        })}
      </div>
      <div className="relative border-t mt-8">
        <div className="flex justify-center py-4">
          <Button
            type="button"
            variant="outline"
            className="absolute -top-5 rounded-full border-primary bg-background text-primary hover:bg-primary/5"
            onClick={() => append({ ...EMPTY_TAX })}
            disabled={disabled}
          >
            <Plus className="size-4" />
            Add another Applicable Tax
          </Button>
        </div>
      </div>
    </section>
  );
}

function WorkCatalogEditor({
  mode,
  initialValues,
  recordId,
}: Readonly<{
  mode: "create" | "edit";
  initialValues: WorkCatalogFormInput;
  recordId?: number;
}>) {
  const navigate = useNavigate();
  const [showUnsaved, setShowUnsaved] = useState(false);
  const { data: taxRatesData } = useGetActiveTaxRates();
  const taxOptions = (taxRatesData?.data ?? []).map(toTaxOption);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors, isDirty },
  } = useForm<WorkCatalogFormInput, unknown, WorkCatalogFormValues>({
    resolver: zodResolver(workCatalogSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const createMutation = useCreateWorkCatalogMutation({
    onSuccess: () => {
      navigate(WORK_CATALOG_URL);
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdateWorkCatalogMutation({
    onSuccess: () => {
      navigate(WORK_CATALOG_URL);
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const { data: subCategoryOptions = [] } = useQuery({
    queryKey: ["paymentCategories", "work-catalog-options"],
    queryFn: listSubWorkCategoryOptions,
  });
  const { data: cashflowCategoryOptions = [] } = useQuery({
    queryKey: ["cashflowCategories", "work-catalog-options"],
    queryFn: listCashflowCategoryOptions,
  });
  const { data: procurementSchemaOptions = [] } = useQuery({
    queryKey: ["lookupValues", "PROCUREMENT_SCHEMA", "work-catalog-options"],
    queryFn: listProcurementSchemaOptions,
  });
  const workType = useWatch({ control, name: "workType" });
  const procurementSchemaId = useWatch({
    control,
    name: "procurementSchemaId",
  });
  const groupCategoryId = useWatch({ control, name: "groupCategoryId" });
  const subCategoryId = useWatch({ control, name: "subCategoryId" });
  const cashflowCategoryId = useWatch({ control, name: "cashflowCategoryId" });
  const businessEntityTaxes = useWatch({ control, name: "businessEntityTaxes" });
  const individualTaxes = useWatch({ control, name: "individualTaxes" });
  const selectedSubCategory = subCategoryOptions.find(
    (option) => option.value === subCategoryId,
  );
  const hasSelectedTax = [
    ...(businessEntityTaxes ?? []),
    ...(individualTaxes ?? []),
  ].some((tax) => Boolean(tax.taxId?.trim()));
  const canSave =
    Boolean(workType?.trim()) &&
    Boolean(
      procurementSchemaId &&
        groupCategoryId &&
        subCategoryId &&
        cashflowCategoryId,
    ) &&
    hasSelectedTax;

  const onSubmit = (data: WorkCatalogFormValues) => {
    const toTaxRequests = (
      taxes: WorkCatalogFormValues["businessEntityTaxes"],
      taxSubject: WorkCatalogTaxSubject,
    ) =>
      taxes.flatMap((tax) => {
        const taxRateId = Number(tax.taxId);
        if (!tax.taxId || !Number.isFinite(taxRateId)) return [];
        return [{ taxSubject, taxRateId }];
      });

    const requestData = {
      workType: data.workType,
      subCategoryId: toNumericId(data.subCategoryId),
      groupCategoryId: toNumericId(data.groupCategoryId),
      mainCategoryId: toOptionalNumericId(data.mainCategoryId),
      cashflowCategoryId: toNumericId(data.cashflowCategoryId),
      procurementSchemaId: toNumericId(data.procurementSchemaId),
      description: data.description,
      taxes: [
        ...toTaxRequests(data.businessEntityTaxes, "BADAN_USAHA"),
        ...toTaxRequests(data.individualTaxes, "PERORANGAN"),
      ],
    };

    if (mode === "create") {
      createMutation.mutate(requestData);
      return;
    }

    if (recordId) {
      updateMutation.mutate({ id: recordId, data: requestData });
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8">
        <Label
          htmlFor="workType"
          className="w-64 shrink-0 text-sm"
        >
          Work Name <span className="text-red-500">*</span>
        </Label>
        <div className="w-full max-w-xl">
          <Input
            id="workType"
            placeholder="Enter work name"
            disabled={isSubmitting}
            maxLength={120}
            aria-invalid={!!errors.workType}
            {...register("workType")}
          />
          {errors.workType && (
            <p className="mt-1 text-xs text-red-500">{errors.workType.message}</p>
          )}
        </div>
      </div>

      <Controller
        name="subCategoryId"
        control={control}
        render={({ field }) => (
          <CatalogSelect
            id="subCategoryId"
            label="Sub Work Category"
            value={field.value}
            onChange={(value) => {
              field.onChange(value);
              const selected = subCategoryOptions.find(
                (option) => option.value === value,
              );
              setValue("groupCategoryId", selected?.groupCategoryId ?? "", {
                shouldDirty: true,
                shouldValidate: true,
              });
              setValue("mainCategoryId", selected?.mainCategoryId ?? "", {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
            options={
              field.value &&
              !subCategoryOptions.some((option) => option.value === field.value)
                ? [{ value: field.value, label: field.value }, ...subCategoryOptions]
                : subCategoryOptions
            }
            placeholder="Select Sub Work Category"
            disabled={isSubmitting}
            error={errors.subCategoryId?.message}
          />
        )}
      />
      <CatalogReadonly
        id="groupCategoryId"
        label="Group Work Category"
        value={selectedSubCategory?.groupCategoryLabel || ""}
        placeholder=""
      />
      <CatalogReadonly
        id="mainCategoryId"
        label="Main Category / Payment Type"
        value={selectedSubCategory?.mainCategoryLabel || ""}
        placeholder=""
        required={false}
      />
      <Controller
        name="cashflowCategoryId"
        control={control}
        render={({ field }) => (
          <CatalogSelect
            id="cashflowCategoryId"
            label="Cashflow Category"
            value={field.value}
            onChange={field.onChange}
            options={
              field.value &&
              !cashflowCategoryOptions.some((option) => option.value === field.value)
                ? [{ value: field.value, label: field.value }, ...cashflowCategoryOptions]
                : cashflowCategoryOptions
            }
            placeholder="Select Cashflow Category"
            disabled={isSubmitting}
            error={errors.cashflowCategoryId?.message}
          />
        )}
      />
      <Controller
        name="procurementSchemaId"
        control={control}
        render={({ field }) => (
          <CatalogSelect
            id="procurementSchemaId"
            label="Procurement Schema"
            value={field.value}
            onChange={field.onChange}
            options={
              field.value &&
              !procurementSchemaOptions.some((option) => option.value === field.value)
                ? [
                    { value: field.value, label: field.value },
                    ...procurementSchemaOptions,
                  ]
                : procurementSchemaOptions
            }
            placeholder="Select Procurement Schema"
            disabled={isSubmitting}
            error={errors.procurementSchemaId?.message}
          />
        )}
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-8">
        <Label
          htmlFor="description"
          className="w-64 shrink-0 pt-2 text-sm"
        >
          Description
        </Label>
        <div className="w-full max-w-xl">
          <Textarea
            id="description"
            rows={6}
            placeholder="Enter a brief description of the work type"
            disabled={isSubmitting}
            maxLength={500}
            className="resize-y"
            {...register("description")}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>
      </div>

      <Separator />

      <TaxSubjectFields
        name="businessEntityTaxes"
        title="Tax Subject: Badan Usaha"
        options={taxOptions}
        control={control}
        setValue={setValue}
        disabled={isSubmitting}
      />

      <Separator />

      <TaxSubjectFields
        name="individualTaxes"
        title="Tax Subject: Perorangan"
        options={taxOptions}
        control={control}
        setValue={setValue}
        disabled={isSubmitting}
      />

      <div className="flex w-full items-center justify-end gap-3 border-t border-border pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (mode === "edit" && isDirty) {
              setShowUnsaved(true);
              return;
            }
            navigate(WORK_CATALOG_URL);
          }}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !canSave}>
          Save
        </Button>
      </div>
    </form>
    {mode === "edit" && (
      <UnsavedChangesModal
        open={showUnsaved}
        onOpenChange={setShowUnsaved}
        onDiscard={() => navigate(WORK_CATALOG_URL)}
        onSave={() => {
          setShowUnsaved(false);
          void handleSubmit(onSubmit)();
        }}
        saveDisabled={isSubmitting || !canSave}
        compact
      />
    )}
    </>
  );
}

function displayCoefficient(value: string) {
  if (!value) return "—";
  if (value.includes("/")) return value;
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(2) : value;
}

function displayRate(value: string) {
  if (!value) return "—";
  return value.includes("%") ? value : `${value}%`;
}

function TaxSubjectDetail({
  title,
  taxes,
  options,
}: Readonly<{
  title: string;
  taxes?: WorkCatalogApplicableTax[];
  options: TaxOption[];
}>) {
  const rows = (taxes ?? []).map((tax) => {
    const option = options.find((item) => item.id === String(tax.taxId));
    return {
      id: String(tax.taxId),
      name: option?.name || tax.taxName || tax.taxId || "—",
      coefficient: displayCoefficient(
        option?.coefficient || (tax.coefficient == null ? "" : String(tax.coefficient)),
      ),
      rate: displayRate(
        option?.ratePercent || (tax.ratePercent == null ? "" : String(tax.ratePercent)),
      ),
    };
  });

  return (
    <section className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {rows.length ? (
        <div className="rounded-xl border bg-muted/40 p-3">
          <table className="w-full table-fixed border-separate border-spacing-y-2 text-sm">
            <colgroup>
              <col className="w-[40%]" />
              <col className="w-[30%]" />
              <col className="w-[30%]" />
            </colgroup>
            <thead>
              <tr className="text-muted-foreground">
                <th className="px-4 py-1 text-left font-normal">Tax Type</th>
                <th className="px-4 py-1 text-left font-normal">Coefficient</th>
                <th className="px-4 py-1 text-left font-normal">Rate (%)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${row.id}-${index}`} className="bg-background">
                  <td className="rounded-l-lg px-4 py-4 font-medium">{row.name}</td>
                  <td className="px-4 py-4 font-medium">{row.coefficient}</td>
                  <td className="rounded-r-lg px-4 py-4 font-medium">{row.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">—</p>
      )}
    </section>
  );
}

interface WorkCatalogBodyProps {
  mode: WorkCatalogFormMode;
  record?: WorkCatalogResponse;
  needsRecord: boolean;
  hasRecordId: boolean;
  isLoadingDetail: boolean;
  isError: boolean;
  subCategoryOptions: SubCategoryOption[];
  cashflowCategoryOptions: ReadonlyArray<{ value: string; label: string }>;
  procurementSchemaOptions: ReadonlyArray<{ value: string; label: string }>;
  taxOptions: TaxOption[];
  onBack: () => void;
}

function WorkCatalogBody({
  mode,
  record,
  needsRecord,
  hasRecordId,
  isLoadingDetail,
  isError,
  subCategoryOptions,
  cashflowCategoryOptions,
  procurementSchemaOptions,
  taxOptions,
  onBack,
}: Readonly<WorkCatalogBodyProps>) {
  const navigate = useNavigate();

  if (needsRecord && !hasRecordId) {
    return (
      <p className="text-sm text-destructive" role="alert">
        Work Catalog not found.
      </p>
    );
  }
  if (needsRecord && isLoadingDetail) {
    return (
      <output className="block py-12 text-center text-sm text-muted-foreground">
        Loading work catalog...
      </output>
    );
  }
  if (needsRecord && (isError || !record)) {
    return (
      <div>
        <p className="text-sm text-destructive" role="alert">
          Failed to load work catalog.
        </p>
        <Button type="button" variant="link" className="mt-4 px-0" onClick={onBack}>
          Back to Work Catalog
        </Button>
      </div>
    );
  }
  if (mode === "show" && record) {
    return (
      <div className="w-full space-y-8">
        <DetailRow label="Work Name" value={record.workType} />
        <DetailRow
          label="Sub Work Category"
          value={
            refName(record.subCategory) ||
            optionLabel(subCategoryOptions, refId(record.subCategory))
          }
        />
        <DetailRow
          label="Group Work Category"
          value={
            refName(record.groupCategory) ||
            subCategoryOptions.find(
              (option) => option.value === refId(record.subCategory),
            )?.groupCategoryLabel
          }
        />
        <DetailRow
          label="Main Category / Payment Type"
          value={
            refName(record.mainCategory) ||
            subCategoryOptions.find(
              (option) => option.value === refId(record.subCategory),
            )?.mainCategoryLabel
          }
        />
        <DetailRow
          label="Cashflow Category"
          value={
            refName(record.cashflowCategory) ||
            optionLabel(
              cashflowCategoryOptions,
              refId(record.cashflowCategory),
            )
          }
        />
        <DetailRow
          label="Procurement Schema"
          value={
            refName(record.procurementSchema) ||
            optionLabel(
              procurementSchemaOptions,
              refId(record.procurementSchema),
            )
          }
        />
        <DetailRow label="Description" value={record.description} />
        <Separator />
        <TaxSubjectDetail
          title="Tax Subject: Badan Usaha"
          taxes={taxesForSubject(record, "BADAN_USAHA")}
          options={taxOptions}
        />
        <TaxSubjectDetail
          title="Tax Subject: Perorangan"
          taxes={taxesForSubject(record, "PERORANGAN")}
          options={taxOptions}
        />
        <div className="flex w-full items-center justify-end gap-3 border-t border-border pt-6">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Visibility permission={WORK_CATALOG_UPDATE_PERMISSION}>
            <Button
              type="button"
              onClick={() => navigate(getWorkCatalogEditUrl(record.id))}
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
      <WorkCatalogEditor
        mode={mode === "edit" ? "edit" : "create"}
        initialValues={
          record ? getDefaultWorkCatalogValues(record) : EMPTY_VALUES
        }
        recordId={record?.id}
      />
    );
  }
  return null;
}

export function WorkCatalogFormPage({
  mode,
}: Readonly<{ mode: WorkCatalogFormMode }>) {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const recordId = Number(id);
  const hasRecordId = Number.isFinite(recordId) && recordId > 0;
  const needsRecord = mode !== "create";
  const { data: subCategoryOptions = [] } = useQuery({
    queryKey: ["paymentCategories", "work-catalog-options"],
    queryFn: listSubWorkCategoryOptions,
    enabled: mode === "show",
  });
  const { data: cashflowCategoryOptions = [] } = useQuery({
    queryKey: ["cashflowCategories", "work-catalog-options"],
    queryFn: listCashflowCategoryOptions,
    enabled: mode === "show",
  });
  const { data: procurementSchemaOptions = [] } = useQuery({
    queryKey: ["lookupValues", "PROCUREMENT_SCHEMA", "work-catalog-options"],
    queryFn: listProcurementSchemaOptions,
    enabled: mode === "show",
  });
  const { data: taxRatesData } = useGetActiveTaxRates({
    enabled: mode === "show",
  });
  const taxOptions = (taxRatesData?.data ?? []).map(toTaxOption);

  const title = getWorkCatalogPageTitle(mode);
  const permission = getWorkCatalogPermission(mode);
  const currentUrl = getWorkCatalogPageUrl(mode, hasRecordId, recordId);

  const { data: detailData, isLoading: isLoadingDetail, isError } =
    useGetWorkCatalogById(hasRecordId ? recordId : 0, {
      enabled: needsRecord && hasRecordId,
    });
  const record = detailData?.data;

  const handleBack = () => {
    navigate(WORK_CATALOG_URL);
  };

  return (
    <Page
      type="base"
      title={title}
      permission={permission}
      breadcrumbs={[
        { title: "Master Data", url: "#" },
        { title: WORK_CATALOG_LIST_PAGE_TITLE, url: WORK_CATALOG_URL },
        { title, url: currentUrl },
      ]}
    >
      <div className="w-full space-y-6">
        <PageHeader title={title} withBackButton={false} />
        <Separator className="w-full" />
        <WorkCatalogBody
          mode={mode}
          record={record}
          needsRecord={needsRecord}
          hasRecordId={hasRecordId}
          isLoadingDetail={isLoadingDetail}
          isError={isError}
          subCategoryOptions={subCategoryOptions}
          cashflowCategoryOptions={cashflowCategoryOptions}
          procurementSchemaOptions={procurementSchemaOptions}
          taxOptions={taxOptions}
          onBack={handleBack}
        />
      </div>
    </Page>
  );
}

export function WorkCatalogCreatePage() {
  return <WorkCatalogFormPage mode="create" />;
}

export function WorkCatalogEditPage() {
  return <WorkCatalogFormPage mode="edit" />;
}

export function WorkCatalogShowPage() {
  return <WorkCatalogFormPage mode="show" />;
}

export default WorkCatalogFormPage;
