export const DEPARTMENT_LIST_PAGE_TITLE = "Department";
export const DEPARTMENT_BASE = "department";
export const DEPARTMENT_URL = `/master-data/${DEPARTMENT_BASE}`;
export const DEPARTMENT_CREATE_URL = `${DEPARTMENT_URL}/create`;
export const departmentDetailUrl = (id: string) => `${DEPARTMENT_URL}/${id}`;
export const departmentEditUrl = (id: string) => `${departmentDetailUrl(id)}/edit`;

export const DEPARTMENT_PERMISSION = "master-data:department:";
export const DEPARTMENT_LIST_PERMISSION = `${DEPARTMENT_PERMISSION}list`;
export const DEPARTMENT_CREATE_PERMISSION = `${DEPARTMENT_PERMISSION}create`;
export const DEPARTMENT_EDIT_PERMISSION = `${DEPARTMENT_PERMISSION}edit`;
export const DEPARTMENT_DETAIL_PERMISSION = `${DEPARTMENT_PERMISSION}detail`;

export const departmentQueryKeys = {
  all: ["department"] as const,
  lists: () => [...departmentQueryKeys.all, "list"] as const,
  list: (params: { search: string; page: number; pageSize: number }) => [...departmentQueryKeys.lists(), params] as const,
  details: () => [...departmentQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...departmentQueryKeys.details(), id] as const,
};
