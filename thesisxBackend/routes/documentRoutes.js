import express from "express";
import documentUpload from "../middleware/documentUpload.js";
import {
    extractMetadata,
    saveDocument,
    getAllDocuments,
    getDocumentById,
} from "../controllers/DocumentController.js";
import { checkAuth } from '../middleware/checkAuth.js';

const router = express.Router();

router.post("/extract-metadata", checkAuth, documentUpload.single("document"), extractMetadata);
router.post("/save", checkAuth,documentUpload.single("document"), saveDocument);
router.get("/get-papers", checkAuth, getAllDocuments);
router.get("/:id", checkAuth, getDocumentById);

export default router;