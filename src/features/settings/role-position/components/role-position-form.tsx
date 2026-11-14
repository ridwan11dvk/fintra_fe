/* eslint-disable react-hooks/set-state-in-effect */
import {
  ROLE_POSITION_CREATE_PERMISSION,
  ROLE_POSITION_UPDATE_PERMISSION,
  useCreatePositionRole,
  useUpdatePositionRole,
  type RolePositionDetailResponse,
} from "@/features/settings/role-position";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionButton } from "@railfinance/core/components/actions";
import { Badge } from "@railfinance/core/ui/badge";
import { Button } from "@railfinance/core/ui/button";
import { Label } from "@railfinance/core/ui/label";
import { QuerySelect } from "@railfinance/core/components/input";
import { setFormErrorsFromApi } from "@railfinance/core/lib";
import { usePaginateJobPositionOptions, type RoleResponse } from "@railfinance/core/masterdata";
import { type InputValue, type OptionItem } from "@railfinance/core/types";
import { Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  rolePositionSchema,
  type RolePositionFormData,
} from "../data/role-position.schema";
import { ChooseRolesDialog } from "./choose-roles-dialog";

// Import job position options from service

interface RolePositionFormProps {
  data?: RolePositionDetailResponse | null;
  isEditing?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function RolePositionForm({
  data,
  isEditing = false,
  onSuccess,
  onCancel,
}: Readonly<RolePositionFormProps>) {
  const [chooseRolesOpen, setChooseRolesOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<RoleResponse[]>(
    data?.roles || [],
  );
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    setError,
  } = useForm<RolePositionFormData>({
    resolver: zodResolver(rolePositionSchema),
    defaultValues: {
      jobPositionId: data?.jobPosition?.id || 0,
      roleIds: data?.roles?.map((r) => r.id) || [],
    },
  });

  const createMutation = useCreatePositionRole();
  const updateMutation = useUpdatePositionRole();

  // Sync selected roles to form
  useEffect(() => {
    setValue(
      "roleIds",
      selectedRoles.map((r) => r.id),
    );
  }, [selectedRoles, setValue]);

  // Set initial data when editing
  useEffect(() => {
    if (data) {
      setValue("jobPositionId", data.jobPosition?.id || 0);
      setSelectedRoles(data.roles || []);
    }
  }, [data, setValue]);

  const watchedJobPositionId = useWatch({ control, name: "jobPositionId" });

  const handleChooseRoles = (roles: RoleResponse[]) => {
    setSelectedRoles(roles);
  };

  const handleRemoveRole = (roleId: number) => {
    setSelectedRoles((prev) => prev.filter((r) => r.id !== roleId));
  };

  const onSubmit = (formData: RolePositionFormData) => {
    const payload = {
      jobPositionId: formData.jobPositionId,
      roleIds: formData.roleIds,
    };

    if (isEditing && data?.jobPosition?.id) {
      updateMutation.mutate(
        { jobPositionId: data.jobPosition.id, data: payload },
        {
          onSuccess: () => {
            onSuccess?.();
          },
          onError: (error) => {
            setFormErrorsFromApi(error, setError);
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          onSuccess?.();
        },
        onError: (error) => {
          setFormErrorsFromApi(error, setError);
        },
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">
            Role Position Information
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Position dropdown */}
            <div className="space-y-2">
              <Label>
                Position <span className="text-red-500">*</span>
              </Label>
              <QuerySelect<InputValue, OptionItem>
                value={watchedJobPositionId || ""}
                onValueChange={(value) =>
                  setValue("jobPositionId", Number(value))
                }
                options={[]}
                asyncOptionQuery={usePaginateJobPositionOptions}
                itemToOption={(item) => ({
                  label: `${item.alias} - ${item.label}`,
                  value: item.value,
                  description: "",
                })}
                placeholder="Select position..."
                disabled={isLoading || isEditing}
                aria-invalid={!!errors.jobPositionId}
              />
              {errors.jobPositionId && (
                <p className="text-sm text-red-600">
                  {errors.jobPositionId.message}
                </p>
              )}
            </div>

            {/* Role chooser */}
            <div className="space-y-2">
              <Label>
                Role <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-start gap-2">
                <div className="flex-1 min-h-10.5 border rounded-md p-2">
                  {selectedRoles.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => setChooseRolesOpen(true)}
                      className="w-full text-left text-muted-foreground text-sm"
                    >
                      Choose Roles
                    </button>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRoles.map((role) => (
                        <Badge
                          key={role.id}
                          variant="outline"
                          className="text-xs gap-1"
                        >
                          <button
                            type="button"
                            onClick={() => setChooseRolesOpen(true)}
                          >
                            {role.name}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveRole(role.id)}
                            aria-label={`Remove ${role.name}`}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setChooseRolesOpen(true)}
                  disabled={isLoading}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              {errors.roleIds && (
                <p className="text-sm text-red-600">{errors.roleIds.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2">
          <ActionButton
            variant="cancel"
            onClick={onCancel}
            disabled={isLoading}
            type="button"
            showLabel
          />
          <ActionButton
            variant="save"
            type="submit"
            disabled={isLoading}
            showLabel
            label={isEditing ? "Update" : "Save"}
            permission={
              isEditing
                ? ROLE_POSITION_UPDATE_PERMISSION
                : ROLE_POSITION_CREATE_PERMISSION
            }
          />
        </div>
      </form>

      <ChooseRolesDialog
        open={chooseRolesOpen}
        onOpenChange={setChooseRolesOpen}
        roles={selectedRoles}
        onChoose={handleChooseRoles}
      />
    </>
  );
}
