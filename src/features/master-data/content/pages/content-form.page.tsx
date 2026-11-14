import { contentSchema, type ContentFormValues } from "../data/content.schema";
import { contentService, getContentErrorMessage } from "../data/content.service";
import { ContentFormFields } from "../components/content-form-fields";
import { CONTENT_CREATE_PERMISSION, CONTENT_CREATE_URL, CONTENT_EDIT_PERMISSION, CONTENT_LIST_PAGE_TITLE, CONTENT_URL, contentDetailUrl, contentEditUrl, contentQueryKeys } from "../data/content.utils";
import { UnsavedChangesModal } from "../../shared/unsaved-changes-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@railfinance/core/ui/button";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { toast } from "@railfinance/core/lib";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

export function ContentFormPage({ mode }: Readonly<{ mode: "create" | "edit" }>) {
  const editing = mode === "edit";
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const client = useQueryClient();
  const [askDiscard, setAskDiscard] = useState(false);
  const query = useQuery({ queryKey: contentQueryKeys.detail(id), queryFn: () => contentService.get(id), enabled: editing && Boolean(id) });
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    mode: "onChange",
    defaultValues: { sectionName: "" as ContentFormValues["sectionName"], content: "" },
    values: query.data ? { sectionName: query.data.sectionName, content: query.data.content } : undefined,
  });
  const { register, handleSubmit, setValue, setError, formState: { errors, isDirty, isValid, isSubmitting } } = form;
  const pagePermission = editing ? CONTENT_EDIT_PERMISSION : CONTENT_CREATE_PERMISSION;
  const permission = import.meta.env.DEV ? undefined : pagePermission;
  const save = async (values: ContentFormValues, destination: string) => {
    try {
      const data = contentSchema.parse(values);
      if (editing) {
        const updatedContent = await contentService.update(id, data, query.data?.status ?? "ACTIVE");
        client.setQueryData(contentQueryKeys.detail(id), updatedContent);
      } else {
        await contentService.create(data);
      }
      await client.invalidateQueries({ queryKey: contentQueryKeys.lists(), refetchType: "all" });
      toast.success(editing ? "Content updated successfully" : "Content added successfully", {
        description: editing ? "The Content information has been saved and is now up to date." : "The new Content has been added.",
      });
      navigate(destination);
    } catch (error) {
      const message = getContentErrorMessage(error);
      if (message.includes("active Content")) setError("sectionName", { type: "server", message });
      else toast.error(message);
    }
  };
  const savedDestination = editing ? contentDetailUrl(id) : CONTENT_URL;
  const onSubmit = (values: ContentFormValues) => save(values, savedDestination);
  if (editing && query.isPending) return <Page type="base" title="Edit Content" permission={permission}><PageHeader title="Edit Content" /><output className="mt-6 block">Loading Content…</output></Page>;
  if (editing && query.isError) return <Page type="base" title="Edit Content" permission={permission}><PageHeader title="Edit Content" /><p role="alert" className="mt-6 text-sm text-destructive">{query.error.message}</p><Button type="button" variant="link" className="mt-4 px-0" onClick={() => navigate(CONTENT_URL)}>Back to Content</Button></Page>;
  const leave = () => isDirty ? setAskDiscard(true) : navigate(CONTENT_URL);
  return <Page type="base" title={editing ? "Edit Content" : "Add Content"} permission={permission} breadcrumbs={[{ title: "Master Data", url: "#" }, { title: CONTENT_LIST_PAGE_TITLE, url: CONTENT_URL }, { title: editing ? "Edit Content" : "Add Content", url: editing ? contentEditUrl(id) : CONTENT_CREATE_URL }]}>
    <div className="border-b">
      <PageHeader title={editing ? "Edit Content" : "Add Content"} />
    </div>
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
      <ContentFormFields
        register={register}
        errors={errors}
        onContentChange={(content) => setValue("content", content, { shouldDirty: true, shouldValidate: true })}
      />
      <div className="flex justify-end gap-3 border-t py-5"><Button type="button" variant="outline" onClick={leave}>Cancel</Button><Button type="submit" disabled={!isValid || isSubmitting || (editing && !isDirty)}>{isSubmitting ? "Saving…" : "Save"}</Button></div>
    </form>
    <UnsavedChangesModal open={askDiscard} onOpenChange={setAskDiscard} onDiscard={() => navigate(CONTENT_URL)} onSave={() => { setAskDiscard(false); void handleSubmit((values) => save(values, savedDestination))(); }} saveDisabled={!isValid || isSubmitting} compact />
  </Page>;
}
export function ContentCreatePage() { return <ContentFormPage mode="create" />; }
export function ContentEditPage() { return <ContentFormPage mode="edit" />; }
