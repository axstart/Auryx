import { Router, type IRouter } from "express";
import healthRouter from "./health";
import consultationsRouter from "./consultations";
import inventoryRouter from "./inventory";
import chatRouter from "./chat/index.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(consultationsRouter);
router.use(inventoryRouter);
router.use(chatRouter);

export default router;
