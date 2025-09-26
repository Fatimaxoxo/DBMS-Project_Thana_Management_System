import { Router } from "express";
import {
  getOfficers,
  getOfficer,
  createOfficer,
  updateOfficer,
  deleteOfficer,
} from "../controllers/officer.controller.js";
const router = Router();
router.get("/", getOfficers);
router.get("/:id", getOfficer);
router.post("/", createOfficer);
router.put("/:id", updateOfficer);
router.delete("/:id", deleteOfficer);
export default router;
