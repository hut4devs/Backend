/**
 * Response envelope for every API endpoint.
 *
 * Success and error bodies share one discriminant, `success`, so a client can
 * tell them apart without inspecting the HTTP status. Both shapes are
 * transport-agnostic: an HTTP adapter sends `status` and `body` as returned.
 * See docs/API_CONTRACT.md.
 */

import {
  ApiError,
  DEFAULT_ERROR_MESSAGE,
  ERROR_STATUS,
  isApiError,
  type ErrorCode,
  type ValidationIssue,
} from "./errors.js";

/** Optional metadata on a success response, such as pagination. */
export interface ResponseMeta {
  requestId?: string;
  page?: { limit: number; nextCursor: string | null };
}

export interface ApiSuccessBody<T> {
  success: true;
  data: T;
  meta?: ResponseMeta;
}

export interface ApiErrorDetail {
  code: ErrorCode;
  message: string;
  /** Present only for `VALIDATION_FAILED`. */
  details?: ValidationIssue[];
  /** Correlates the response with server logs, when the caller supplied one. */
  requestId?: string;
}

export interface ApiErrorBody {
  success: false;
  error: ApiErrorDetail;
}

export type ApiBody<T> = ApiSuccessBody<T> | ApiErrorBody;

/** A status code and body, ready for any HTTP adapter to send. */
export interface ApiResponse<B> {
  status: number;
  body: B;
}

export function ok<T>(data: T, meta?: ResponseMeta): ApiResponse<ApiSuccessBody<T>> {
  return { status: 200, body: meta ? { success: true, data, meta } : { success: true, data } };
}

export function created<T>(data: T, meta?: ResponseMeta): ApiResponse<ApiSuccessBody<T>> {
  return { ...ok(data, meta), status: 201 };
}

export interface ErrorResponseOptions {
  requestId?: string;
}

/**
 * Renders anything thrown into the error envelope.
 *
 * An `ApiError` keeps its code, status, message and (for validation) details.
 * Anything else becomes `INTERNAL_ERROR` with the default message: its own
 * message, stack and cause stay server-side, where they belong in redacted
 * logs, and never reach the client.
 */
export function toErrorResponse(
  error: unknown,
  options: ErrorResponseOptions = {},
): ApiResponse<ApiErrorBody> {
  const known: ApiError | undefined = isApiError(error) ? error : undefined;
  const code: ErrorCode = known?.code ?? "INTERNAL_ERROR";

  const detail: ApiErrorDetail = {
    code,
    message: known?.message ?? DEFAULT_ERROR_MESSAGE.INTERNAL_ERROR,
  };
  if (known?.details && known.details.length > 0) {
    detail.details = known.details.map((issue) => ({ ...issue }));
  }
  if (options.requestId) detail.requestId = options.requestId;

  return { status: ERROR_STATUS[code], body: { success: false, error: detail } };
}

export function isErrorBody<T>(body: ApiBody<T>): body is ApiErrorBody {
  return body.success === false;
}
