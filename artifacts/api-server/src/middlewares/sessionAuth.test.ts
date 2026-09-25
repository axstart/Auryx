import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { NextFunction, Request, Response } from "express";
import { requireAdmin, sessionAuth } from "./sessionAuth.ts";

function mockRes() {
  const res = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(body: unknown) {
      this.body = body;
      return this;
    },
  };
  return res as typeof res & Response;
}

function mockReq(role?: "admin" | "staff") {
  return {
    session: role
      ? { user: { id: 1, email: `${role}@auryx.test`, name: role, role } }
      : {},
  } as unknown as Request;
}

describe("sessionAuth / requireAdmin", () => {
  it("sessionAuth rejects anonymous callers", () => {
    const res = mockRes();
    let nextCalled = false;
    sessionAuth(mockReq(), res, (() => {
      nextCalled = true;
    }) as NextFunction);
    assert.equal(res.statusCode, 401);
    assert.equal(nextCalled, false);
  });

  it("requireAdmin rejects staff on mutating surfaces", () => {
    const res = mockRes();
    let nextCalled = false;
    requireAdmin(mockReq("staff"), res, (() => {
      nextCalled = true;
    }) as NextFunction);
    assert.equal(res.statusCode, 403);
    assert.deepEqual(res.body, { error: "Admin access required" });
    assert.equal(nextCalled, false);
  });

  it("requireAdmin allows admin", () => {
    const res = mockRes();
    let nextCalled = false;
    requireAdmin(mockReq("admin"), res, (() => {
      nextCalled = true;
    }) as NextFunction);
    assert.equal(nextCalled, true);
    assert.equal(res.statusCode, 200);
  });
});
