import { pgTable, text, serial, boolean, timestamp, index } from "drizzle-orm/pg-core";

export const coaBatchesTable = pgTable(
  "coa_batches",
  {
    id: serial("id").primaryKey(),
    accession: text("accession").notNull().unique(),
    productSlug: text("product_slug").notNull(),
    productName: text("product_name").notNull().default(""),
    label: text("label").notNull(),
    lab: text("lab").notNull(),
    purity: text("purity"),
    pdfUrl: text("pdf_url").notNull(),
    lotNumber: text("lot_number"),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    index("coa_batches_product_slug_idx").on(table.productSlug),
    index("coa_batches_lot_number_idx").on(table.lotNumber),
  ],
);

export type CoaBatch = typeof coaBatchesTable.$inferSelect;
