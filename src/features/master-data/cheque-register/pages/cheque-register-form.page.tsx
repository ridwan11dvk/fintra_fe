import { chequeRegisterSchema, type ChequeRegisterFormValues } from "../data/cheque-register.schema";
import {
  chequeRegisterService,
  getChequeRegisterErrorMessage,
} from "../data/cheque-register.service";
import type {
  ChequeRegisterHouseBankOption,
  ChequeRegisterInput,
} from "../data/cheque-register.types";
import {
  CHEQUE_REGISTER_CREATE_URL,
  CHEQUE_REGISTER_LIST_PAGE_TITLE,
  CHEQUE_REGISTER_URL,
  chequeRegisterDetailUrl,
  chequeRegisterEditUrl,
  chequeRegisterQueryKeys,
} from "../data/cheque-register.utils";
import { UnsavedChangesModal } from "../../shared/unsaved-changes-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@railfinance/core/ui/button";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { NativeSelect, NativeSelectOption } from "@railfinance/core/ui/native-select";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { toast } from "@railfinance/core/lib";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Info, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, useFormState, useWatch, type UseFormReturn } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

function HouseBankField({
  form,
  banks,
  selectedBankId,
  readOnly = false,
}: Readonly<{
  form: UseFormReturn<ChequeRegisterFormValues>;
  banks: ChequeRegisterHouseBankOption[];
  selectedBankId?: string;
  readOnly?: boolean;
}>) {
  const { register, setValue } = form;
  const { errors } = useFormState({ control: form.control });
  const houseBankId = useWatch({ control: form.control, name: "houseBankId" });
  return (
    <>
      <Label htmlFor="cheque-bank">House Bank <span className="text-destructive">*</span></Label>
      <div>
        {readOnly ? (
          <Input
            id="cheque-bank"
            className="h-11"
            value={banks.find((bank) => bank.id === houseBankId)?.name ?? houseBankId}
            readOnly
          />
        ) : (
          <NativeSelect
            {...register("houseBankId")}
            id="cheque-bank"
            className="w-full [&_select]:h-11"
            value={houseBankId}
            aria-invalid={Boolean(errors.houseBankId)}
            onChange={(event) =>
              setValue("houseBankId", event.target.value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          >
            <NativeSelectOption value="">Select House Bank</NativeSelectOption>
            {banks.map((bank) => (
              <NativeSelectOption
                key={bank.id}
                value={bank.id}
                disabled={bank.status !== "ACTIVE" && bank.id !== selectedBankId}
              >
                {bank.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        )}
        {errors.houseBankId && (
          <p className="mt-1 text-xs text-destructive" role="alert">
            {errors.houseBankId.message}
          </p>
        )}
      </div>
    </>
  );
}

function ChequeNumberField({
  form,
  index,
}: Readonly<{ form: UseFormReturn<ChequeRegisterFormValues>; index: number }>) {
  const { register } = form;
  const { errors } = useFormState({ control: form.control });
  const name = `cheques.${index}.chequeNumber` as const;
  const error = errors.cheques?.[index]?.chequeNumber;
  return (
    <>
      <Label htmlFor={`cheque-number-${index}`}>
        Cheque Number <span className="text-destructive">*</span>
      </Label>
      <div className="space-y-1">
        <Input
          id={`cheque-number-${index}`}
          placeholder="Enter Cheque Number"
          maxLength={50}
          className="h-11"
          aria-invalid={Boolean(error)}
          {...register(name)}
        />
        {error && <p className="text-xs text-destructive" role="alert">{error.message}</p>}
      </div>
    </>
  );
}

function ChequeStatusField({
  form,
  index,
}: Readonly<{
  form: UseFormReturn<ChequeRegisterFormValues>;
  index: number;
}>) {
  const status = useWatch({ control: form.control, name: `cheques.${index}.status` });
  return (
    <>
      <Label htmlFor={`cheque-status-${index}`}>
        Status <span className="text-destructive">*</span>
      </Label>
      <Input
        id={`cheque-status-${index}`}
        className="h-11"
        value={status.charAt(0) + status.slice(1).toLowerCase()}
        readOnly
      />
    </>
  );
}

function ReleaseDateField({
  form,
  index,
}: Readonly<{ form: UseFormReturn<ChequeRegisterFormValues>; index: number }>) {
  const { register } = form;
  const { errors } = useFormState({ control: form.control });
  const name = `cheques.${index}.releaseDate` as const;
  const error = errors.cheques?.[index]?.releaseDate;
  return (
    <>
      <Label htmlFor={`cheque-release-date-${index}`}>
        Release Date <span className="text-destructive">*</span>
      </Label>
      <div className="space-y-1">
        <Input
          id={`cheque-release-date-${index}`}
          type="date"
          readOnly
          className="h-11"
          aria-invalid={Boolean(error)}
          {...register(name)}
        />
        {error && <p className="text-xs text-destructive" role="alert">{error.message}</p>}
      </div>
    </>
  );
}

function ChequeRows({
  form,
  editing,
  fields,
  onRemove,
}: Readonly<{
  form: UseFormReturn<ChequeRegisterFormValues>;
  editing: boolean;
  fields: Array<{ id: string }>;
  onRemove: (index: number) => void;
}>) {
  const { errors } = useFormState({ control: form.control });
  const cheques = useWatch({ control: form.control, name: "cheques" });
  return (
    <div className="space-y-4">
      {fields.map((field, index) => {
        const status = cheques?.[index]?.status;
        return (
          <div
            key={field.id}
            className={`grid items-start ${fields.length > 1 && !editing ? "gap-5 md:max-w-[888px] md:grid-cols-[minmax(0,1fr)_44px]" : "md:max-w-[824px]"}`}
          >
            <fieldset
              className="grid gap-x-5 gap-y-5 rounded-lg border px-4 py-5 md:grid-cols-[292px_minmax(0,1fr)]"
            >
              <legend className="sr-only">Cheque Number row {index + 1}</legend>
              <ChequeNumberField form={form} index={index} />
              <ChequeStatusField form={form} index={index} />
              {editing && status === "RELEASE" && (
                <div className="grid gap-x-5 gap-y-5 md:col-span-2 md:grid-cols-[292px_minmax(0,1fr)]">
                  <ReleaseDateField form={form} index={index} />
                </div>
              )}
              {errors.cheques?.[index]?.chequeNumber?.type === "custom" && (
                <span className="sr-only" role="alert">
                  {errors.cheques[index]?.chequeNumber?.message}
                </span>
              )}
            </fieldset>
            {fields.length > 1 && !editing && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                aria-label={`Remove Cheque Number row ${index + 1}`}
                className="size-11 bg-destructive text-white hover:bg-destructive/90"
                onClick={() => onRemove(index)}
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ChequeRegisterFormPage({ mode }: Readonly<{ mode: "create" | "edit" }>) {
  const editing = mode === "edit";
  const pageTitle = editing ? "Edit Cheque Register" : "Add Cheque Register";
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const client = useQueryClient();
  const [askDiscard, setAskDiscard] = useState(false);
  const query = useQuery({
    queryKey: chequeRegisterQueryKeys.detail(id),
    queryFn: () => chequeRegisterService.get(id),
    enabled: editing && Boolean(id),
  });
  const banksQuery = useQuery({
    queryKey: [...chequeRegisterQueryKeys.all, "house-banks"],
    queryFn: () => chequeRegisterService.getHouseBanks(),
  });
  const form = useForm<ChequeRegisterFormValues>({
    resolver: zodResolver(chequeRegisterSchema),
    mode: "onChange",
    defaultValues: {
      houseBankId: "",
      cheques: [{ chequeNumber: "", status: "OPEN", releaseDate: "" }],
      isActive: true,
    },
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "cheques" });
  const { handleSubmit, reset, formState: { isDirty, isValid, isSubmitting } } = form;

  useEffect(() => {
    if (query.data) {
      reset({
        houseBankId: query.data.houseBankId,
        cheques: [
          {
            chequeNumber: query.data.chequeNumber,
            status: query.data.status,
            releaseDate: query.data.releaseDate,
          },
        ],
        isActive: query.data.isActive,
      });
    }
  }, [query.data, reset]);

  const backUrl = CHEQUE_REGISTER_URL;
  const save = async (values: ChequeRegisterFormValues) =>
    saveChequeRegister({ values, editing, id, client, navigate });
  const queryError = banksQuery.error?.message ?? (editing ? query.error?.message : undefined);
  const isLoading = banksQuery.isPending || (editing && query.isPending);
  if (isLoading) {
    return (
      <Page type="base" title={pageTitle}>
        <PageHeader title={pageTitle} />
        <output className="mt-6 block">Loading Cheque Register…</output>
      </Page>
    );
  }
  if (queryError) {
    return (
      <Page type="base" title={pageTitle}>
        <PageHeader title={pageTitle} />
        <p role="alert" className="mt-6 text-destructive">
          {getChequeRegisterErrorMessage(queryError, "Unable to load Cheque Register")}
        </p>
      </Page>
    );
  }

  const activeBanks = banksQuery.data ?? [];
  const selectedBank = query.data?.houseBankId
    ? {
        id: query.data.houseBankId,
        name: query.data.houseBankName,
        status: "INACTIVE" as const,
      }
    : undefined;
  const banks =
    selectedBank && !activeBanks.some((bank) => bank.id === selectedBank.id)
      ? [...activeBanks, selectedBank]
      : activeBanks;
  const leave = () => (isDirty ? setAskDiscard(true) : navigate(backUrl));

  return (
    <Page
      type="base"
      title={pageTitle}
      breadcrumbs={[
        { title: "Master Data", url: "#" },
        { title: CHEQUE_REGISTER_LIST_PAGE_TITLE, url: CHEQUE_REGISTER_URL },
        { title: pageTitle, url: editing ? chequeRegisterEditUrl(id) : CHEQUE_REGISTER_CREATE_URL },
      ]}
    >
      <PageHeader title={pageTitle} />
      <form onSubmit={handleSubmit(save)} className="mt-5 w-full max-w-none space-y-5">
        {!editing && (
          <section
            aria-labelledby="add-cheques-heading"
            className="flex items-center gap-4 rounded-lg border px-4 py-4"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md border text-muted-foreground">
              <Info aria-hidden="true" className="size-5" />
            </span>
            <div>
              <h2 id="add-cheques-heading" className="text-sm font-semibold">
                Add multiple cheques at once
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                For consecutive cheque numbers, enter the starting and ending numbers to add them all at once.
              </p>
            </div>
          </section>
        )}
        <div className="grid items-center gap-x-5 gap-y-2 md:max-w-[824px] md:grid-cols-[292px_minmax(0,512px)]">
          <HouseBankField form={form} banks={banks} selectedBankId={query.data?.houseBankId} readOnly={editing} />
        </div>
        {!editing && (
          <section className="space-y-4">
            <ChequeRows form={form} editing={false} fields={fields} onRemove={remove} />
            <div className="flex justify-center border-y py-3">
              <Button
                type="button"
                variant="outline"
                className="h-10 border-primary text-primary"
                onClick={() => append({ chequeNumber: "", status: "OPEN", releaseDate: "" })}
              >
                <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
                Add another Cheque Number
              </Button>
            </div>
          </section>
        )}
        {editing && <ChequeRows form={form} editing fields={fields} onRemove={remove} />}
        <div className="flex justify-end gap-3 border-t pt-5">
          <Button type="button" variant="outline" className="h-10 border-primary text-primary" onClick={leave}>Cancel</Button>
          <Button
            type="submit"
            className={`h-10 ${!isValid || isSubmitting ? "border-border bg-muted text-muted-foreground opacity-100" : ""}`}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
      <UnsavedChangesModal
        open={askDiscard}
        onOpenChange={setAskDiscard}
        onDiscard={() => navigate(backUrl)}
        compact
        onSave={() => {
          setAskDiscard(false);
          void handleSubmit((values) => saveChequeRegister({ values, editing, id, client, navigate: () => navigate(CHEQUE_REGISTER_URL) }))();
        }}
        saveDisabled={!isValid || isSubmitting}
      />
    </Page>
  );
}

async function saveChequeRegister({
  values,
  editing,
  id,
  client,
  navigate,
}: Readonly<{
  values: ChequeRegisterFormValues;
  editing: boolean;
  id: string;
  client: ReturnType<typeof useQueryClient>;
  navigate: ReturnType<typeof useNavigate>;
}>) {
  try {
    const data = chequeRegisterSchema.parse(values);
    const inputs: ChequeRegisterInput[] = data.cheques.map((cheque) => ({
      houseBankId: data.houseBankId,
      chequeNumber: cheque.chequeNumber,
      status: cheque.status,
      releaseDate: cheque.releaseDate,
      isActive: data.isActive,
    }));

    if (editing) {
      const input = inputs[0];
      if (!input) throw new Error("A Cheque Register row is required");
      await chequeRegisterService.update(id, input);
    } else {
      await chequeRegisterService.createBatch(inputs);
    }

    await client.invalidateQueries({ queryKey: chequeRegisterQueryKeys.all });
    const successMessage = editing
      ? "Cheque Register updated successfully — The Cheque Register information has been saved and is now up to date."
      : "Cheque Register added successfully — The new Cheque Register has been added.";
    toast.success(successMessage);
    navigate(editing ? chequeRegisterDetailUrl(id) : CHEQUE_REGISTER_URL);
  } catch (error) {
    const message = getChequeRegisterErrorMessage(error);
    if (message.toLowerCase().includes("unique per house bank")) {
      toast.error(`${message}. No rows were added.`);
      return;
    }
    toast.error(message);
  }
}

export function ChequeRegisterCreatePage() {
  return <ChequeRegisterFormPage mode="create" />;
}

export function ChequeRegisterEditPage() {
  return <ChequeRegisterFormPage mode="edit" />;
}
