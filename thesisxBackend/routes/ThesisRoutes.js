//============= imports =================
import express from 'express';
import { CreateSubmissions, submitSubmissions, CreateThesis, GetFacultyThesis, GetSubmissions, GetThesis, GetThesisbyID, getThesisPosts, UpdateSubmissions, EditThesis, AddFeedback, UpdateFeedback, InviteStudent, JoinThesis  } from '../controllers/ThesisController.js';
import { checkAuth } from '../middleware/checkAuth.js';
import  submissionUpload  from '../middleware/submissionUpload.js';

//=======================================

const router = express.Router();

router.get("/get-thesis", checkAuth, GetThesis);
router.get("/get-faculty-thesis", checkAuth, GetFacultyThesis);
router.get("/get-thesis-by-id/:id", checkAuth, GetThesisbyID);
router.post("/create-thesis", checkAuth, CreateThesis);
router.get("/posts/:id", checkAuth, getThesisPosts);
router.post("/create-submissions", checkAuth, CreateSubmissions);
router.post("/update-submissions", checkAuth, UpdateSubmissions);
router.get("/get-submissions/:id", checkAuth, GetSubmissions);
router.post("/submit-submissions", checkAuth,submissionUpload.single('submission'), submitSubmissions);
router.post("/edit-thesis", checkAuth, EditThesis);
router.post("/add-feedback", checkAuth, AddFeedback);
router.post("/update-feedback", checkAuth, UpdateFeedback);
router.post("/invite-student", checkAuth, InviteStudent);
router.post("/join", checkAuth,JoinThesis);


export default router;
