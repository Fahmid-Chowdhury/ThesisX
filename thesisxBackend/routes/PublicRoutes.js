//============= imports =================
import express from 'express';
import { getPublicImage } from '../controllers/PublicController.js';
//=======================================

const router = express.Router();

router.get('/image/:filename', getPublicImage);

export default router;
