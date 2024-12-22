import express from "express";
import documentUpload from "../middleware/documentUpload.js";
import {
    uploadDocument,
    getAllDocuments,
    getDocumentById,
} from "../controllers/documentController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.post("/upload", checkAuth, documentUpload.single("document"), uploadDocument);
router.get("/", checkAuth, getAllDocuments);
router.get("/:id", checkAuth, getDocumentById);

export default router;
