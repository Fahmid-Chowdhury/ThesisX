import express from "express";
import documentUpload from "../middleware/documentUpload.js";
import {
    extractMetadata,
    saveDocument,
    // uploadDocument,
    getAllDocuments,
    getDocumentById,
} from "../controllers/documentController.js";
import { checkAuth } from '../middleware/checkAuth.js';

const router = express.Router();

router.post("/extract-metadata", checkAuth, documentUpload.single("document"), extractMetadata);
router.post("/save", checkAuth, saveDocument);
router.delete("/cancel/:documentId", checkAuth, saveDocument);
// router.post("/upload", checkAuth, documentUpload.single("document"), uploadDocument);
router.get("/", checkAuth, getAllDocuments);
router.get("/:id", checkAuth, getDocumentById);

export default router;