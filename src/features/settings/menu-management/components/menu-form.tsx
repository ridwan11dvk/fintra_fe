import { zodResolver } from "@hookform/resolvers/zod";
import { QuerySelect } from "@railfinance/core/components/input";
import {
  useGetAllFeatures,
  useGetAllModules,
} from "@railfinance/core/masterdata";
import { Button } from "@railfinance/core/ui/button";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@railfinance/core/ui/select";
import { Switch } from "@railfinance/core/ui/switch";
import { Controller, useForm } from "react-hook-form";
import {
  navigationMenuSchema,
  type NavigationMenuSchema,
} from "../data/menu-management.schema";
import type { NavigationMenuItem } from "../data/menu-management.types";

export interface MenuFormProps {
  initialValues?: Partial<NavigationMenuItem>;
  onSubmit: (data: NavigationMenuSchema) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  menus: NavigationMenuItem[];
}

export function MenuForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  menus,
}: Readonly<MenuFormProps>) {
  const { data: modulesData, isLoading: isLoadingModules } = useGetAllModules();
  const { data: featuresData, isLoading: isLoadingFeatures } =
    useGetAllFeatures();

  const moduleOptions = (modulesData?.data ?? []).map((mod) => ({
    value: String(mod.id),
    label: mod.name,
  }));

  const featureOptions = (featuresData?.data ?? []).map((feature) => ({
    value: String(feature.id),
    label: feature.name,
  }));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<NavigationMenuSchema>({
    resolver: zodResolver(navigationMenuSchema),
    defaultValues: {
      code: initialValues?.code ?? "",
      title: initialValues?.title ?? "",
      titleEn: initialValues?.titleEn ?? null,
      url: initialValues?.url ?? "#",
      icon: initialValues?.icon ?? null,
      type: initialValues?.type ?? "MENU",
      category: initialValues?.category ?? "USER_MENU",
      sortOrder: initialValues?.sortOrder ?? 0,
      openInNewTab: initialValues?.openInNewTab ?? false,
      badge: initialValues?.badge ?? null,
      parentId: initialValues?.parentId ?? null,
      featureId: initialValues?.featureId ?? null,
      moduleId: initialValues?.moduleId ?? null,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="code">Code</Label>
          <Input id="code" {...register("code")} />
          {errors.code && (
            <p className="text-xs text-red-500">{errors.code.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} />
          {errors.title && (
            <p className="text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="titleEn">Title (EN)</Label>
        <Controller
          control={control}
          name="titleEn"
          render={({ field }) => (
            <Input
              id="titleEn"
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value || null)}
              placeholder="English title (optional)"
            />
          )}
        />
        {errors.titleEn && (
          <p className="text-xs text-red-500">{errors.titleEn.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input id="url" {...register("url")} />
        {errors.url && (
          <p className="text-xs text-red-500">{errors.url.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Type</Label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GROUP">GROUP</SelectItem>
                  <SelectItem value="MENU">MENU</SelectItem>
                  <SelectItem value="SUBMENU">SUBMENU</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && (
            <p className="text-xs text-red-500">{errors.type.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER_MENU">USER_MENU</SelectItem>
                  <SelectItem value="GUEST_HEADER">GUEST_HEADER</SelectItem>
                  <SelectItem value="GUEST_FOOTER">GUEST_FOOTER</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && (
            <p className="text-xs text-red-500">{errors.category.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Parent</Label>
          <Controller
            control={control}
            name="parentId"
            render={({ field }) => (
              <QuerySelect
                id="parentId"
                value={field.value ? String(field.value) : "none"}
                onValueChange={(value) =>
                  field.onChange(
                    value === "none" || value === "" ? null : Number(value),
                  )
                }
                options={[
                  { value: "none", label: "No Parent" },
                  ...menus.map((menu) => ({
                    value: String(menu.id),
                    label: `${menu.title} (${menu.code})`,
                  })),
                ]}
                placeholder="Select parent"
              />
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="icon">Icon (Lucide)</Label>
          <Controller
            control={control}
            name="icon"
            render={({ field }) => (
              <Input
                id="icon"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value || null)}
              />
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="badge">Badge</Label>
          <Controller
            control={control}
            name="badge"
            render={({ field }) => (
              <Input
                id="badge"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value || null)}
              />
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input
            id="sortOrder"
            type="number"
            {...register("sortOrder", { valueAsNumber: true })}
          />
          {errors.sortOrder && (
            <p className="text-xs text-red-500">{errors.sortOrder.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="featureId">Feature</Label>
          <Controller
            control={control}
            name="featureId"
            render={({ field }) => (
              <QuerySelect
                id="featureId"
                value={field.value ? String(field.value) : ""}
                onValueChange={(value) =>
                  field.onChange(value ? Number(value) : null)
                }
                options={featureOptions}
                placeholder="Select feature"
                disabled={isLoadingFeatures}
              />
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="moduleId">Module</Label>
          <Controller
            control={control}
            name="moduleId"
            render={({ field }) => (
              <QuerySelect
                id="moduleId"
                value={field.value ? String(field.value) : ""}
                onValueChange={(value) =>
                  field.onChange(value ? Number(value) : null)
                }
                options={moduleOptions}
                placeholder="Select module"
                disabled={isLoadingModules}
              />
            )}
          />
        </div>
      </div>

      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <Label htmlFor="openInNewTab">Open in New Tab</Label>
        <Controller
          control={control}
          name="openInNewTab"
          render={({ field }) => (
            <Switch
              id="openInNewTab"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
