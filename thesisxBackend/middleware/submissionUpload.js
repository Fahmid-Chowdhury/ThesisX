import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const submissionDirectory = path.resolve(__dirname, "../public/submission");

const submissionStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, submissionDirectory);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

// Allow all file types (no filtering)
const submissionFileFilter = (req, file, cb) => {
    // Allow any file type, just pass true
    cb(null, true);
};

const submissionUpload = multer({
    storage: submissionStorage,
    fileFilter: submissionFileFilter,
});

export default submissionUpload;
