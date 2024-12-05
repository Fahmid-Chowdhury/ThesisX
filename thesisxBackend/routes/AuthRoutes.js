//============= imports =================
import express from 'express';
import {signup, login, verifyEmail} from '../controllers/AuthController.js'

//=======================================
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verifyEmail', verifyEmail);


export default router;