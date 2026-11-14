import {
  BANNER_IMAGE_ACCEPTED_TYPES,
  BANNER_IMAGE_MAX_SIZE_BYTES,
  bannerSchema,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  type BannerFormData,
  type BannerResponse,
} from "@/features/settings/banner/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface BannerFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<BannerResponse>;
  onSuccess?: () => void;
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function BannerFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<BannerFormModalProps>) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add Banner" : "Edit Banner"}
      size="default"
    >
      {open && (
        <BannerFormModalContent
          key={`${mode}-${defaultValues?.id ?? "new"}`}
          onOpenChange={onOpenChange}
          mode={mode}
          defaultValues={defaultValues}
          onSuccess={onSuccess}
        />
      )}
    </Modal>
  );
}

function BannerFormModalContent({
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<{
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<BannerResponse>;
  onSuccess?: () => void;
}>) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultValues?.imageUrl || null,
  );
  const [removeImage, setRemoveImage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      target: defaultValues?.target || "",
      title: defaultValues?.title || "",
      titleEn: defaultValues?.titleEn || "",
      subtitle: defaultValues?.subtitle || "",
      subtitleEn: defaultValues?.subtitleEn || "",
      description: defaultValues?.description || "",
      descriptionEn: defaultValues?.descriptionEn || "",
      startDate: defaultValues?.startDate || todayIsoDate(),
      endDate: defaultValues?.endDate || "",
      sortOrder: defaultValues?.sortOrder ?? 0,
    },
  });

  const createMutation = useCreateBannerMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdateBannerMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const mutation = mode === "create" ? createMutation : updateMutation;
  const isLoading = mutation.isPending;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      if (file.size > BANNER_IMAGE_MAX_SIZE_BYTES) {
        setError("image", {
          message: "Image must be max 2MB",
        });
        return;
      }
      setImageFile(file);
      setRemoveImage(false);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const onSubmit = (data: BannerFormData) => {
    const payload = {
      target: data.target,
      title: data.title,
      titleEn: data.titleEn || undefined,
      subtitle: data.subtitle || undefined,
      subtitleEn: data.subtitleEn || undefined,
      description: data.description || undefined,
      descriptionEn: data.descriptionEn || undefined,
      startDate: data.startDate,
      endDate: data.endDate || undefined,
      sortOrder: data.sortOrder,
    };

    if (mode === "create") {
      createMutation.mutate({ data: payload, image: imageFile });
    } else if (defaultValues?.id) {
      updateMutation.mutate({
        id: defaultValues.id,
        data: payload,
        image: imageFile,
        removeImage,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Target */}
      <div className="space-y-2">
        <Label htmlFor="target" className="text-sm font-medium">
          Target <span className="text-red-500">*</span>
        </Label>
        <Input
          id="target"
          placeholder="guest_home"
          {...register("target")}
          className={cn(
            "h-10",
            errors.target && "border-red-500 focus-visible:ring-red-500",
          )}
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">
          App/section key used by applications to look up banners (e.g.
          guest_home)
        </p>
        {errors.target && (
          <p className="text-xs text-red-500">{errors.target.message}</p>
        )}
      </div>

      {/* Title ID */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Title (ID) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Sederhanakan Operasi Keuangan Anda"
          {...register("title")}
          className={cn(
            "h-10",
            errors.title && "border-red-500 focus-visible:ring-red-500",
          )}
          disabled={isLoading}
        />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Title EN */}
      <div className="space-y-2">
        <Label htmlFor="titleEn" className="text-sm font-medium">
          Title (EN)
        </Label>
        <Input
          id="titleEn"
          placeholder="Simplify Your Financial Operations"
          {...register("titleEn")}
          className={cn(
            "h-10",
            errors.titleEn && "border-red-500 focus-visible:ring-red-500",
          )}
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">
          Falls back to Indonesian when empty
        </p>
        {errors.titleEn && (
          <p className="text-xs text-red-500">{errors.titleEn.message}</p>
        )}
      </div>

      {/* Subtitle ID */}
      <div className="space-y-2">
        <Label htmlFor="subtitle" className="text-sm font-medium">
          Subtitle (ID)
        </Label>
        <Input
          id="subtitle"
          {...register("subtitle")}
          className={cn(
            "h-10",
            errors.subtitle && "border-red-500 focus-visible:ring-red-500",
          )}
          disabled={isLoading}
        />
        {errors.subtitle && (
          <p className="text-xs text-red-500">{errors.subtitle.message}</p>
        )}
      </div>

      {/* Subtitle EN */}
      <div className="space-y-2">
        <Label htmlFor="subtitleEn" className="text-sm font-medium">
          Subtitle (EN)
        </Label>
        <Input
          id="subtitleEn"
          {...register("subtitleEn")}
          className={cn(
            "h-10",
            errors.subtitleEn && "border-red-500 focus-visible:ring-red-500",
          )}
          disabled={isLoading}
        />
        {errors.subtitleEn && (
          <p className="text-xs text-red-500">{errors.subtitleEn.message}</p>
        )}
      </div>

      {/* Description ID */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description (ID)
        </Label>
        <textarea
          id="description"
          maxLength={2000}
          disabled={isLoading}
          className={cn(
            "h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            errors.description && "border-red-500 focus-visible:ring-red-500",
          )}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Description EN */}
      <div className="space-y-2">
        <Label htmlFor="descriptionEn" className="text-sm font-medium">
          Description (EN)
        </Label>
        <textarea
          id="descriptionEn"
          maxLength={2000}
          disabled={isLoading}
          className={cn(
            "h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            errors.descriptionEn && "border-red-500 focus-visible:ring-red-500",
          )}
          {...register("descriptionEn")}
        />
        {errors.descriptionEn && (
          <p className="text-xs text-red-500">{errors.descriptionEn.message}</p>
        )}
      </div>

      {/* Image */}
      <div className="space-y-2">
        <Label htmlFor="image" className="text-sm font-medium">
          Image (Optional)
        </Label>
        <Input
          id="image"
          type="file"
          accept={BANNER_IMAGE_ACCEPTED_TYPES}
          onChange={handleImageChange}
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">
          JPG, PNG, or WebP, max 2MB. Recommended aspect ratio 16:9. Leave empty
          for a text-only banner.
        </p>
        {imagePreview && (
          <div className="space-y-2">
            <img
              src={imagePreview}
              alt="Banner preview"
              className="h-28 w-full max-w-xs rounded-md border object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="text-xs text-red-500 hover:underline"
              disabled={isLoading}
            >
              Remove image
            </button>
          </div>
        )}
        {errors.image && (
          <p className="text-xs text-red-500">{errors.image.message}</p>
        )}
      </div>

      {/* Start Date */}
      <div className="space-y-2">
        <Label htmlFor="startDate" className="text-sm font-medium">
          Start Date <span className="text-red-500">*</span>
        </Label>
        <Input
          id="startDate"
          type="date"
          {...register("startDate")}
          className={cn(
            "h-10",
            errors.startDate && "border-red-500 focus-visible:ring-red-500",
          )}
          disabled={isLoading}
        />
        {errors.startDate && (
          <p className="text-xs text-red-500">{errors.startDate.message}</p>
        )}
      </div>

      {/* End Date */}
      <div className="space-y-2">
        <Label htmlFor="endDate" className="text-sm font-medium">
          End Date (Optional)
        </Label>
        <Input
          id="endDate"
          type="date"
          {...register("endDate")}
          className={cn(
            "h-10",
            errors.endDate && "border-red-500 focus-visible:ring-red-500",
          )}
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">
          Leave empty for the banner to run indefinitely
        </p>
        {errors.endDate && (
          <p className="text-xs text-red-500">{errors.endDate.message}</p>
        )}
      </div>

      {/* Sort Order */}
      <div className="space-y-2">
        <Label htmlFor="sortOrder" className="text-sm font-medium">
          Sort Order <span className="text-red-500">*</span>
        </Label>
        <Input
          id="sortOrder"
          type="number"
          min={0}
          step={1}
          {...register("sortOrder")}
          className={cn(
            "h-10",
            errors.sortOrder && "border-red-500 focus-visible:ring-red-500",
          )}
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">
          Banners are displayed per target in ascending order
        </p>
        {errors.sortOrder && (
          <p className="text-xs text-red-500">{errors.sortOrder.message}</p>
        )}
      </div>
    </form>
  );
}

export default BannerFormModal;
