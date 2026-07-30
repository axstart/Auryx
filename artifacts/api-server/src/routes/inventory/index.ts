import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, inventoryItemsTable } from "@workspace/db";
import { sessionAuth } from "../../middlewares/sessionAuth.js";
import {
  CreateInventoryItemBody,
  UpdateInventoryItemResponse,
  ListInventoryResponse,
  UpdateInventoryItemBody,
  UpdateInventoryItemParams,
  DeleteInventoryItemParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/inventory", sessionAuth, async (req, res): Promise<void> => {
  const records = await db
    .select()
    .from(inventoryItemsTable)
    .orderBy(inventoryItemsTable.name, inventoryItemsTable.variantLabel);
  res.json(ListInventoryResponse.parse(records));
});

router.post("/inventory", sessionAuth, async (req, res): Promise<void> => {
  const parsed = CreateInventoryItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [record] = await db
    .insert(inventoryItemsTable)
    .values(parsed.data)
    .returning();
  req.log.info({ id: record.id }, "Inventory item created");
  res.status(201).json(UpdateInventoryItemResponse.parse(record));
});

router.patch("/inventory/:id", sessionAuth, async (req, res): Promise<void> => {
  const params = UpdateInventoryItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateInventoryItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const update = {
    ...(parsed.data.name !== undefined ? { name: parsed.data.name } : {}),
    ...(parsed.data.category !== undefined ? { category: parsed.data.category } : {}),
    ...(parsed.data.stock !== undefined ? { stock: Number(parsed.data.stock) } : {}),
    ...(parsed.data.unit !== undefined ? { unit: parsed.data.unit } : {}),
    ...(parsed.data.lowStockThreshold !== undefined
      ? { lowStockThreshold: Number(parsed.data.lowStockThreshold) }
      : {}),
    ...(parsed.data.costPerUnit !== undefined
      ? { costPerUnit: Number(parsed.data.costPerUnit) }
      : {}),
    ...(parsed.data.sellPriceCents !== undefined
      ? { sellPriceCents: Number(parsed.data.sellPriceCents) }
      : {}),
    ...(parsed.data.notes !== undefined ? { notes: parsed.data.notes } : {}),
    ...(parsed.data.variantLabel !== undefined ? { variantLabel: parsed.data.variantLabel } : {}),
  };
  const [record] = await db
    .update(inventoryItemsTable)
    .set(update)
    .where(eq(inventoryItemsTable.id, params.data.id))
    .returning();
  if (!record) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(UpdateInventoryItemResponse.parse(record));
});

router.delete("/inventory/:id", sessionAuth, async (req, res): Promise<void> => {
  const params = DeleteInventoryItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [record] = await db
    .delete(inventoryItemsTable)
    .where(eq(inventoryItemsTable.id, params.data.id))
    .returning();
  if (!record) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
