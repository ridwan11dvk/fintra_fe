import { profitCenterQueryKeys } from "../data/profit-center.query";
import { profitCenterSchema } from "../data/profit-center.schema";
import { profitCenterService } from "../data/profit-center.service";
import { UnsavedChangesModal } from "../../shared/unsaved-changes-modal";
import {
  PROFIT_CENTER_CREATE_PERMISSION,
  PROFIT_CENTER_CREATE_URL,
  PROFIT_CENTER_EDIT_PERMISSION,
  PROFIT_CENTER_LIST_PAGE_TITLE,
  PROFIT_CENTER_URL,
  profitCenterDetailUrl,
} from "../data/profit-center.utils";
import { ProfitCenterFormFields, type ProfitCenterFormData } from "../components/profit-center-form-fields";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@railfinance/core/ui/button";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { toast } from "@railfinance/core/lib";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

type Mode = "create" | "edit";

function ProfitCenterFormPage({ mode }: Readonly<{ mode: Mode }>) {
  const isEditing = mode === "edit";
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const { profitCenterId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const recordQuery = useQuery({
    queryKey: profitCenterQueryKeys.detail(profitCenterId),
    queryFn: () => profitCenterService.get(profitCenterId),
    enabled: isEditing && Boolean(profitCenterId),
  });
  const segmentsQuery = useQuery({
    queryKey: [...profitCenterQueryKeys.all, "segment-options"],
    queryFn: () => profitCenterService.listActiveSegmentOptions(),
  });
  const peopleQuery = useQuery({
    queryKey: [...profitCenterQueryKeys.all, "responsible-people"],
    queryFn: () => profitCenterService.listResponsiblePeople(),
  });
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    control,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useForm<ProfitCenterFormData>({
    resolver: zodResolver(profitCenterSchema),
    mode: "onChange",
    defaultValues: {
      profitCenterId: "",
      profitCenterName: "",
      parentProfitCenterId: "",
      segmentId: "",
      businessUnitId: "",
      responsiblePerson: "",
      status: "INACTIVE",
    },
  });
  const selectedStatus = useWatch({ control, name: "status" });

  useEffect(() => {
    if (isEditing && recordQuery.data) {
      reset({
        profitCenterId: recordQuery.data.profitCenterId,
        profitCenterName: recordQuery.data.profitCenterName,
        parentProfitCenterId: recordQuery.data.parentProfitCenterId,
        segmentId: recordQuery.data.segmentId,
        businessUnitId: recordQuery.data.businessUnitId,
        responsiblePerson: recordQuery.data.responsiblePerson,
        status: recordQuery.data.status,
      });
    }
  }, [isEditing, recordQuery.data, reset]);

  const onSubmit = async (data: ProfitCenterFormData) => {
    try {
      const saved = isEditing
        ? await profitCenterService.update(profitCenterId, data)
        : await profitCenterService.create(data);
      await queryClient.invalidateQueries({ queryKey: profitCenterQueryKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: profitCenterQueryKeys.detail(profitCenterId) });
      if (isEditing && saved.profitCenterId !== profitCenterId) {
        await queryClient.invalidateQueries({ queryKey: profitCenterQueryKeys.detail(saved.profitCenterId) });
      }
      toast.success(
        isEditing ? "Profit Center updated successfully" : "Profit Center added successfully",
        { description: isEditing ? "The Profit Center information has been saved and is now up to date." : "The new Profit Center has been added" },
      );
      navigate(isEditing ? profitCenterDetailUrl(saved.profitCenterId) : PROFIT_CENTER_URL);
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        setError("profitCenterId", { type: "server", message: "Profit Center ID must be unique." });
        return;
      }
      const action = isEditing ? "update" : "add";
      const message = error instanceof Error ? error.message : `Unable to ${action} Profit Center.`;
      toast.error(message);
    }
  };

  const pageTitle = isEditing ? "Edit Profit Center" : "Add Profit Center";
  const leaveUrl = isEditing ? profitCenterDetailUrl(profitCenterId) : PROFIT_CENTER_URL;
  let editRequestState: ReactNode | null = null;
  if (isEditing && recordQuery.isPending) {
    editRequestState = <output className="mt-6 block text-sm text-muted-foreground">Loading Profit Center…</output>;
  } else if (isEditing && recordQuery.isError) {
    editRequestState = <div><p className="mt-6 text-sm text-destructive" role="alert">{recordQuery.error.message}</p><Button type="button" variant="link" className="mt-4 px-0" onClick={() => navigate(PROFIT_CENTER_URL)}>Back to Profit Center</Button></div>;
  }
  let pagePermission: string | undefined;
  if (!import.meta.env.DEV) {
    pagePermission = isEditing ? PROFIT_CENTER_EDIT_PERMISSION : PROFIT_CENTER_CREATE_PERMISSION;
  }
  const optionsError = segmentsQuery.error ?? peopleQuery.error;

  return (
    <Page
      type="base"
      title={pageTitle}
      permission={pagePermission}
      breadcrumbs={[
        { title: "Master Data", url: "#" },
        { title: PROFIT_CENTER_LIST_PAGE_TITLE, url: PROFIT_CENTER_URL },
        ...(isEditing
          ? [
              { title: recordQuery.data?.profitCenterName ?? profitCenterId, url: profitCenterDetailUrl(profitCenterId) },
              { title: pageTitle, url: `${PROFIT_CENTER_URL}/${profitCenterId}/edit` },
            ]
          : [{ title: pageTitle, url: PROFIT_CENTER_CREATE_URL }]),
      ]}
    >
      <div className="border-b">
        <PageHeader title={pageTitle} />
      </div>
      {editRequestState ?? (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <ProfitCenterFormFields
            register={register}
            errors={errors}
            segments={segmentsQuery.data ?? []}
            responsiblePeople={peopleQuery.data ?? []}
            currentRecord={recordQuery.data}
            selectedStatus={selectedStatus}
            onStatusChange={(isActive) => setValue("status", isActive ? "ACTIVE" : "INACTIVE", { shouldDirty: true, shouldValidate: true })}
          />
          {optionsError && <p className="mt-2 text-sm text-destructive" role="alert">{optionsError.message}</p>}
          <div className="flex justify-end gap-3 border-t py-5">
            <Button type="button" variant="outline" onClick={() => (isDirty ? setShowUnsavedDialog(true) : navigate(leaveUrl))}>Cancel</Button>
            <Button type="submit" disabled={!isValid || isSubmitting || Boolean(optionsError) || segmentsQuery.isPending || peopleQuery.isPending || (isEditing && !isDirty)}>Save</Button>
          </div>
        </form>
      )}
      <UnsavedChangesModal
        open={showUnsavedDialog}
        onOpenChange={setShowUnsavedDialog}
        onDiscard={() => navigate(leaveUrl)}
        onSave={() => { void handleSubmit(onSubmit)(); }}
        saveDisabled={!isValid || isSubmitting || Boolean(optionsError)}
        compact
      />
    </Page>
  );
}

export function ProfitCenterCreatePage() {
  return <ProfitCenterFormPage mode="create" />;
}

export function ProfitCenterEditPage() {
  return <ProfitCenterFormPage mode="edit" />;
}
