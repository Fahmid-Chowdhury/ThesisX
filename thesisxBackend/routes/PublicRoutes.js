//============= imports =================
import express from 'express';
import { getPublicImage, getPreviewImage, getDocument } from '../controllers/PublicController.js';
//=======================================

const router = express.Router();

router.get('/image/:filename', getPublicImage);
router.get('/preview/:filename', getPreviewImage);
router.get('/document/:filename', getDocument);

export default router;
