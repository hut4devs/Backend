export type AppEnvironment = "development" | "test" | "production";
export type DatabaseMode = "memory" | "postgres";

export interface EnvironmentConfig {
  nodeEnv: AppEnvironment;
  databaseMode: DatabaseMode;
  databaseUrl?: string;
}

export function loadEnvironment(env: NodeJS.ProcessEnv = process.env): EnvironmentConfig {
  const rawNodeEnv = env.NODE_ENV?.trim() || "development";
  if (![ "development", "test", "production" ].includes(rawNodeEnv)) {
    throw new Error("Invalid NODE_ENV. Expected development, test, or production.");
  }

  const nodeEnv = rawNodeEnv as AppEnvironment;
  const rawDatabaseUrl = env.DATABASE_URL?.trim();
  const rawDatabaseMode = env.DATABASE_MODE?.trim();

  if (rawDatabaseMode && ![ "memory", "postgres" ].includes(rawDatabaseMode)) {
    throw new Error("Invalid DATABASE_MODE. Expected memory or postgres.");
  }

  const databaseMode: DatabaseMode = (rawDatabaseMode as DatabaseMode | undefined) ?? (nodeEnv === "production" ? "postgres" : "memory");

  if (nodeEnv === "production") {
    if (!rawDatabaseUrl) throw new Error("DATABASE_URL is required in production.");
    if (databaseMode !== "postgres") throw new Error("DATABASE_MODE must be postgres in production; in-memory storage is not durable.");
  }

  return { nodeEnv, databaseMode, ...(rawDatabaseUrl ? { databaseUrl: rawDatabaseUrl } : {}) };
}
