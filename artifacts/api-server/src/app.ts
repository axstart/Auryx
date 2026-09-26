import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "@workspace/db";
import router from "./routes";
import { logger } from "./lib/logger";

const PgSession = connectPgSimple(session);

const app: Express = express();

// Trust the reverse proxy (Render, local tunnel, etc.) so req.secure = true
// for HTTPS requests. Required for cookie.secure in production — without this,
// express-session sees the internal HTTP connection and refuses to set the
// Secure cookie, breaking sessions entirely behind the proxy.
app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ origin: true, credentials: true }));

// Session middleware
app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "session",
    }),
    secret: (() => {
      const s = process.env.SESSION_SECRET;
      if (!s && process.env.NODE_ENV === "production") {
        throw new Error("SESSION_SECRET environment variable is required in production");
      }
      return s ?? "auryx-dev-secret-DO-NOT-USE-IN-PROD";
    })(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    },
  }),
);

// Webhook routes require raw body for HMAC signature verification — must be before express.json()
app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));
app.use("/api/webhooks/paymentnode", express.raw({ type: "*/*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
