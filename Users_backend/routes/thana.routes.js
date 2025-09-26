import { Router } from "express";
import {
  getThanas,
  getThana,
  createThana,
  updateThana,
  deleteThana,
  getThanaOfficerDashboard,
  assignCaseToWarrantOfficer,
} from "../controllers/thana.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getThanas);
router.get("/:id", getThana);
router.post("/", createThana);
router.put("/:id", updateThana);
router.delete("/:id", deleteThana);

// Thana Officer Dashboard routes
router.get("/officer/dashboard", authenticateToken, getThanaOfficerDashboard);
router.post(
  "/cases/:caseId/assign",
  authenticateToken,
  assignCaseToWarrantOfficer
);

export default router;
