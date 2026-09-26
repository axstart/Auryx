import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { connectionStringWithPgSsl, pgPoolConfig, pgSslConfig } from "./pgSsl.ts";

describe("pgSslConfig", () => {
  const previous = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED;

  function restoreEnv() {
    if (previous === undefined) {
      delete process.env.DATABASE_SSL_REJECT_UNAUTHORIZED;
    } else {
      process.env.DATABASE_SSL_REJECT_UNAUTHORIZED = previous;
    }
  }

  it("skips SSL for local Postgres without sslmode", () => {
    delete process.env.DATABASE_SSL_REJECT_UNAUTHORIZED;
    try {
      assert.equal(pgSslConfig("postgres://user:pass@localhost:5432/auryx"), undefined);
      assert.equal(pgSslConfig("postgres://user:pass@127.0.0.1:5432/auryx"), undefined);
    } finally {
      restoreEnv();
    }
  });

  it("relaxes verification for hosted Postgres even when sslmode=require", () => {
    delete process.env.DATABASE_SSL_REJECT_UNAUTHORIZED;
    try {
      assert.deepEqual(
        pgSslConfig("postgresql://postgres.abc:pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres"),
        { rejectUnauthorized: false },
      );
      assert.deepEqual(
        pgSslConfig("postgresql://postgres:pass@db.abc.supabase.co:5432/postgres?sslmode=require"),
        { rejectUnauthorized: false },
      );
    } finally {
      restoreEnv();
    }
  });

  it("verifies the chain when DATABASE_SSL_REJECT_UNAUTHORIZED=true", () => {
    process.env.DATABASE_SSL_REJECT_UNAUTHORIZED = "true";
    try {
      assert.deepEqual(
        pgSslConfig("postgresql://postgres:pass@db.abc.supabase.co:5432/postgres"),
        { rejectUnauthorized: true },
      );
    } finally {
      restoreEnv();
    }
  });
});

describe("pgPoolConfig", () => {
  it("does not pass connectionString so node-pg cannot overwrite ssl", () => {
    const cfg = pgPoolConfig(
      "postgresql://u:p%40ss@db.abc.supabase.co:6543/postgres?sslmode=require",
    );
    assert.equal(cfg.connectionString, undefined);
    assert.equal(cfg.host, "db.abc.supabase.co");
    assert.equal(cfg.port, 6543);
    assert.equal(cfg.user, "u");
    assert.equal(cfg.password, "p@ss");
    assert.equal(cfg.database, "postgres");
    assert.deepEqual(cfg.ssl, { rejectUnauthorized: false });
  });
});

describe("connectionStringWithPgSsl", () => {
  it("rewrites sslmode=require to no-verify for URL-only clients", () => {
    assert.equal(
      connectionStringWithPgSsl("postgresql://u:p@db.abc.supabase.co:5432/postgres?sslmode=require"),
      "postgresql://u:p@db.abc.supabase.co:5432/postgres?sslmode=no-verify",
    );
  });
});
