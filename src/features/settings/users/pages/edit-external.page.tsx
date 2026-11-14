import { DataNotFoundPage, InvalidDataPage } from "@/features/errors";
import {
  EXTERNAL_USER_LIST_PAGE_TITLE,
  EXTERNAL_USER_UPDATE_PAGE_TITLE,
  externalUserDetailUrl,
  ExternalUserForm,
  type ExternalUserFormData,
  type ExternalUserRequest,
  SETTINGS_PAGE_TITLE,
  useGetExternalUser,
  USER_LIST_PAGE_TITLE,
  USER_UPDATE_PERMISSION,
  USER_URL,
  userQueryKeys,
  useUpdateExternalUserMutation,
} from "@/features/settings";
import { mapRolesToIds } from "@/shared/lib/utils";
import { getErrorMessage, toast } from "@railfinance/core/lib";
import { Page } from "@railfinance/core/components/page-shell";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

const assignIfPresent = (
  value: string | null | undefined,
  assign: (value: string) => void,
): void => {
  if (value) assign(value);
};

export function EditExternalUserPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const userId = id ? Number.parseInt(id, 10) : null;

  const { data: userData, isLoading: isLoadingUser } = useGetExternalUser(
    userId!,
    {
      enabled: !!userId,
    },
  );

  const updateUserMutation = useUpdateExternalUserMutation({
    onSuccess: (response) => {
      if (response.status === "SUCCESS") {
        toast.success(response.message || "External user updated successfully");
        queryClient.invalidateQueries({ queryKey: userQueryKeys.external() });
        navigate(-1);
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || "Failed to update user");
    },
  });

  const handleSubmit = (data: ExternalUserFormData) => {
    if (!userId) return;

    const updateData: ExternalUserRequest = {
      userType: data.userType,
      name: data.name,
      email: data.email,
      username: data.username,
      roles: data.roles,
      twoFactorEnabled: data.twoFactorEnabled,
    };

    assignIfPresent(data.password, (value) => {
      updateData.password = value;
    });
    assignIfPresent(data.phoneNumber, (value) => {
      updateData.phoneNumber = value;
    });
    assignIfPresent(data.dateOfBirth, (value) => {
      updateData.dateOfBirth = value;
    });
    assignIfPresent(data.placeOfBirth, (value) => {
      updateData.placeOfBirth = value;
    });
    assignIfPresent(data.privyId, (value) => {
      updateData.privyId = value;
    });
    assignIfPresent(data.photo, (value) => {
      updateData.photo = value;
    });
    assignIfPresent(data.nik, (value) => {
      updateData.nik = value;
    });
    assignIfPresent(data.npwp, (value) => {
      updateData.npwp = value;
    });
    assignIfPresent(data.ktpFile, (value) => {
      updateData.ktpFile = value;
    });
    assignIfPresent(data.npwpFile, (value) => {
      updateData.npwpFile = value;
    });
    assignIfPresent(data.address, (value) => {
      updateData.address = value;
    });
    assignIfPresent(data.companyCode, (value) => {
      updateData.companyCode = value;
    });
    assignIfPresent(data.companyName, (value) => {
      updateData.companyName = value;
    });
    assignIfPresent(data.partnerCode, (value) => {
      updateData.partnerCode = value;
    });
    assignIfPresent(data.businessAreaCode, (value) => {
      updateData.businessAreaCode = value;
    });
    assignIfPresent(data.businessAreaName, (value) => {
      updateData.businessAreaName = value;
    });
    assignIfPresent(data.supervisorPositionCode, (value) => {
      updateData.supervisorPositionCode = value;
    });
    assignIfPresent(data.supervisorPositionName, (value) => {
      updateData.supervisorPositionName = value;
    });
    assignIfPresent(data.responsibleName, (value) => {
      updateData.responsibleName = value;
    });
    assignIfPresent(data.responsibleEmail, (value) => {
      updateData.responsibleEmail = value;
    });
    assignIfPresent(data.responsibleNik, (value) => {
      updateData.responsibleNik = value;
    });
    assignIfPresent(data.responsibleAddress, (value) => {
      updateData.responsibleAddress = value;
    });
    assignIfPresent(data.purpose, (value) => {
      updateData.purpose = value;
    });
    assignIfPresent(data.startDate, (value) => {
      updateData.startDate = value;
    });
    assignIfPresent(data.endDate, (value) => {
      updateData.endDate = value;
    });
    assignIfPresent(data.otpSecret, (value) => {
      updateData.otpSecret = value;
    });

    updateUserMutation.mutate({
      id: userId,
      data: updateData,
    });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (!userId) {
    return (
      <InvalidDataPage title="Edit External User" message="Invalid user ID" />
    );
  }

  if (isLoadingUser) {
    return <Page type="base" title="Edit External User" isLoading />;
  }

  if (!userData?.data) {
    return <DataNotFoundPage title="External User Not Found" />;
  }

  // Map the user data to form data
  const defaultValues: Partial<ExternalUserFormData> = {
    userType: userData.data.userType,
    name: userData.data.name,
    email: userData.data.email,
    username: userData.data.username,
    photo: userData.data.photo,
    phoneNumber: userData.data.phoneNumber,
    dateOfBirth: userData.data.dateOfBirth,
    placeOfBirth: userData.data.placeOfBirth,
    privyId: userData.data.privyId,
    roles: mapRolesToIds(userData.data.roles),
    nik: userData.data.nik,
    npwp: userData.data.npwp,
    ktpFile: userData.data.ktpFile,
    npwpFile: userData.data.npwpFile,
    address: userData.data.address,
    companyCode: userData.data.companyCode,
    companyName: userData.data.companyName,
    partnerCode: userData.data.partnerCode,
    businessAreaCode: userData.data.businessAreaCode,
    businessAreaName: userData.data.businessAreaName,
    supervisorPositionCode: userData.data.supervisorPositionCode,
    supervisorPositionName: userData.data.supervisorPositionName,
    responsibleName: userData.data.responsibleName,
    responsibleEmail: userData.data.responsibleEmail,
    responsibleNik: userData.data.responsibleNik,
    responsibleAddress: userData.data.responsibleAddress,
    purpose: userData.data.purpose,
    startDate: userData.data.startDate,
    endDate: userData.data.endDate,
    twoFactorEnabled: userData.data.twoFactorEnabled,
  };

  return (
    <Page
      type="base"
      title={EXTERNAL_USER_UPDATE_PAGE_TITLE}
      permission={USER_UPDATE_PERMISSION}
      breadcrumbs={[
        { title: SETTINGS_PAGE_TITLE, url: "#" },
        { title: USER_LIST_PAGE_TITLE, url: USER_URL },
        { title: EXTERNAL_USER_LIST_PAGE_TITLE, url: USER_URL },
        {
          title: EXTERNAL_USER_UPDATE_PAGE_TITLE,
          url: externalUserDetailUrl(userId),
        },
      ]}
    >
      <div className="container mx-auto py-6">
        <ExternalUserForm
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

export default EditExternalUserPage;
