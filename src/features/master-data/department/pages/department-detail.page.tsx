import { departmentQueryKeys, DEPARTMENT_DETAIL_PERMISSION, DEPARTMENT_LIST_PAGE_TITLE, DEPARTMENT_URL, departmentEditUrl } from "../data/department.utils";
import { departmentService } from "../data/department.service";
import { Button } from "@railfinance/core/ui/button";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import "../department-layout.css";

export function DepartmentDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const query = useQuery({ queryKey: departmentQueryKeys.detail(id), queryFn: () => departmentService.get(id), enabled: Boolean(id) });
  const record = query.data;
  const departmentsQuery = useQuery({ queryKey: departmentQueryKeys.list({ search: "", page: 1, pageSize: 1000 }), queryFn: () => departmentService.list({ page: 1, pageSize: 1000 }) });
  const parentName = departmentsQuery.data?.items.find((department) => department.id === record?.parentDepartmentId)?.name;

  return (
    <Page type="base" title="Department Details" permission={import.meta.env.DEV ? undefined : DEPARTMENT_DETAIL_PERMISSION} breadcrumbs={[
      { title: "Master Data", url: "#" },
      { title: DEPARTMENT_LIST_PAGE_TITLE, url: DEPARTMENT_URL },
      { title: record?.name ?? id, url: `${DEPARTMENT_URL}/${id}` },
    ]}>
      <div className="department-page-header">
        <PageHeader title="View Department" withBackButton={false} />
      </div>
      {query.isPending && <output className="mt-6 block text-sm text-muted-foreground">Loading Department…</output>}
      {query.isError && <p className="mt-6 text-sm text-destructive" role="alert">{query.error.message}</p>}
      {record && (
        <section className="department-detail-section">
          <dl className="department-detail-grid">
            <div className="department-detail-row">
              <dt className="department-detail-label">Department Name</dt>
              <dd className="department-detail-value">{record.name}</dd>
            </div>
            <div className="department-detail-row">
              <dt className="department-detail-label">Department Code</dt>
              <dd className="department-detail-value">{record.code}</dd>
            </div>
            <div className="department-detail-row">
              <dt className="department-detail-label">Parent Department</dt>
              <dd className="department-detail-value">{record.parentDepartmentId ? (parentName ?? record.parentDepartmentId) : "—"}</dd>
            </div>
          </dl>
        </section>
      )}
      <div className="mt-5 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => navigate(DEPARTMENT_URL)}>Back</Button>
        {record && <Button type="button" onClick={() => navigate(departmentEditUrl(record.id))}><Pencil aria-hidden="true" className="h-4 w-4" />Edit</Button>}
      </div>
    </Page>
  );
}
