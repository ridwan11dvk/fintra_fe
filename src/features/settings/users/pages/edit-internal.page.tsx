import { DataNotFoundPage, InvalidDataPage } from "@/features/errors";
import {
  INTERNAL_USER_LIST_PAGE_TITLE,
  INTERNAL_USER_UPDATE_PAGE_TITLE,
  internalUserDetailUrl,
  InternalUserForm,
  SETTINGS_PAGE_TITLE,
  useGetInternalUser,
  usePatchInternalUserMutation,
  USER_LIST_PAGE_TITLE,
  USER_UPDATE_PERMISSION,
  USER_URL,
  userQueryKeys,
  type InternalUserDirectUpdateRequest,
  type InternalUserFormData,
} from "@/features/settings";
import { mapRolesToIds } from "@/shared/lib/utils";
import { getErrorMessage, toast } from "@railfinance/core/lib";
import { Page } from "@railfinance/core/components/page-shell";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

export function EditInternalUserPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const userId = id ? Number.parseInt(id, 10) : null;

  const { data: userData, isLoading: isLoadingUser } = useGetInternalUser(
    userId!,
    {
      enabled: !!userId,
    },
  );

  const updateUserMutation = usePatchInternalUserMutation({
    onSuccess: (response) => {
      if (response.status === "SUCCESS") {
        toast.success(response.message || "Internal user updated successfully");
        queryClient.invalidateQueries({ queryKey: userQueryKeys.internal() });
        navigate(-1);
      }
    },
    onError: (error) => {
      console.error("Failed to update user:", error);
      toast.error(getErrorMessage(error) || "Failed to update user");
    },
  });

  const handleSubmit = (data: InternalUserFormData) => {
    if (!userId) return;
    const { gender, ...rest } = data;
    const payload = {
      ...rest,
      genderName: gender,
    };
    updateUserMutation.mutate({
      id: userId,
      data: payload as InternalUserDirectUpdateRequest,
    });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!userId) {
    return (
      <InvalidDataPage title="Edit Internal User" message="Invalid user ID" />
    );
  }

  if (isLoadingUser) {
    return <Page type="base" title="Edit Internal User" isLoading />;
  }

  if (!userData?.data) {
    return <DataNotFoundPage title="Internal User Not Found" />;
  }

  const d = userData.data;

  const defaultValues: Partial<InternalUserFormData> = {
    nipp: d.nipp,
    name: d.name,
    email: d.email,
    phoneNumber: d.phoneNumber || "",
    photo: d.photo || "",
    nik: d.nik || "",
    dateOfBirth: d.dateOfBirth || "",
    placeOfBirth: d.placeOfBirth || "",
    privyId: d.privyId || "",
    companyCode: d.companyCode,
    companyName: d.companyName,
    directorateCode: d.directorateCode || "",
    directorateName: d.directorateName || "",
    directorateNomenclature: d.directorateNomenclature || "",
    personalAreaCode: d.personalAreaCode || "",
    personalAreaName: d.personalAreaName || "",
    businessAreaCode: d.businessAreaCode,
    businessAreaName: d.businessAreaName,
    organizationCode: d.organizationCode,
    organizationName: d.organizationName,
    organizationNomenclature: d.organizationNomenclature || "",
    costCenterCode: d.costCenterCode,
    costCenterName: d.costCenterName,
    corsaCode: d.corsaCode || "",
    corsaName: d.corsaName || "",
    corsaNomenclature: d.corsaNomenclature || "",
    jobCode: d.jobCode,
    jobName: d.jobName,
    jobFamilyCode: d.jobFamilyCode || "",
    jobFamilyName: d.jobFamilyName || "",
    subJobFamilyCode: d.subJobFamilyCode || "",
    subJobFamilyName: d.subJobFamilyName || "",
    grade: d.grade || "",
    positionCode: d.positionCode,
    positionName: d.positionName,
    positionNomenclature: d.positionNomenclature || "",
    workerGroupCode: d.workerGroupCode || "",
    workerGroupName: d.workerGroupName || "",
    subWorkerGroupCode: d.subWorkerGroupCode || "",
    subWorkerGroupName: d.subWorkerGroupName || "",
    tempSupervisorNipp: d.tempSupervisorNipp || "",
    tempSupervisorName: d.tempSupervisorName || "",
    supervisorLevelOneNipp: d.supervisorLevelOneNipp || "",
    supervisorLevelOneName: d.supervisorLevelOneName || "",
    supervisorLevelOnePosition: d.supervisorLevelOnePosition,
    supervisorLevelTwoNipp: d.supervisorLevelTwoNipp || "",
    supervisorLevelTwoName: d.supervisorLevelTwoName || "",
    supervisorLevelTwoPosition: d.supervisorLevelTwoPosition,
    employmentStartDate: d.employmentStartDate || "",
    mutationDate: d.mutationDate || "",
    gender: d.genderName || "",
    beginningDate: d.beginningDate || "",
    endingDate: d.endingDate ?? "",
    recordingDate: d.recordingDate || "",
    stat2: d.stat2 || "",
    psCode: d.psCode || "",
    psText: d.psText || "",
    psGroup: d.psGroup || "",
    roles: mapRolesToIds(d.roles),
    status: "active",
  };

  return (
    <Page
      type="base"
      title={INTERNAL_USER_UPDATE_PAGE_TITLE}
      permission={USER_UPDATE_PERMISSION}
      breadcrumbs={[
        { title: SETTINGS_PAGE_TITLE, url: "#" },
        { title: USER_LIST_PAGE_TITLE, url: USER_URL },
        { title: INTERNAL_USER_LIST_PAGE_TITLE, url: USER_URL },
        {
          title: INTERNAL_USER_UPDATE_PAGE_TITLE,
          url: internalUserDetailUrl(userId),
        },
      ]}
    >
      <div className="container mx-auto py-6">
        <InternalUserForm
          action="edit"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          defaultValues={defaultValues}
          isLoading={updateUserMutation.isPending}
        />
      </div>
    </Page>
  );
}

export default EditInternalUserPage;
