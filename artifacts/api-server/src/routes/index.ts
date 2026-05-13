import { Router, type IRouter } from "express";
import healthRouter from "./health";
import consultationsRouter from "./consultations";
import inventoryRouter from "./inventory";

const router: IRouter = Router();

router.use(healthRouter);
router.use(consultationsRouter);
router.use(inventoryRouter);

export default router;
