import express from "express";
import { listPrograms } from "../controllers/programController.js";

const router = express.Router();

router.get("/", listPrograms);

export default router;