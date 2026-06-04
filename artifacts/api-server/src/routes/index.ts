import { Router, type IRouter } from "express";
import healthRouter from "./health";
import consultationsRouter from "./consultations";
import inventoryRouter from "./inventory";
import chatRouter from "./chat/index.js";
import ariaSettingsRouter from "./ariaSettings.js";
import protocolContinuationsRouter from "./protocolContinuations.js";
import productsRouter from "./shop/productsRoute.js";
import checkoutRouter from "./shop/checkoutRoute.js";
import webhookRouter from "./shop/webhookRoute.js";
import protocolRecommendationRouter from "./protocolRecommendation.js";
import analyticsRouter from "./analytics/index.js";
import adminAuthRouter from "./adminAuth/index.js";
import adminDashboardRouter from "./adminDashboard/index.js";
import adminPatientsRouter from "./adminPatients/index.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(consultationsRouter);
router.use(inventoryRouter);
router.use(chatRouter);
router.use(ariaSettingsRouter);
router.use(protocolContinuationsRouter);
router.use(productsRouter);
router.use(checkoutRouter);
router.use(webhookRouter);
router.use(protocolRecommendationRouter);
router.use(analyticsRouter);
router.use(adminAuthRouter);
router.use(adminDashboardRouter);
router.use(adminPatientsRouter);

export default router;
