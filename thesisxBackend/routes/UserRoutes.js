//============= imports =================
import express from 'express';
import { checkAuth } from '../middleware/checkAuth.js';
import { getUser, getProfile } from '../controllers/UserController.js';
import { uploadUserImage, getUserImage } from "../controllers/UserController.js";
import { imageUpload } from "../middleware/imageUpload.js";
//=======================================
const router = express.Router();

router.get('/getuser', checkAuth, getUser);
router.get('/getprofile', checkAuth, getProfile);
router.post("/uploadimage/:userId", checkAuth, imageUpload.single("image"), uploadUserImage);
router.get("/getimage/:userId", checkAuth, getUserImage);


export default router;
