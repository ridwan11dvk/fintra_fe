import {
  EXTERNAL_USER_CREATE_PAGE_TITLE,
  EXTERNAL_USER_LIST_PAGE_TITLE,
  ExternalUserForm,
  SETTINGS_PAGE_TITLE,
  USER_CREATE_PERMISSION,
  USER_LIST_PAGE_TITLE,
  USER_URL,
  externalUserCreateUrl,
  useCreateExternalUserMutation,
  userQueryKeys,
  type ExternalUserFormData,
  type ExternalUserRequest,
} from "@/features/settings";
import { Page } from "@railfinance/core/components/page-shell";
import { getErrorMessage, toast } from "@railfinance/core/lib";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

const assignIfPresent = (
  value: string | null | undefined,
  assign: (value: string) => void,
): void => {
  if (value) assign(value);
};

export function AddExternalUserPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createUserMutation = useCreateExternalUserMutation({
    onSuccess: (response) => {
      if (response.status === "SUCCESS") {
        toast.success(response.message || "External user created successfully");
        queryClient.invalidateQueries({ queryKey: userQueryKeys.external() });
        navigate(-1);
      }
    },
    onError: (error) => {
      console.error("Failed to create user:", error);
      toast.error(getErrorMessage(error) || "Failed to create user");
    },
  });

  const handleSubmit = (data: ExternalUserFormData) => {
    const payload: ExternalUserRequest = {
      userType: data.userType,
      name: data.name,
      email: data.email,
      username: data.username,
      roles: data.roles,
      twoFactorEnabled: data.twoFactorEnabled,
    };

    assignIfPresent(data.password, (value) => {
      payload.password = value;
    });
    assignIfPresent(data.phoneNumber, (value) => {
      payload.phoneNumber = value;
    });
    assignIfPresent(data.dateOfBirth, (value) => {
      payload.dateOfBirth = value;
    });
    assignIfPresent(data.placeOfBirth, (value) => {
      payload.placeOfBirth = value;
    });
    assignIfPresent(data.privyId, (value) => {
      payload.privyId = value;
    });
    assignIfPresent(data.photo, (value) => {
      payload.photo = value;
    });
    assignIfPresent(data.nik, (value) => {
      payload.nik = value;
    });
    assignIfPresent(data.npwp, (value) => {
      payload.npwp = value;
    });
    assignIfPresent(data.ktpFile, (value) => {
      payload.ktpFile = value;
    });
    assignIfPresent(data.npwpFile, (value) => {
      payload.npwpFile = value;
    });
    assignIfPresent(data.address, (value) => {
      payload.address = value;
    });
    assignIfPresent(data.companyCode, (value) => {
      payload.companyCode = value;
    });
    assignIfPresent(data.companyName, (value) => {
      payload.companyName = value;
    });
    assignIfPresent(data.partnerCode, (value) => {
      payload.partnerCode = value;
    });
    assignIfPresent(data.businessAreaCode, (value) => {
      payload.businessAreaCode = value;
    });
    assignIfPresent(data.businessAreaName, (value) => {
      payload.businessAreaName = value;
    });
    assignIfPresent(data.supervisorPositionCode, (value) => {
      payload.supervisorPositionCode = value;
    });
    assignIfPresent(data.supervisorPositionName, (value) => {
      payload.supervisorPositionName = value;
    });
    assignIfPresent(data.responsibleName, (value) => {
      payload.responsibleName = value;
    });
    assignIfPresent(data.responsibleEmail, (value) => {
      payload.responsibleEmail = value;
    });
    assignIfPresent(data.responsibleNik, (value) => {
      payload.responsibleNik = value;
    });
    assignIfPresent(data.responsibleAddress, (value) => {
      payload.responsibleAddress = value;
    });
    assignIfPresent(data.purpose, (value) => {
      payload.purpose = value;
    });
    assignIfPresent(data.startDate, (value) => {
      payload.startDate = value;
    });
    assignIfPresent(data.endDate, (value) => {
      payload.endDate = value;
    });
    assignIfPresent(data.otpSecret, (value) => {
      payload.otpSecret = value;
    });

    createUserMutation.mutate(payload);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Page
      type="base"
      title={EXTERNAL_USER_CREATE_PAGE_TITLE}
      permission={USER_CREATE_PERMISSION}
      breadcrumbs={[
        { title: SETTINGS_PAGE_TITLE, url: "#" },
        { title: USER_LIST_PAGE_TITLE, url: USER_URL },
        { title: EXTERNAL_USER_LIST_PAGE_TITLE, url: USER_URL },
        {
          title: EXTERNAL_USER_CREATE_PAGE_TITLE,
          url: externalUserCreateUrl(),
        },
      ]}
    >
      <div className="container mx-auto py-6">
        <ExternalUserForm
          action="create"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          defaultValues={{
            roles: [],
            twoFactorEnabled: false,
          }}
          isLoading={createUserMutation.isPending}
        />
      </div>
    </Page>
  );
}

export default AddExternalUserPage;
