//============= imports =================
import express from 'express';
import { GetFacultyInfo, SetSupervisorRequest, addPublication, editPublication, removePublication } from "../controllers/FacultyController.js"
import { checkAuth } from '../middleware/checkAuth.js';
//=======================================

const router = express.Router();

router.get("/facultyinfo", checkAuth, GetFacultyInfo)
router.post("/request-supervision", checkAuth, SetSupervisorRequest)
router.post("/publications/add", checkAuth, addPublication)
router.put("/publications/edit/:id", checkAuth, editPublication)
router.delete("/publications/remove/:id", checkAuth, removePublication)

export default router;