//============= imports =================
import express from 'express';
import { GetFacultyInfo } from "../controllers/FacultyController.js"
import { checkAuth } from '../middleware/checkAuth.js';
//=======================================

const router = express.Router();

router.get("/facultyinfo", checkAuth, GetFacultyInfo)

export default router;