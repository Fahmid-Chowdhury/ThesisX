//============= imports =================
import express from 'express';
import { addContribution, editContribution, removeContribution, getContributions } from "../controllers/StudentController.js"
import { checkAuth } from '../middleware/checkAuth.js';
//=======================================

const router = express.Router();

router.get("/contributions", checkAuth, getContributions);
router.post("/contributions/add", checkAuth, addContribution);
router.put("/contributions/edit/:id", checkAuth, editContribution);
router.delete("/contributions/remove/:id", checkAuth, removeContribution);

export default router;