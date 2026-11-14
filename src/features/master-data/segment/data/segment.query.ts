export const segmentQueryKeys = {
  all: ["segments"] as const,
  lists: () => [...segmentQueryKeys.all, "list"] as const,
  detail: (segmentId: string) => [...segmentQueryKeys.all, "detail", segmentId] as const,
  list: (params: { search: string; page: number; pageSize: number }) =>
    [...segmentQueryKeys.lists(), params] as const,
};
