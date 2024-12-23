import express from "express";
import { summarizeAbstract, resetConversation, chat } from "../controllers/AIController.js";
import { checkAuth } from '../middleware/checkAuth.js';

const router = express.Router();

router.post("/summarize", checkAuth, summarizeAbstract);
router.post("/reset", checkAuth, resetConversation);
router.post("/chat", checkAuth, chat);

export default router;
