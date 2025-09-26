import { Router } from "express";
import {
  getCrimes,
  getCrime,
  createCrime,
  updateCrime,
  deleteCrime,
} from "../controllers/crime.controller.js";
const router = Router();
router.get("/", getCrimes);
router.get("/:id", getCrime);
router.post("/", createCrime);
router.put("/:id", updateCrime);
router.delete("/:id", deleteCrime);
export default router;
