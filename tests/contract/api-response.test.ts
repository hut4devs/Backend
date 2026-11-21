import { describe, expect, it } from "vitest";
import {
  ApiError,
  ERROR_CODES,
  ERROR_STATUS,
  apiErrors,
  created,
  isErrorBody,
  ok,
  toErrorResponse,
  type ApiBody,
} from "../../src/api/contracts/index.js";

describe("success envelope", () => {
  it("wraps data with success: true and status 200", () => {
    expect(ok({ id: "m_1" })).toEqual({ status: 200, body: { success: true, data: { id: "m_1" } } });
  });

  it("uses status 201 for created resources and carries meta when given", () => {
    const response = created({ id: "m_2" }, { requestId: "req-1" });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ success: true, data: { id: "m_2" }, meta: { requestId: "req-1" } });
  });

  it("omits meta entirely when none is given", () => {
    expect("meta" in ok([]).body).toBe(false);
  });
});

describe("error envelope", () => {
  it("renders a validation error as 400 with field-level details", () => {
    const error = apiErrors.validation([
      { location: "body", field: "email", message: "Must be a valid email address." },
      { location: "query", field: "limit", message: "Must be between 1 and 100." },
    ]);

    expect(toErrorResponse(error, { requestId: "req-9" })).toEqual({
      status: 400,
      body: {
        success: false,
        error: {
          code: "VALIDATION_FAILED",
          message: "The request is invalid.",
          details: [
            { location: "body", field: "email", message: "Must be a valid email address." },
            { location: "query", field: "limit", message: "Must be between 1 and 100." },
          ],
          requestId: "req-9",
        },
      },
    });
  });

  it("keeps authentication (401) and authorization (403) distinct", () => {
    const unauthenticated = toErrorResponse(apiErrors.unauthenticated());
    const forbidden = toErrorResponse(apiErrors.forbidden());

    expect(unauthenticated.status).toBe(401);
    expect(unauthenticated.body.error.code).toBe("UNAUTHENTICATED");
    expect(forbidden.status).toBe(403);
    expect(forbidden.body.error.code).toBe("FORBIDDEN");
  });

  it("renders a conflict as 409 with a caller-supplied safe message", () => {
    const response = toErrorResponse(apiErrors.conflict({ message: "This booking was already confirmed." }));
    expect(response).toEqual({
      status: 409,
      body: { success: false, error: { code: "CONFLICT", message: "This booking was already confirmed." } },
    });
  });

  it("renders an explicit server error as 500", () => {
    const response = toErrorResponse(apiErrors.internal());
    expect(response.status).toBe(500);
    expect(response.body.error).toEqual({ code: "INTERNAL_ERROR", message: "An unexpected error occurred." });
  });

  it("maps every error code to its own documented status", () => {
    for (const code of ERROR_CODES) {
      expect(toErrorResponse(new ApiError(code)).status).toBe(ERROR_STATUS[code]);
    }
    expect(new Set(Object.values(ERROR_STATUS)).size).toBe(ERROR_CODES.length);
  });

  it("only validation errors carry details", () => {
    const issue = { location: "body", field: "name", message: "Required." } as const;
    const conflict = new ApiError("CONFLICT", { details: [issue] });

    expect(conflict.details).toBeUndefined();
    expect("details" in toErrorResponse(conflict).body.error).toBe(false);
    expect("details" in toErrorResponse(apiErrors.validation([])).body.error).toBe(false);
  });
});

describe("unexpected errors", () => {
  it("never leaks the message, stack or cause of a non-API error", () => {
    const leaky = new Error('connect ECONNREFUSED postgres://admin:s3cret@db.internal:5432/hut4devs');
    const response = toErrorResponse(leaky, { requestId: "req-3" });
    const serialized = JSON.stringify(response.body);

    expect(response.status).toBe(500);
    expect(response.body.error).toEqual({
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred.",
      requestId: "req-3",
    });
    expect(serialized).not.toContain("postgres://");
    expect(serialized).not.toContain("s3cret");
    expect(serialized).not.toContain("stack");
  });

  it("keeps an ApiError's cause server-side", () => {
    const error = apiErrors.notFound({ cause: new Error("row 42 missing in members table") });
    const serialized = JSON.stringify(toErrorResponse(error).body);

    expect(error.cause).toBeInstanceOf(Error);
    expect(serialized).not.toContain("row 42");
    expect(serialized).not.toContain("members table");
  });

  it("treats thrown non-Error values as internal errors", () => {
    for (const thrown of ["boom", 42, null, undefined, { code: "CONFLICT" }]) {
      const response = toErrorResponse(thrown);
      expect(response.status).toBe(500);
      expect(response.body.error.code).toBe("INTERNAL_ERROR");
    }
  });
});

describe("envelope discrimination", () => {
  it("lets a client tell success from error by the success flag alone", () => {
    const bodies: ApiBody<{ id: string }>[] = [ok({ id: "a" }).body, toErrorResponse(apiErrors.forbidden()).body];
    expect(bodies.map(isErrorBody)).toEqual([false, true]);
  });
});
