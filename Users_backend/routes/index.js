import { Router } from "express";
import thanaRoutes from "./thana.routes.js";
import victimRoutes from "./victim.routes.js";
import crimeRoutes from "./crime.routes.js";
import officerRoutes from "./officer.routes.js";
import complaintRoutes from "./complaint.routes.js";
import caseRoutes from "./case.routes.js";
import handoverRoutes from "./handover.routes.js";
import authRoutes from "./auth.routes.js";
import notificationRoutes from "./notification.routes.js";

const router = Router();
router.use("/thanas", thanaRoutes);
router.use("/victims", victimRoutes);
router.use("/crimes", crimeRoutes);
router.use("/officers", officerRoutes);
router.use("/complaints", complaintRoutes);
router.use("/cases", caseRoutes);
router.use("/handovers", handoverRoutes);
router.use("/auth", authRoutes);
router.use("/notifications", notificationRoutes);

export default router;
