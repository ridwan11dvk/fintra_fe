import { Route } from "react-router";
import { DEPARTMENT_BASE } from "./data/department.utils";
import { DepartmentCreateLazyPage, DepartmentDetailLazyPage, DepartmentEditLazyPage, DepartmentListLazyPage } from "./pages";

export const departmentRoutes = <Route>
  <Route path={DEPARTMENT_BASE} element={<DepartmentListLazyPage />} />
  <Route path={`${DEPARTMENT_BASE}/create`} element={<DepartmentCreateLazyPage />} />
  <Route path={`${DEPARTMENT_BASE}/:id`} element={<DepartmentDetailLazyPage />} />
  <Route path={`${DEPARTMENT_BASE}/:id/edit`} element={<DepartmentEditLazyPage />} />
</Route>;
