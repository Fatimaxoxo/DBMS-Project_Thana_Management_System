import { Router } from "express";
import {
  getHandovers,
  getHandover,
  createHandover,
  updateHandover,
  deleteHandover,
} from "../controllers/handover.controller.js";
const router = Router();
router.get("/", getHandovers);
router.get("/:id", getHandover);
router.post("/", createHandover);
router.put("/:id", updateHandover);
router.delete("/:id", deleteHandover);
export default router;
