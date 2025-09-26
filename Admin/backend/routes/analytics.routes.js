import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller.js";

const router = Router();

// Get overall dashboard analytics
router.get("/dashboard", AnalyticsController.getDashboardAnalytics);

// Get thana-specific analytics
router.get("/thana/:thanaId", AnalyticsController.getThanaAnalytics);

// Get crime analytics
router.get("/crime", AnalyticsController.getCrimeAnalytics);

// Get officer performance analytics
router.get("/officers", AnalyticsController.getOfficerAnalytics);

export default router;
