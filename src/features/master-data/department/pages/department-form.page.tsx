import { departmentSchema, type DepartmentFormValues } from "../data/department.schema";
import { departmentService } from "../data/department.service";
import { UnsavedChangesModal } from "../../shared/unsaved-changes-modal";
import type { DepartmentRecord } from "../data/department.types";
import {
  DEPARTMENT_CREATE_PERMISSION,
  DEPARTMENT_CREATE_URL,
  DEPARTMENT_EDIT_PERMISSION,
  DEPARTMENT_LIST_PAGE_TITLE,
  DEPARTMENT_URL,
  departmentDetailUrl,
  departmentQueryKeys,
} from "../data/department.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@railfinance/core/ui/button";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { NativeSelect, NativeSelectOption } from "@railfinance/core/ui/native-select";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { Switch } from "@railfinance/core/ui/switch";
import { toast } from "@railfinance/core/lib";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import "../department-layout.css";

type Mode = "create" | "edit";

function getDescendantIds(records: DepartmentRecord[], departmentId: string): Set<string> {
  const descendants = new Set<string>();
  const queue = [departmentId];
  while (queue.length) {
    const parentId = queue.shift();
    if (!parentId) continue;
    for (const record of records) {
      if (record.parentDepartmentId === parentId && !descendants.has(record.id)) {
        descendants.add(record.id);
        queue.push(record.id);
      }
    }
  }
  return descendants;
}

const EMPTY_DEPARTMENTS: DepartmentRecord[] = [];

function getParentOptions(records: DepartmentRecord[], id: string, isEditing: boolean, selectedParentId: string | null): DepartmentRecord[] {
  const blocked = isEditing ? getDescendantIds(records, id) : new Set<string>();
  const activeParents = records.filter((record) => record.status === "ACTIVE" && record.id !== id && !blocked.has(record.id));
  const currentParent = records.find((record) => record.id === selectedParentId);
  return currentParent && currentParent.status !== "ACTIVE" && !activeParents.some((item) => item.id === currentParent.id)
    ? [...activeParents, currentParent]
    : activeParents;
}

export function DepartmentFormPage({ mode }: Readonly<{ mode: Mode }>) {
  const isEditing = mode === "edit";
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const detailQuery = useQuery({ queryKey: departmentQueryKeys.detail(id), queryFn: () => departmentService.get(id), enabled: isEditing && Boolean(id) });
  const optionsQuery = useQuery({ queryKey: departmentQueryKeys.list({ search: "", page: 1, pageSize: 1000 }), queryFn: () => departmentService.list({ page: 1, pageSize: 1000 }) });
  const form = useForm<DepartmentFormValues>({ resolver: zodResolver(departmentSchema), mode: "onChange", defaultValues: { name: "", code: "", parentDepartmentId: null, status: "ACTIVE" } });
  const { register, handleSubmit, reset, setError, setValue, formState: { errors, isValid, isDirty, isSubmitting } } = form;
  useEffect(() => { if (isEditing && detailQuery.data) reset(detailQuery.data); }, [detailQuery.data, isEditing, reset]);
  const title = isEditing ? "Edit Department" : "Add Department";
  const pagePermission = isEditing ? DEPARTMENT_EDIT_PERMISSION : DEPARTMENT_CREATE_PERMISSION;
  const leaveUrl = isEditing ? departmentDetailUrl(id) : DEPARTMENT_URL;
  const selectedStatus = useWatch({ control: form.control, name: "status" });
  const selectedParent = useWatch({ control: form.control, name: "parentDepartmentId" });
  const records = optionsQuery.data?.items ?? EMPTY_DEPARTMENTS;
  const visibleParentOptions = getParentOptions(records, id, isEditing, selectedParent);

  const onSubmit = async (data: DepartmentFormValues) => {
    try {
      if (isEditing) await departmentService.update(id, data);
      else await departmentService.create(data);
      await queryClient.invalidateQueries({ queryKey: departmentQueryKeys.all });
      toast.success(isEditing ? "Department updated successfully" : "Department added successfully", {
        description: isEditing ? "The Department information has been saved and is now up to date." : "The new Department has been added.",
      });
      navigate(isEditing ? departmentDetailUrl(id) : DEPARTMENT_URL);
    } catch (error) {
      if (error instanceof Error && error.message.toLocaleLowerCase().includes("unique")) setError("code", { type: "server", message: "Department Code must be unique" });
      else toast.error(error instanceof Error ? error.message : "Unable to save Department.");
    }
  };

  if (isEditing && detailQuery.isPending) return <Page type="base" title={title}><PageHeader title={title} /><output className="mt-6 block text-sm text-muted-foreground">Loading Department…</output></Page>;
  if (isEditing && detailQuery.isError) return <Page type="base" title={title}><PageHeader title={title} /><p className="mt-6 text-sm text-destructive" role="alert">{detailQuery.error.message}</p><Button type="button" variant="link" className="mt-4 px-0" onClick={() => navigate(DEPARTMENT_URL)}>Back to Department</Button></Page>;
  const requestLeave = () => isDirty ? setShowUnsavedDialog(true) : navigate(leaveUrl);

  return (
    <Page type="base" title={title} permission={import.meta.env.DEV ? undefined : pagePermission} breadcrumbs={[
      { title: "Master Data", url: "#" }, { title: DEPARTMENT_LIST_PAGE_TITLE, url: DEPARTMENT_URL },
      ...(isEditing ? [{ title: detailQuery.data?.name ?? id, url: departmentDetailUrl(id) }, { title, url: `${departmentDetailUrl(id)}/edit` }] : [{ title, url: DEPARTMENT_CREATE_URL }]),
    ]}>
      <div className="department-page-header"><PageHeader title={title} /></div>
      <form onSubmit={handleSubmit(onSubmit)} className="department-form-layout" data-editing={isEditing}>
        <section className="department-form-grid">
          <div className="department-form-row">
            <Label htmlFor="department-name">Department Name <span className="text-destructive">*</span></Label>
            <div className="department-form-control">
              <Input id="department-name" className="department-form-input" placeholder="Enter Department Name" maxLength={100} aria-invalid={Boolean(errors.name)} {...register("name")} />
              {errors.name && <p className="mt-1 text-xs text-destructive" role="alert">{errors.name.message}</p>}
            </div>
          </div>
          <div className="department-form-row">
            <Label htmlFor="department-parent">Parent Department</Label>
            <div className="department-form-control">
              <NativeSelect id="department-parent" className="department-form-select" value={selectedParent ?? ""} onChange={(event) => setValue("parentDepartmentId", event.currentTarget.value || null, { shouldDirty: true, shouldValidate: true })} disabled={optionsQuery.isPending}>
                <NativeSelectOption value="">Select Parent Department</NativeSelectOption>
                {visibleParentOptions.map((record) => <NativeSelectOption key={record.id} value={record.id} disabled={record.status !== "ACTIVE"}>{record.name} ({record.code}){record.status === "ACTIVE" ? "" : " — Inactive (current)"}</NativeSelectOption>)}
              </NativeSelect>
              {optionsQuery.isError && <p className="mt-1 text-xs text-destructive" role="alert">Unable to load parent Departments: {optionsQuery.error.message}</p>}
            </div>
          </div>
          <div className="department-form-row">
            <Label htmlFor="department-status">Status <span className="text-destructive">*</span></Label>
            <div className="department-form-control flex items-center gap-3">
              <Switch id="department-status" aria-label="Department status" checked={selectedStatus === "ACTIVE"} onCheckedChange={(checked) => setValue("status", checked ? "ACTIVE" : "INACTIVE", { shouldDirty: true, shouldValidate: true })} />
              <span className="text-sm">{selectedStatus === "ACTIVE" ? "Active" : "Inactive"}</span>
            </div>
          </div>
          <div className="department-form-row">
            <Label htmlFor="department-code">Department Code <span className="text-destructive">*</span></Label>
            <div className="department-form-control">
              <Input id="department-code" className="department-form-input" placeholder="Enter Department Code" maxLength={30} aria-invalid={Boolean(errors.code)} {...register("code")} />
              {errors.code && <p className="mt-1 text-xs text-destructive" role="alert">{errors.code.message}</p>}
            </div>
          </div>
        </section>
        <div className="flex justify-end gap-3 border-t py-5">
          <Button type="button" variant="outline" onClick={requestLeave}>Cancel</Button>
          <Button type="submit" disabled={!isValid || isSubmitting || (isEditing && (!isDirty || detailQuery.isFetching)) || optionsQuery.isError}>{isSubmitting ? "Saving…" : "Save"}</Button>
        </div>
      </form>
      <UnsavedChangesModal
        open={showUnsavedDialog}
        onOpenChange={setShowUnsavedDialog}
        onDiscard={() => navigate(leaveUrl)}
        onSave={() => { setShowUnsavedDialog(false); void handleSubmit(onSubmit)(); }}
        saveDisabled={!isValid || isSubmitting || optionsQuery.isError}
        compact
      />
    </Page>
  );
}

export function DepartmentCreatePage() { return <DepartmentFormPage mode="create" />; }
export function DepartmentEditPage() { return <DepartmentFormPage mode="edit" />; }
