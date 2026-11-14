interface PageResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export function toDataTableResponse<T>(result: PageResult<T>) {
  const from = result.totalItems === 0
    ? 0
    : (result.page - 1) * result.pageSize + 1;

  return {
    status: "SUCCESS" as const,
    message: "Data loaded successfully",
    data: {
      content: result.items,
      pagination: {
        total: result.totalItems,
        pageSize: result.pageSize,
        pageNumber: result.page,
        currentPage: result.page,
        totalPages: result.totalPages,
        from,
        to: Math.min(result.page * result.pageSize, result.totalItems),
      },
    },
  };
}
