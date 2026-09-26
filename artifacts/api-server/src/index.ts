import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvFile } from "./lib/loadEnv.js";

loadEnvFile();
loadEnvFile(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../.env"));

import app from "./app";
import { logger } from "./lib/logger";
import { verifyMailer } from "./lib/mailer.js";
import { syncInventoryFromCatalog } from "./lib/syncInventory.js";
import { initApiSentry } from "./lib/sentry.js";
import { seedCoaBatchesFromCatalog } from "./routes/coa/index.js";
import { ensureOrdersCouponColumns } from "./routes/shop/ordersSelect.js";
import { processEmailJourneys, enrollWinBackCandidates } from "./routes/marketing/index.js";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

void initApiSentry().finally(() => {
  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
    verifyMailer();
    syncInventoryFromCatalog();
    seedCoaBatchesFromCatalog().catch((e) => logger.warn({ err: e }, "COA seed failed"));
    ensureOrdersCouponColumns()
      .then(() => logger.info("orders coupon columns ensured"))
      .catch((e) => logger.warn({ err: e }, "orders coupon column ensure failed"));

    const JOURNEY_MS = 15 * 60 * 1000;
    setInterval(() => {
      enrollWinBackCandidates()
        .then((n) => {
          if (n > 0) logger.info({ n }, "Win-back enrollments");
        })
        .catch((e) => logger.warn({ err: e }, "Win-back enroll failed"));
      processEmailJourneys()
        .then((sent) => {
          if (sent.emails > 0 || sent.sms > 0) {
            logger.info(sent, "Journey messages sent");
          }
        })
        .catch((e) => logger.warn({ err: e }, "Journey processing failed"));
    }, JOURNEY_MS);
  });
});
