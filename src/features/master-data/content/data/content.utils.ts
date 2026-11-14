export const CONTENT_BASE = "content";
export const CONTENT_URL = `/master-data/${CONTENT_BASE}`;
export const CONTENT_CREATE_URL = `${CONTENT_URL}/create`;
export const CONTENT_LIST_PAGE_TITLE = "Content";
export const CONTENT_PERMISSION = "master-data:content:";
export const CONTENT_LIST_PERMISSION = `${CONTENT_PERMISSION}list`;
export const CONTENT_CREATE_PERMISSION = `${CONTENT_PERMISSION}create`;
export const CONTENT_EDIT_PERMISSION = `${CONTENT_PERMISSION}update`;
export const CONTENT_DETAIL_PERMISSION = `${CONTENT_PERMISSION}read`;
export const contentDetailUrl = (id: string) => `${CONTENT_URL}/${id}`;
export const contentEditUrl = (id: string) => `${contentDetailUrl(id)}/edit`;
export const contentQueryKeys = {
  all: ["master-data-content"] as const,
  lists: () => [...contentQueryKeys.all, "list"] as const,
  list: (params: { page: number; pageSize: number; search: string }) => [...contentQueryKeys.lists(), params] as const,
  detail: (id: string) => [...contentQueryKeys.all, "detail", id] as const,
};
