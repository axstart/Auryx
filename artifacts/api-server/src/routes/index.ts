import { Router, type IRouter } from "express";
import healthRouter from "./health";
import consultationsRouter from "./consultations";
import inventoryRouter from "./inventory";
import chatRouter from "./chat/index.js";
import ariaSettingsRouter from "./ariaSettings.js";
import protocolContinuationsRouter from "./protocolContinuations.js";
import productsRouter from "./shop/productsRoute.js";
import checkoutRouter from "./shop/checkoutRoute.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(consultationsRouter);
router.use(inventoryRouter);
router.use(chatRouter);
router.use(ariaSettingsRouter);
router.use(protocolContinuationsRouter);
router.use(productsRouter);
router.use(checkoutRouter);

export default router;
