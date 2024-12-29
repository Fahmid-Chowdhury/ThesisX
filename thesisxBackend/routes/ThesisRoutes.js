//============= imports =================
import express from 'express';
import { CreateThesis, GetFacultyThesis, GetThesis, GetThesisbyID, getThesisPosts } from '../controllers/ThesisController.js';
import { checkAuth } from '../middleware/checkAuth.js';

//=======================================

const router = express.Router();

router.get("/get-thesis", checkAuth, GetThesis);
router.get("/get-faculty-thesis", checkAuth, GetFacultyThesis);
router.get("/get-thesis-by-id/:id", checkAuth, GetThesisbyID);
router.post("/create-thesis", checkAuth, CreateThesis);
router.get("/posts/:id", checkAuth, getThesisPosts);

export default router;
