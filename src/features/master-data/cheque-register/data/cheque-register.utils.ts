export const CHEQUE_REGISTER_BASE = "cheque-register";
export const CHEQUE_REGISTER_URL = `/master-data/${CHEQUE_REGISTER_BASE}`;
export const CHEQUE_REGISTER_CREATE_URL = `${CHEQUE_REGISTER_URL}/create`;
export const CHEQUE_REGISTER_LIST_PAGE_TITLE = "Cheque Register";
export const chequeRegisterDetailUrl = (id: string) => `${CHEQUE_REGISTER_URL}/${id}`;
export const chequeRegisterEditUrl = (id: string) => `${chequeRegisterDetailUrl(id)}/edit`;
export const chequeRegisterQueryKeys = {
  all: ["master-data-cheque-register"] as const,
  lists: () => [...chequeRegisterQueryKeys.all, "list"] as const,
  list: (params: { page: number; pageSize: number; search: string }) => [...chequeRegisterQueryKeys.lists(), params] as const,
  detail: (id: string) => [...chequeRegisterQueryKeys.all, "detail", id] as const,
};
