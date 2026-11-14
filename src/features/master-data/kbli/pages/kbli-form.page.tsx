import { kbliQueryKeys } from "../data/kbli.query";
import { kbliSchema, type KbliFormValues } from "../data/kbli.schema";
import { getKbliErrorMessage, kbliService } from "../data/kbli.service";
import { UnsavedChangesModal } from "../../shared/unsaved-changes-modal";
import { KBLI_CREATE_PERMISSION, KBLI_CREATE_URL, KBLI_EDIT_PERMISSION, KBLI_LIST_PAGE_TITLE, KBLI_URL, kbliDetailUrl } from "../data/kbli.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@railfinance/core/ui/button";
import { Textarea } from "@railfinance/core/ui/textarea";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { getErrorItems, toast } from "@railfinance/core/lib";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import styles from "../components/kbli-form.module.css";

type Mode = "create" | "edit";

export function KbliFormPage({ mode }: Readonly<{ mode: Mode }>) {
  const isEditing = mode === "edit";
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const detailQuery = useQuery({ queryKey: kbliQueryKeys.detail(id), queryFn: () => kbliService.get(id), enabled: isEditing && Boolean(id) });
  const form = useForm<KbliFormValues>({ resolver: zodResolver(kbliSchema), mode: "onChange", defaultValues: { code: "", category: "", businessFieldName: "", status: "ACTIVE" } });
  const { register, handleSubmit, reset, setError, formState: { errors, isValid, isDirty, isSubmitting } } = form;
  useEffect(() => { if (isEditing && detailQuery.data) reset(detailQuery.data); }, [detailQuery.data, isEditing, reset]);
  const title = isEditing ? "Edit KBLI" : "Add KBLI";
  const pagePermission = isEditing ? KBLI_EDIT_PERMISSION : KBLI_CREATE_PERMISSION;
  const leaveUrl = KBLI_URL;

  const save = async (data: KbliFormValues, destination: string) => {
    try {
      if (isEditing) await kbliService.update(id, data);
      else await kbliService.create({ ...data, status: "ACTIVE" });
      await queryClient.invalidateQueries({ queryKey: kbliQueryKeys.all });
      toast.success(isEditing ? "KBLI updated successfully" : "KBLI added successfully", {
        description: isEditing ? "The KBLI information has been saved and is now up to date." : "The new KBLI has been added.",
      });
      navigate(destination);
    } catch (error) {
      const message = getKbliErrorMessage(error);
      const codeError = getErrorItems(error).find((item) => item.field === "code");
      const isDuplicateCode = /sudah digunakan|already exists|already (?:been )?(?:used|taken)|duplicate|must be unique/i.test(message);
      if (codeError || isDuplicateCode) {
        setError("code", {
          type: "server",
          message: codeError?.message || "KBLI Code already exists",
        }, { shouldFocus: true });
      } else {
        toast.error(message);
      }
    }
  };

  const onSubmit = (data: KbliFormValues) => save(data, KBLI_URL);

  if (isEditing && detailQuery.isPending) return <Page type="base" title={title}><PageHeader title={title} /><output className="mt-6 block text-sm text-muted-foreground">Loading KBLI…</output></Page>;
  if (isEditing && detailQuery.isError) return <Page type="base" title={title}><PageHeader title={title} /><p className="mt-6 text-sm text-destructive" role="alert">{detailQuery.error.message}</p><Button type="button" variant="link" className="mt-4 px-0" onClick={() => navigate(KBLI_URL)}>Back to KBLI</Button></Page>;
  const requestLeave = () => isDirty ? setShowUnsavedDialog(true) : navigate(KBLI_URL);

  return <Page type="base" title={title} permission={import.meta.env.DEV ? undefined : pagePermission} breadcrumbs={[
    { title: "Master Data", url: "#" }, { title: KBLI_LIST_PAGE_TITLE, url: KBLI_URL },
    ...(isEditing ? [{ title: detailQuery.data?.code ?? id, url: kbliDetailUrl(id) }, { title, url: `${kbliDetailUrl(id)}/edit` }] : [{ title, url: KBLI_CREATE_URL }]),
  ]}>
    <div className="border-b">
      <PageHeader title={title} />
    </div>
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
      <section className={styles.layout}>
        <div className={styles.row}>
          <Label htmlFor="kbli-code" className={styles.label}>KBLI Code <span className="text-destructive">*</span></Label>
          <div className={styles.controlCell}>
            <Input className={styles.inputControl} id="kbli-code" placeholder="Enter KBLI Code (e.g. 47111)" maxLength={20} aria-invalid={Boolean(errors.code)} aria-describedby={errors.code ? "kbli-code-error" : undefined} {...register("code")} />
            {errors.code && <p id="kbli-code-error" className="mt-1 text-xs text-destructive" role="alert">{errors.code.message}</p>}
          </div>
        </div>
        <div className={styles.row}>
          <Label htmlFor="kbli-category" className={styles.label}>Category/Golongan <span className="text-destructive">*</span></Label>
          <div className={styles.controlCell}>
            <Input className={styles.inputControl} id="kbli-category" placeholder="Enter Category/Golongan" maxLength={200} aria-invalid={Boolean(errors.category)} {...register("category")} />
            {errors.category && <p className="mt-1 text-xs text-destructive" role="alert">{errors.category.message}</p>}
          </div>
        </div>
        <div className={styles.row}>
          <Label htmlFor="kbli-business-field" className={styles.label}>Business Field Name <span className="text-destructive">*</span></Label>
          <div className={styles.controlCell}>
            <Textarea rows={3} className={`${styles.inputControl} min-h-24`} id="kbli-business-field" placeholder="Enter Business Field Name" maxLength={250} aria-invalid={Boolean(errors.businessFieldName)} {...register("businessFieldName")} />
            {errors.businessFieldName && <p className="mt-1 text-xs text-destructive" role="alert">{errors.businessFieldName.message}</p>}
          </div>
        </div>
      </section>
      <div className="flex justify-end gap-3 border-t py-5"><Button type="button" variant="outline" onClick={requestLeave}>Cancel</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save"}</Button></div>
    </form>
    <UnsavedChangesModal
      open={showUnsavedDialog}
      onOpenChange={setShowUnsavedDialog}
      onDiscard={() => navigate(leaveUrl)}
      onSave={() => { setShowUnsavedDialog(false); void handleSubmit((data) => save(data, KBLI_URL))(); }}
      saveDisabled={!isValid || isSubmitting}
      compact
    />
  </Page>;
}

export function KbliCreatePage() { return <KbliFormPage mode="create" />; }
export function KbliEditPage() { return <KbliFormPage mode="edit" />; }
