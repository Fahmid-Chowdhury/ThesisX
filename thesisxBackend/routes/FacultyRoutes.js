//============= imports =================
import express from 'express';
import { GetFacultyInfo, SetSupervisorRequest } from "../controllers/FacultyController.js"
import { checkAuth } from '../middleware/checkAuth.js';
//=======================================

const router = express.Router();

router.get("/facultyinfo", checkAuth, GetFacultyInfo)
router.post("/request-supervision", checkAuth, SetSupervisorRequest)

export default router;