//============= imports =================
import express from 'express';
import { checkAuth } from '../middleware/checkAuth.js';
import { getUser, getProfile } from '../controllers/UserController.js';
//=======================================
const router = express.Router();

router.get('/getuser', checkAuth, getUser);
router.get('/getprofile', checkAuth, getProfile);

export default router;