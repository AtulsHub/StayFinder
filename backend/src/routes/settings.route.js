import express from "express";
import {
  getSettings,
  updateSettings,
  resetSettings,
} from "../controllers/settings.controller.js";

const router = express.Router();

// Get settings
router.get("/", getSettings);

// Update settings
router.put("/", updateSettings);

// Reset settings to default
router.post("/reset", resetSettings);

export default router;
