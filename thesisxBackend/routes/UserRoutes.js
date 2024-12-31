//============= imports =================
import express from 'express';
import { checkAuth } from '../middleware/checkAuth.js';
import { getUser, getProfile, uploadUserImage, updateBasicInfo, updateResearchInterest, getFaculties, getStudentProfile } from '../controllers/UserController.js';
import { imageUpload } from '../middleware/imageUpload.js';
import multer from 'multer';
//=======================================

const multerMiddleware = (req, res, next) => {
    imageUpload.single('image')(req, res, (err) => {
        if (err) {
            // Handle Multer errors and send a response
            if (err instanceof multer.MulterError) {
                // Multer-specific error
                return res.status(400).json({ 
                    success: false, 
                    message: `Multer error: ${err.message}` 
                });
            } else if (err.message === "Invalid file type. Only JPEG, PNG, and JPG are allowed.") {
                // Custom file type validation error
                return res.status(400).json({ 
                    success: false, 
                    message: err.message 
                });
            } else {
                // General error
                return res.status(500).json({ 
                    success: false, 
                    message: "An unexpected error occurred during file upload." 
                });
            }
        }
        next()
    });
};

const router = express.Router();

router.get('/getuser', checkAuth, getUser);
router.get('/getprofile', checkAuth, getProfile);
router.get('/getstudentbyid/:id', checkAuth, getStudentProfile);
router.post('/upload-image',checkAuth, multerMiddleware, uploadUserImage);
router.put("/update-basic-info", checkAuth, updateBasicInfo);
router.put("/update-research-interests", checkAuth, updateResearchInterest );
router.get("/get-faculties", checkAuth, getFaculties)
export default router;
