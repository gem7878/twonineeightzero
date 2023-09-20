import { Router } from "express";
const router = Router();
import {getCongestions} from "../controllers/congestion.controller.js";

router.get("/congestion/:name", getCongestions);

export default router;
