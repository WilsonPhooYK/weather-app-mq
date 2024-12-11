///////////////////////////////////////
// Error Handling
///////////////////////////////////////
export const GENERIC_ERROR_TITLE = 'An unexpected error occurred';
export const GENERIC_ERROR_DESC = 'Unable to retrieve information. Please try again later.';

export interface ApiErrorData<InputErrorData> {
  // Abort error from abort controller
  is_aborted?: boolean;
  error_data?: InputErrorData,
}

export interface ErrorData {
  error?: string;
  error_description?: string;
}

// Unifies all API errors into a standard type for FE to use
export function getErrorData(isAborted?: boolean, error?: string, errorDescription?: string): ApiErrorData<ErrorData> {
  return {
    is_aborted: isAborted,
    error_data : {
      error: `${error || GENERIC_ERROR_TITLE}`.replace(/_/g, ' '),
      error_description: `${errorDescription || GENERIC_ERROR_DESC}`.replace(/_/g, ' '),
    }
  };
}
export function isApiErrorData(error: unknown): error is ApiErrorData<unknown> {
  return typeof error === 'object' && error !== null && 'is_aborted' in error;
}

///////////////////////////////////////
// Fetch Api
///////////////////////////////////////
export type Response<Result, ErrorData> = [ApiErrorData<ErrorData> | undefined, Result | undefined];

async function API<Result, ErrorData, Params = undefined>(
  type: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  params?: Params,
  headers?: HeadersInit,
  controller?: AbortController
): Promise<Response<Result, ErrorData>> {
  try {
    const result = await fetch(url, {
      method: type,
      cache: 'no-cache',
      headers: {
        ...(params instanceof FormData || !params ? {} : { 'Content-Type': 'application/json' }),
        ...headers,
      },
      ...(type === 'GET' || type === 'DELETE'
        ? {}
        : {
            body: params instanceof FormData ? params : JSON.stringify(params),
          }),
      signal: controller?.signal,
    });

    const contentType = result?.headers?.get?.('content-type')?.toLowerCase() || '';

    // Result can be JSON, or HTML text (This might return when internal server error as well)
    const returnData = /application\/json/.test(contentType)
      ? ((await result.json?.()) as Result)
      : /text\/html/.test(contentType)
        ? ((await result.text()) as Result)
        : undefined;

    if (result.ok) {
      return [
        // No error
        undefined,
        // Return json or text
        returnData,
      ];
    }

    throw returnData;
  } catch (error) {
    // Test for abort error
    if (controller?.signal.aborted || (error instanceof DOMException && error.name === 'AbortError')) {
      return [
        {
          is_aborted: true,
        } as ApiErrorData<ErrorData>,
        undefined,
      ]
    }

    const isInternalServerError = typeof error === 'string';

    // Case for Api error and internal server error
    return [
      {
        // Internal server error
        is_error_html: isInternalServerError,
        is_aborted: false,
        // No use taking the error HTML, return undefined to display generic error
        error_data: isInternalServerError ? undefined : error,
      } as ApiErrorData<ErrorData>,
      undefined,
    ]
  }
}

export async function GET<Result, ErrorData>(
  url: string,
  headers?: HeadersInit,
  controller?: AbortController
): Promise<Response<Result, ErrorData>> {
  return API<Result, ErrorData>('GET', url, undefined, headers, controller);
}
