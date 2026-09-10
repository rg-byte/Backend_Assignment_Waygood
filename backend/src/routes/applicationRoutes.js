import express from "express";
import {
  createApplication,
  listApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

const router = express.Router();

router.get("/", listApplications);
router.post("/", createApplication);
router.patch("/:id/status", updateApplicationStatus);

export default router;