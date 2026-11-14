import {
  INTERNAL_USER_CREATE_PAGE_TITLE,
  INTERNAL_USER_LIST_PAGE_TITLE,
  internalUserCreateUrl,
  InternalUserForm,
  SETTINGS_PAGE_TITLE,
  useCreateInternalUserDirectMutation,
  USER_CREATE_PERMISSION,
  USER_LIST_PAGE_TITLE,
  USER_URL,
  userQueryKeys,
  type InternalUserDirectCreateRequest,
  type InternalUserFormData,
} from "@/features/settings";
import { Page } from "@railfinance/core/components/page-shell";
import { getErrorMessage, toast } from "@railfinance/core/lib";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export function AddInternalUserPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createUserMutation = useCreateInternalUserDirectMutation({
    onSuccess: (response) => {
      if (response.status === "SUCCESS") {
        toast.success(response.message || "Internal user created successfully");
        queryClient.invalidateQueries({ queryKey: userQueryKeys.internal() });
        navigate(-1);
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || "Failed to create user");
    },
  });

  const handleSubmit = (data: InternalUserFormData) => {
    const { gender, ...rest } = data;
    const payload: unknown = {
      ...rest,
      genderName: gender,
    };
    createUserMutation.mutate(payload as InternalUserDirectCreateRequest);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Page
      type="base"
      title={INTERNAL_USER_CREATE_PAGE_TITLE}
      permission={USER_CREATE_PERMISSION}
      breadcrumbs={[
        { title: SETTINGS_PAGE_TITLE, url: "#" },
        { title: USER_LIST_PAGE_TITLE, url: USER_URL },
        { title: INTERNAL_USER_LIST_PAGE_TITLE, url: USER_URL },
        {
          title: INTERNAL_USER_CREATE_PAGE_TITLE,
          url: internalUserCreateUrl(),
        },
      ]}
    >
      <div className="container mx-auto py-6">
        <InternalUserForm
          action="create"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          defaultValues={{
            roles: [],
            status: "active",
          }}
          isLoading={createUserMutation.isPending}
          submitError={createUserMutation.error}
        />
      </div>
    </Page>
  );
}

export default AddInternalUserPage;
