//============= imports =================
import express from 'express';
import { checkAuth } from '../middleware/checkAuth.js';
import { getUser, getProfile, uploadUserImage } from '../controllers/UserController.js';
import { imageUpload } from '../middleware/imageUpload.js';
//=======================================
const router = express.Router();

router.get('/getuser', checkAuth, getUser);
router.get('/getprofile', checkAuth, getProfile);
router.post('/upload-image',checkAuth, imageUpload.single('image'), uploadUserImage);


export default router;
