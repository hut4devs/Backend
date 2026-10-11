import { describe, expect, it } from "vitest";
import { loadEnvironment } from "../../src/infrastructure/config/env.js";

describe("loadEnvironment", () => {
  it("defaults to development with in-memory mode", () => {
    expect(loadEnvironment({})).toEqual({ nodeEnv: "development", databaseMode: "memory" });
  });

  it("requires a database URL in production", () => {
    expect(() => loadEnvironment({ NODE_ENV: "production" })).toThrow("DATABASE_URL is required in production.");
  });

  it("rejects in-memory mode in production", () => {
    expect(() => loadEnvironment({ NODE_ENV: "production", DATABASE_URL: "postgres://user:secret@localhost/db", DATABASE_MODE: "memory" })).toThrow("DATABASE_MODE must be postgres in production");
  });

  it("never exposes a database URL secret in validation errors", () => {
    const secretUrl = "postgres://user:secret-value@localhost/db";
    try {
      loadEnvironment({ NODE_ENV: "production", DATABASE_URL: secretUrl, DATABASE_MODE: "memory" });
      throw new Error("Expected configuration validation to fail.");
    } catch (error) {
      expect(String(error)).not.toContain("secret-value");
    }
  });

  it("rejects unsupported environment names", () => {
    expect(() => loadEnvironment({ NODE_ENV: "staging" })).toThrow("Invalid NODE_ENV.");
  });
});
