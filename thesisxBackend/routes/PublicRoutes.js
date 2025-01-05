//============= imports =================
import express from 'express';
import { getPublicImage, getPreviewImage } from '../controllers/PublicController.js';
//=======================================

const router = express.Router();

router.get('/image/:filename', getPublicImage);
router.get('/preview/:filename', getPreviewImage);

export default router;
