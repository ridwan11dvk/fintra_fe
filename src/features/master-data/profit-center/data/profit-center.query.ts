export const profitCenterQueryKeys = {
  all: ["profit-centers"] as const,
  lists: () => [...profitCenterQueryKeys.all, "list"] as const,
  list: (params: { search: string; page: number; pageSize: number }) =>
    [...profitCenterQueryKeys.lists(), params] as const,
  detail: (id: string) => [...profitCenterQueryKeys.all, "detail", id] as const,
};
