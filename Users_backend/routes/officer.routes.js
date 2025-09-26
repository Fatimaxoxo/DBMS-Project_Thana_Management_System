import { Router } from "express";
import {
  getOfficers,
  getOfficer,
  createOfficer,
  updateOfficer,
  deleteOfficer,
  getWarrantOfficers,
  getWarrantOfficerDashboard,
  getAvailableWarrantOfficers,
} from "../controllers/officer.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getOfficers);
router.get("/:id", getOfficer);
router.post("/", createOfficer);
router.put("/:id", updateOfficer);
router.delete("/:id", deleteOfficer);

// Warrant officer specific routes
router.get("/warrant/all", getWarrantOfficers);
router.get("/warrant/available", getAvailableWarrantOfficers);
router.get("/warrant/dashboard", authenticateToken, getWarrantOfficerDashboard);

export default router;
