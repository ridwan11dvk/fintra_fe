export const KBLI_LIST_PAGE_TITLE = "KBLI";
export const KBLI_BASE = "kbli";
export const KBLI_URL = `/master-data/${KBLI_BASE}`;
export const KBLI_CREATE_URL = `${KBLI_URL}/create`;
export const kbliDetailUrl = (id: string) => `${KBLI_URL}/${id}`;
export const kbliEditUrl = (id: string) => `${kbliDetailUrl(id)}/edit`;

export const KBLI_PERMISSION = "master-data:kbli:";
export const KBLI_LIST_PERMISSION = `${KBLI_PERMISSION}list`;
export const KBLI_CREATE_PERMISSION = `${KBLI_PERMISSION}create`;
export const KBLI_EDIT_PERMISSION = `${KBLI_PERMISSION}update`;
export const KBLI_DETAIL_PERMISSION = `${KBLI_PERMISSION}read`;

export const kbliQueryKeys = {
  all: ["kbli"] as const,
  lists: () => [...kbliQueryKeys.all, "list"] as const,
  list: (params: { search: string; page: number; pageSize: number }) => [...kbliQueryKeys.lists(), params] as const,
  details: () => [...kbliQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...kbliQueryKeys.details(), id] as const,
};
