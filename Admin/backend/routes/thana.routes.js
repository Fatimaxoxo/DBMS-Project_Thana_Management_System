import { Router } from "express";
import {
  getThanas,
  getThana,
  createThana,
  updateThana,
  deleteThana,
} from "../controllers/thana.controller.js";
const router = Router();
router.get("/", getThanas);
router.get("/:id", getThana);
router.post("/", createThana);
router.put("/:id", updateThana);
router.delete("/:id", deleteThana);
export default router;
