import { Router } from "express";
import {
  getComplaints,
  getComplaint,
  createComplaint,
  updateComplaint,
  deleteComplaint,
} from "../controllers/complaint.controller.js";
const router = Router();
router.get("/", getComplaints);
router.get("/:id", getComplaint);
router.post("/", createComplaint);
router.put("/:id", updateComplaint);
router.delete("/:id", deleteComplaint);
export default router;
