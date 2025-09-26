import { Router } from "express";
import {
  getCases,
  getCase,
  createCase,
  updateCase,
  deleteCase,
  assignWarrantOfficer,
  updateProgress,
} from "../controllers/case.controller.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.get("/", getCases);
router.get("/:id", getCase);
router.post("/", authorizeRoles("user"), createCase);
router.put(
  "/:id/assign",
  authorizeRoles("thana-officer"),
  assignWarrantOfficer
);
router.put("/:id/progress", authorizeRoles("warrant-officer"), updateProgress);
router.put("/:id", updateCase);
router.delete("/:id", deleteCase);

export default router;
