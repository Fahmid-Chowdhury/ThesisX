//============= imports =================
import express from 'express';
import { CreateThesis, GetThesis } from '../controllers/ThesisController.js';
import { checkAuth } from '../middleware/checkAuth.js';

//=======================================

const router = express.Router();

router.get("/get-thesis", checkAuth, GetThesis);
router.post("/create-thesis", checkAuth, CreateThesis);

export default router;
