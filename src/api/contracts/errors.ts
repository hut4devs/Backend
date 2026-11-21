/**
 * Error contract for every API endpoint.
 *
 * Each error a client can receive has a stable machine-readable `code` and
 * exactly one HTTP status. Clients branch on `code`, never on `message`: the
 * message is safe, human-readable text and may be reworded without notice.
 * See docs/API_CONTRACT.md.
 */

/** Every error code the API can return. */
export const ERROR_CODES = [
  "VALIDATION_FAILED",
  "UNAUTHENTICATED",
  "FORBIDDEN",
  "NOT_FOUND",
  "CONFLICT",
  "RATE_LIMITED",
  "INTERNAL_ERROR",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

/**
 * The single HTTP status each error code maps to.
 *
 * Authentication and authorization are deliberately separate: 401 means the
 * caller has not proven who they are, 403 means they have and are not allowed.
 * Validation uses 400 for any malformed path, query, header or body input.
 */
export const ERROR_STATUS: Readonly<Record<ErrorCode, number>> = {
  VALIDATION_FAILED: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
};

/** Default client-safe message for each code. */
export const DEFAULT_ERROR_MESSAGE: Readonly<Record<ErrorCode, string>> = {
  VALIDATION_FAILED: "The request is invalid.",
  UNAUTHENTICATED: "Authentication is required.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  CONFLICT: "The request conflicts with the current state of the resource.",
  RATE_LIMITED: "Too many requests. Try again later.",
  INTERNAL_ERROR: "An unexpected error occurred.",
};

/** Where an invalid input was found. */
export type ValidationLocation = "path" | "query" | "header" | "body";

/** One invalid input. Only validation errors carry these. */
export interface ValidationIssue {
  /** Which part of the request the input came from. */
  location: ValidationLocation;
  /** Dot-separated path to the field, for example `member.email`. */
  field: string;
  /** Client-safe explanation. Never echoes the submitted value. */
  message: string;
}

export interface ApiErrorOptions {
  message?: string;
  details?: readonly ValidationIssue[];
  /** Diagnostic context for server logs only. Never serialized to clients. */
  cause?: unknown;
}

/**
 * An error the API layer is allowed to show a client.
 *
 * Anything thrown that is not an `ApiError` is treated as an unexpected
 * server error and rendered as `INTERNAL_ERROR` with the default message, so
 * an internal message, stack trace or database detail can never leak.
 */
export class ApiError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly details: readonly ValidationIssue[] | undefined;

  constructor(code: ErrorCode, options: ApiErrorOptions = {}) {
    super(options.message ?? DEFAULT_ERROR_MESSAGE[code], { cause: options.cause });
    this.name = "ApiError";
    this.code = code;
    this.status = ERROR_STATUS[code];
    this.details = code === "VALIDATION_FAILED" ? options.details : undefined;
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}

type Options = Omit<ApiErrorOptions, "details">;

export const apiErrors = {
  validation(details: readonly ValidationIssue[], options: Options = {}): ApiError {
    return new ApiError("VALIDATION_FAILED", { ...options, details });
  },
  unauthenticated(options: Options = {}): ApiError {
    return new ApiError("UNAUTHENTICATED", options);
  },
  forbidden(options: Options = {}): ApiError {
    return new ApiError("FORBIDDEN", options);
  },
  notFound(options: Options = {}): ApiError {
    return new ApiError("NOT_FOUND", options);
  },
  conflict(options: Options = {}): ApiError {
    return new ApiError("CONFLICT", options);
  },
  rateLimited(options: Options = {}): ApiError {
    return new ApiError("RATE_LIMITED", options);
  },
  internal(options: Options = {}): ApiError {
    return new ApiError("INTERNAL_ERROR", options);
  },
};
