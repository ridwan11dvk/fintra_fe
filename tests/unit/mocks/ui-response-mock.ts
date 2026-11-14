import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

/**
 * Spies on the EXTERNAL `sonner` module so tests can assert on toast calls
 * regardless of whether production code calls `toast` from `@railfinance/ui`
 * or from `sonner` directly. The library bundles its own sonner internally
 * (and re-exports it as `toast`), so `vi.mock("sonner")` alone cannot
 * intercept toast calls made through `@railfinance/ui`.
 *
 * Intended use (inside a test file):
 *
 *   vi.mock("@railfinance/core", async (importOriginal) => {
 *     const actual = await importOriginal<typeof import("@railfinance/core")>();
 *     const { buildUiResponseMock } = await import(
 *       "@tests/unit/mocks/ui-response-mock"
 *     );
 *     return buildUiResponseMock(actual);
 *   });
 *
 * Then in a test:  const { toast } = await import("sonner");
 */
export async function buildUiResponseMock<T extends object>(
  actual: T,
): Promise<T & Record<string, unknown>> {
  const ReactMod = await import("react");
  const { toast } = await import("sonner");

  const getErrorMessage = (error: unknown): string => {
    if (typeof error === "string") {
      return error;
    }
    if (typeof error === "object" && error !== null && "response" in error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      return axiosError.response?.data?.message || "An unknown error occurred";
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "An unknown error occurred";
  };

  const useHandleMutationResponse = <
    TData extends { status?: string; message?: string },
    TError,
    TVariables,
  >(
    mutation: UseMutationResult<TData, TError, TVariables>,
    _queryKeys: Array<Array<string | number>>,
    disableSuccessToast = false,
  ) => {
    const handleResponse = ReactMod.useCallback(() => {
      if (mutation.isSuccess && mutation.data) {
        if (mutation.data.status === "SUCCESS" && !disableSuccessToast) {
          toast.success(
            mutation.data.message || "Operation completed successfully",
          );
        } else if (mutation.data.status === "ERROR") {
          toast.error(mutation.data.message || "An error occurred");
        } else if (mutation.data.status === "WARNING") {
          toast.warning(
            mutation.data.message || "Operation completed with warnings",
          );
        }
      } else if (mutation.isError) {
        const message = getErrorMessage(mutation.error);
        toast.error(message || "An error occurred. Please try again.");
      }
    }, [mutation, disableSuccessToast]);

    ReactMod.useEffect(() => {
      handleResponse();
    }, [handleResponse]);
  };

  const useHandleQueryResponse = <
    TData extends { status?: string; message?: string },
    TError,
  >(
    query: UseQueryResult<TData, TError>,
    disableSuccessToast = true,
  ) => {
    ReactMod.useEffect(() => {
      if (query.isSuccess && query.data) {
        if (query.data.status === "SUCCESS" && !disableSuccessToast) {
          toast.success(query.data.message || "Data loaded successfully");
        }
      }
    }, [query.isSuccess, query.data, disableSuccessToast]);

    ReactMod.useEffect(() => {
      if (query.isError) {
        const message = getErrorMessage(query.error);
        toast.error(message || "Failed to load data");
      }
    }, [query.isError, query.error]);
  };

  return {
    ...actual,
    // Route toast calls made through @railfinance/ui to the external
    // `sonner` module that test files mock and assert on.
    toast,
    useHandleMutationResponse,
    useHandleQueryResponse,
  };
}
