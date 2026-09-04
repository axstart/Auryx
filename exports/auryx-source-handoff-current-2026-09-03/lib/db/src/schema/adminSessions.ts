import { pgTable, text, json, timestamp, index } from "drizzle-orm/pg-core";

export const sessionTable = pgTable(
  "session",
  {
    sid: text("sid").primaryKey(),
    sess: json("sess").notNull(),
    expire: timestamp("expire", { precision: 6 }).notNull(),
  },
  (t) => [index("IDX_session_expire").on(t.expire)],
);
