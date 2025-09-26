import { Router } from "express";
import {
  getVictims,
  getVictim,
  createVictim,
  updateVictim,
  deleteVictim,
} from "../controllers/victim.controller.js";
const router = Router();
router.get("/", getVictims);
router.get("/:id", getVictim);
router.post("/", createVictim);
router.put("/:id", updateVictim);
router.delete("/:id", deleteVictim);
export default router;
