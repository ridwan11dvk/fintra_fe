/* eslint-disable react-hooks/set-state-in-effect */
import {
  ROLE_POSITION_CREATE_PERMISSION,
  ROLE_POSITION_UPDATE_PERMISSION,
  useAssignPositionsToRole,
  useUpdatePositionsForRole,
  type RolePositionByRoleRequest,
  type RolePositionDetailByRoleResponse,
} from "@/features/settings/role-position";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionButton } from "@railfinance/core/components/actions";
import { Badge } from "@railfinance/core/ui/badge";
import { Button } from "@railfinance/core/ui/button";
import { Label } from "@railfinance/core/ui/label";
import { QuerySelect } from "@railfinance/core/components/input";
import { setFormErrorsFromApi } from "@railfinance/core/lib";
import { usePaginateRoleOptions, type JobPositionResponse } from "@railfinance/core/masterdata";
import { type InputValue, type OptionItem } from "@railfinance/core/types";
import { Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  rolePositionByRoleSchema,
  type RolePositionByRoleFormData,
} from "../data/role-position.schema";
import { ChooseJobPositionsDialog } from "./choose-job-positions-dialog";

interface RolePositionReverseFormProps {
  data?: RolePositionDetailByRoleResponse | null;
  isEditing?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function RolePositionReverseForm({
  data,
  isEditing = false,
  onSuccess,
  onCancel,
}: Readonly<RolePositionReverseFormProps>) {
  const [choosePositionsOpen, setChoosePositionsOpen] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState<
    JobPositionResponse[]
  >((data as RolePositionDetailByRoleResponse)?.jobPositions || []);
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    setError,
  } = useForm<RolePositionByRoleFormData>({
    resolver: zodResolver(rolePositionByRoleSchema),
    defaultValues: {
      roleId: data?.role?.id || 0,
      jobPositionIds: data?.jobPositions?.map((jp) => jp.id) || [],
    },
  });

  const createMutation = useAssignPositionsToRole();
  const updateMutation = useUpdatePositionsForRole();

  // Sync selected positions to form
  useEffect(() => {
    setValue(
      "jobPositionIds",
      selectedPositions.map((jp) => jp.id),
    );
  }, [selectedPositions, setValue]);

  // Set initial data when editing
  useEffect(() => {
    if (data) {
      setValue("roleId", data.role?.id || 0);
      setSelectedPositions(data.jobPositions || []);
    }
  }, [data, setValue]);

  const watchedRoleId = useWatch({ control, name: "roleId" });

  const handleChoosePositions = (positions: JobPositionResponse[]) => {
    setSelectedPositions(positions);
  };

  const handleRemovePosition = (positionId: number) => {
    setSelectedPositions((prev) => prev.filter((jp) => jp.id !== positionId));
  };

  const onSubmit = (formData: RolePositionByRoleFormData) => {
    const payload = {
      roleId: formData.roleId,
      jobPositionIds: formData.jobPositionIds,
    };

    if (isEditing && (data as RolePositionDetailByRoleResponse)?.role?.id) {
      updateMutation.mutate(
        {
          roleId: (data as RolePositionDetailByRoleResponse).role.id,
          data: payload as RolePositionByRoleRequest,
        },
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
      createMutation.mutate(payload as RolePositionByRoleRequest, {
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
            Role Position Information (By Role)
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Role dropdown */}
            <div className="space-y-2">
              <Label>
                Role <span className="text-red-500">*</span>
              </Label>
              <QuerySelect<InputValue, OptionItem>
                value={watchedRoleId || ""}
                onValueChange={(value) => setValue("roleId", Number(value))}
                options={[]}
                asyncOptionQuery={usePaginateRoleOptions}
                itemToOption={(item) => ({
                  label: item.alias
                    ? `${item.alias} - ${item.label}`
                    : item.label,
                  value: item.value,
                  description: "",
                })}
                placeholder="Select role..."
                disabled={isLoading || isEditing}
                aria-invalid={!!errors.roleId}
              />
              {errors.roleId && (
                <p className="text-sm text-red-600">{errors.roleId.message}</p>
              )}
            </div>

            {/* Job Position chooser */}
            <div className="space-y-2">
              <Label>
                Job Position <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-start gap-2">
                <div className="flex-1 min-h-10.5 border rounded-md p-2">
                  {selectedPositions.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => setChoosePositionsOpen(true)}
                      className="w-full text-left text-muted-foreground text-sm"
                    >
                      Choose Job Positions
                    </button>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPositions.map((jp) => (
                        <Badge
                          key={jp.id}
                          variant="outline"
                          className="text-xs gap-1"
                        >
                          <button
                            type="button"
                            onClick={() => setChoosePositionsOpen(true)}
                          >
                            {jp.code} - {jp.name}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemovePosition(jp.id)}
                            aria-label={`Remove ${jp.name}`}
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
                  onClick={() => setChoosePositionsOpen(true)}
                  disabled={isLoading}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              {errors.jobPositionIds && (
                <p className="text-sm text-red-600">
                  {errors.jobPositionIds.message}
                </p>
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

      <ChooseJobPositionsDialog
        open={choosePositionsOpen}
        onOpenChange={setChoosePositionsOpen}
        jobPositions={selectedPositions}
        onChoose={handleChoosePositions}
      />
    </>
  );
}
