import { DataNotFoundPage } from "@/features/errors";
import {
  ROLE_POSITION_LIST_PAGE_TITLE,
  ROLE_POSITION_UPDATE_PAGE_TITLE,
  ROLE_POSITION_UPDATE_PERMISSION,
  ROLE_POSITION_URL,
  RolePositionForm,
  rolePositionDetailUrl,
  rolePositionUpdateUrl,
  useRolePositionByPositionId,
} from "@/features/settings/role-position";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { ProgressLoader } from "@railfinance/core/components/loader";
import { useNavigate, useParams } from "react-router";

export function UpdateRolePositionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const jobPositionId = id ? Number.parseInt(id, 10) : null;

  const { data: detailData, isLoading } = useRolePositionByPositionId(
    jobPositionId!,
  );

  if (isLoading) {
    return (
      <Page
        type="base"
        title={ROLE_POSITION_UPDATE_PAGE_TITLE}
        permission={ROLE_POSITION_UPDATE_PERMISSION}
        breadcrumbs={[
          { title: "Settings", url: "#" },
          { title: ROLE_POSITION_LIST_PAGE_TITLE, url: ROLE_POSITION_URL },
          { title: "Loading...", url: "#" },
        ]}
      >
        <div className="flex items-center justify-center h-96">
          <ProgressLoader />
        </div>
      </Page>
    );
  }

  if (!detailData?.data) {
    return <DataNotFoundPage title="Role Position Not Found" />;
  }

  const detail = detailData.data;

  return (
    <Page
      type="base"
      title={ROLE_POSITION_UPDATE_PAGE_TITLE}
      permission={ROLE_POSITION_UPDATE_PERMISSION}
      breadcrumbs={[
        { title: "Settings", url: "#" },
        { title: ROLE_POSITION_LIST_PAGE_TITLE, url: ROLE_POSITION_URL },
        {
          title: detail.jobPosition?.name || "Detail",
          url: rolePositionDetailUrl(jobPositionId!),
        },
        {
          title: ROLE_POSITION_UPDATE_PAGE_TITLE,
          url: rolePositionUpdateUrl(jobPositionId!),
        },
      ]}
    >
      <PageHeader title="Edit Role Position" />

      <div className="mt-6">
        <RolePositionForm
          data={detail}
          isEditing
          onSuccess={() => navigate(rolePositionDetailUrl(jobPositionId!))}
          onCancel={() => navigate(rolePositionDetailUrl(jobPositionId!))}
        />
      </div>
    </Page>
  );
}

export default UpdateRolePositionPage;
