import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";  
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory to save uploaded files
const uploadDirectory = path.resolve(__dirname, "../public/images");

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory); // Save in the "images" directory
    },
    filename: (req, file, cb) => {
        // Generate a unique filename using UUID
        const uniqueFilename = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueFilename); // Use UUID as the filename
    },
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed."), false);
    }
};

const imageUpload = multer({ 
    storage, 
    fileFilter 
});

export { imageUpload };
