import { segmentQueryKeys } from "../data/segment.query";
import { segmentSchema } from "../data/segment.schema";
import { segmentService } from "../data/segment.service";
import { UnsavedChangesModal } from "../../shared/unsaved-changes-modal";
import {
  SEGMENT_CREATE_PERMISSION,
  SEGMENT_CREATE_URL,
  SEGMENT_EDIT_PERMISSION,
  SEGMENT_LIST_PAGE_TITLE,
  SEGMENT_URL,
  segmentDetailUrl,
} from "../data/segment.utils";
import { SegmentFormFields } from "../components/segment-form-fields";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@railfinance/core/ui/button";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { toast } from "@railfinance/core/lib";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import type { z } from "zod";

type SegmentFormData = z.output<typeof segmentSchema>;
type Mode = "create" | "edit";

async function persistSegmentForm(
  mode: Mode,
  segmentId: string,
  data: SegmentFormData,
  queryClient: ReturnType<typeof useQueryClient>,
) {
  if (mode === "edit") {
    await segmentService.update(segmentId, data);
    await queryClient.invalidateQueries({ queryKey: segmentQueryKeys.detail(segmentId) });
  } else {
    await segmentService.create(data);
  }
  await queryClient.invalidateQueries({ queryKey: segmentQueryKeys.lists() });
}

function getEditRequestState(
  isEditing: boolean,
  isPending: boolean,
  error: unknown,
  onBack: () => void,
): ReactNode | null {
  if (!isEditing) return null;
  if (isPending) {
    return (
      <Page type="base" title="Edit Segment">
        <PageHeader title="Edit Segment" />
        <output className="mt-6 block text-sm text-muted-foreground">Loading Segment…</output>
      </Page>
    );
  }
  if (error) {
    return (
      <Page type="base" title="Edit Segment">
        <PageHeader title="Edit Segment" />
        <p className="mt-6 text-sm text-destructive" role="alert">
          {error instanceof Error ? error.message : "Unable to load Segment."}
        </p>
        <Button type="button" variant="link" className="mt-4 px-0" onClick={onBack}>Back to Segment</Button>
      </Page>
    );
  }
  return null;
}

function SegmentFormPage({ mode }: Readonly<{ mode: Mode }>) {
  const isEditing = mode === "edit";
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const { segmentId = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const segmentQuery = useQuery({
    queryKey: segmentQueryKeys.detail(segmentId),
    queryFn: () => segmentService.get(segmentId),
    enabled: isEditing && Boolean(segmentId),
  });
  const parentOptionsQuery = useQuery({
    queryKey: ["segments", "parent-options", isEditing ? segmentId : "new"],
    queryFn: () => segmentService.listParentOptions(isEditing ? segmentId : undefined),
  });
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    control,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useForm<SegmentFormData>({
    resolver: zodResolver(segmentSchema),
    mode: "onChange",
    defaultValues: {
      segmentId: "",
      segmentName: "",
      parentSegmentId: null,
      description: "",
      status: "INACTIVE",
    },
  });
  const selectedStatus = useWatch({ control, name: "status" });

  useEffect(() => {
    if (isEditing && segmentQuery.data) {
      reset({
        segmentId: segmentQuery.data.segmentId,
        segmentName: segmentQuery.data.segmentName,
        parentSegmentId: segmentQuery.data.parentSegmentId,
        description: segmentQuery.data.description,
        status: segmentQuery.data.status,
      });
    }
  }, [isEditing, reset, segmentQuery.data]);

  const successTitle = isEditing ? "Segment updated successfully" : "Segment added successfully";
  const successDescription = isEditing
    ? "The Segment information has been saved and is now up to date."
    : "The new Segment has been added";
  const pagePermission = isEditing ? SEGMENT_EDIT_PERMISSION : SEGMENT_CREATE_PERMISSION;
  const failureText = isEditing ? "update" : "add";

  const onSubmit = async (data: SegmentFormData) => {
    try {
      await persistSegmentForm(mode, segmentId, data, queryClient);
      toast.success(successTitle, { description: successDescription });
      navigate(isEditing ? segmentDetailUrl(segmentId) : SEGMENT_URL);
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        setError("segmentId", { type: "server", message: "Segment ID must be unique." });
        return;
      }
      toast.error(error instanceof Error ? error.message : `Unable to ${failureText} Segment.`);
    }
  };

  const pageTitle = isEditing ? "Edit Segment" : "Add Segment";
  const leaveUrl = isEditing ? segmentDetailUrl(segmentId) : SEGMENT_URL;
  const editRequestState = getEditRequestState(
    isEditing,
    segmentQuery.isPending,
    segmentQuery.error,
    () => navigate(SEGMENT_URL),
  );
  if (editRequestState) return editRequestState;

  return (
    <Page
      type="base"
      title={pageTitle}
      permission={import.meta.env.DEV ? undefined : pagePermission}
      breadcrumbs={[
        { title: "Master Data", url: "#" },
        { title: SEGMENT_LIST_PAGE_TITLE, url: SEGMENT_URL },
        ...(isEditing
          ? [
              { title: segmentQuery.data?.segmentName ?? segmentId, url: segmentDetailUrl(segmentId) },
              { title: pageTitle, url: `${SEGMENT_URL}/${segmentId}/edit` },
            ]
          : [{ title: pageTitle, url: SEGMENT_CREATE_URL }]),
      ]}
    >
      <div className="border-b">
        <PageHeader title={pageTitle} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <SegmentFormFields
          register={register}
          errors={errors}
          parentOptions={parentOptionsQuery.data ?? []}
          parentOptionsDisabled={parentOptionsQuery.isPending}
          currentRecord={segmentQuery.data}
          selectedStatus={selectedStatus}
          onStatusChange={(isActive) => setValue("status", isActive ? "ACTIVE" : "INACTIVE", { shouldDirty: true, shouldValidate: true })}
        />
        {parentOptionsQuery.isError && <p className="mt-2 text-sm text-destructive" role="alert">{parentOptionsQuery.error.message}</p>}

        <div className="flex justify-end gap-3 border-t py-5">
          <Button
            type="button"
            variant="outline"
            onClick={() => (isDirty ? setShowUnsavedDialog(true) : navigate(leaveUrl))}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isValid || isSubmitting || parentOptionsQuery.isError || (isEditing && !isDirty)}
          >
            Save
          </Button>
        </div>
      </form>
      <UnsavedChangesModal
        open={showUnsavedDialog}
        onOpenChange={setShowUnsavedDialog}
        onDiscard={() => navigate(leaveUrl)}
        onSave={() => { void handleSubmit(onSubmit)(); }}
        saveDisabled={!isValid || isSubmitting || parentOptionsQuery.isError}
        compact
      />
    </Page>
  );
}

export function SegmentCreatePage() {
  return <SegmentFormPage mode="create" />;
}

export function SegmentEditPage() {
  return <SegmentFormPage mode="edit" />;
}
