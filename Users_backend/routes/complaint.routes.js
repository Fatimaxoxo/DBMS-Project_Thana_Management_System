import { Router } from "express";
import {
  getComplaints,
  getComplaint,
  createComplaint,
  updateComplaint,
  deleteComplaint,
} from "../controllers/complaint.controller.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get("/", getComplaints);
router.get("/:id", getComplaint);
router.post("/", authorizeRoles("user"), createComplaint);
router.put("/:id", updateComplaint);
router.delete("/:id", deleteComplaint);

export default router;
