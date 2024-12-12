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


/**
 * Creates a standardized error data object.
 * @param {boolean} [isAborted=false] - Indicates if the request was aborted.
 * @param {string} [error] - The error message (optional).
 * @param {string} [errorDescription] - The error description (optional).
 * @returns {ApiErrorData<ErrorData>} The error data object.
 */
export function getErrorData(isAborted?: boolean, error?: string, errorDescription?: string): ApiErrorData<ErrorData> {
  return {
    is_aborted: isAborted,
    error_data : {
      error: `${error || GENERIC_ERROR_TITLE}`.replace(/_/g, ' '),
      error_description: `${errorDescription || GENERIC_ERROR_DESC}`.replace(/_/g, ' '),
    }
  };
}

/**
 * Type guard to check if a given error is of type ApiErrorData.
 * @param {unknown} error - The error to check.
 * @returns {boolean} True if the error is an ApiErrorData object, false otherwise.
 */
export function isApiErrorData(error: unknown): error is ApiErrorData<unknown> {
  return typeof error === 'object' && error !== null && 'is_aborted' in error;
}

///////////////////////////////////////
// Fetch Api
///////////////////////////////////////
export type Response<Result, ErrorResponse> = [ApiErrorData<ErrorResponse>, undefined] | [undefined, Result];


/**
 * A general-purpose API function that makes requests to an external API.
 * @template Result - The type of the successful response data.
 * @template ErrorResponse - The type of error response data (optional, defaults to ErrorData).
 * @template Params - The type of the parameters to be sent with the request (optional).
 * @param {'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} type - The HTTP method to use for the request.
 * @param {string} url - The URL to which the request is sent.
 * @param {Params} [params] - The parameters for the request body (optional).
 * @param {HeadersInit} [headers] - Additional headers to be included with the request (optional).
 * @param {AbortController} [controller] - The controller used to abort the request (optional).
 * @returns {Promise<Response<Result, ErrorResponse>>} A promise resolving to the API response, including any error.
 */
async function API<Result, ErrorResponse = ErrorData, Params = undefined>(
  type: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  params?: Params,
  headers?: HeadersInit,
  controller?: AbortController
): Promise<Response<Result, ErrorResponse>> {
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

    if (result.ok && returnData) {
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
        } as ApiErrorData<ErrorResponse>,
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
      } as ApiErrorData<ErrorResponse>,
      undefined,
    ]
  }
}

/**
 * Convenience method to handle GET requests.
 * @template Result - The type of the successful response data.
 * @template ErrorResponse - The type of error response data (optional, defaults to ErrorData).
 * @param {string} url - The URL to which the request is sent.
 * @param {HeadersInit} [headers] - Additional headers to be included with the request (optional).
 * @param {AbortController} [controller] - The controller used to abort the request (optional).
 * @returns {Promise<Response<Result, ErrorResponse>>} A promise resolving to the API response, including any error.
 */
export async function GET<Result, ErrorResponse = ErrorData>(
  url: string,
  headers?: HeadersInit,
  controller?: AbortController
): Promise<Response<Result, ErrorResponse>> {
  return API<Result, ErrorResponse>('GET', url, undefined, headers, controller);
}
