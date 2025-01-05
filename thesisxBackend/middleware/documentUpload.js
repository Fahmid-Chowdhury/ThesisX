import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const documentDirectory = path.resolve(__dirname, "../public/documents");
const documentPreviewDirectory = path.resolve(__dirname, "../public/documentPreview");

const documentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, documentDirectory);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});


const documentFileFilter = (req, file, cb) => {
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only PDF and Word documents are allowed."));
    }
};

const documentUpload = multer({
    storage: documentStorage,
    fileFilter: documentFileFilter,
});

export default documentUpload;
