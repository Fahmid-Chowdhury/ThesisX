//============= imports =================
import express from 'express';
import { checkAuth } from '../middleware/checkAuth.js';
import { getUser } from '../controllers/UserController.js';
//=======================================
const router = express.Router();

router.get('/getuser', checkAuth, getUser);

export default router;