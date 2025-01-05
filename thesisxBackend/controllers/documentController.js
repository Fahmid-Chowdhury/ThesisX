import DB from "../DB/db.js";
import fs from "fs";
import path from 'path';
import pdfParse from "pdf-parse"; // Import the library
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const documentPreviewDirectory = path.resolve(__dirname, "../public/documentPreview");

const extractMetadata = async (req, res) => {
    try {
        let metadata = {};
        if (req.file.mimetype === "application/pdf") {
            const pdfBuffer = fs.readFileSync(req.file.path);
            const pdfData = await pdfParse(pdfBuffer);

            metadata.title = pdfData.info.Title || req.file.originalname;
            metadata.authors = pdfData.info.Author
                ? pdfData.info.Author.split(",")
                : [];
        } else {
            metadata.title = req.file.originalname;
            metadata.authors = [];
        }

        metadata.url = `/documents/${req.file.filename}`;
        metadata.type = req.file.mimetype;

        // dlete the file after extracting metadata
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
            }
        });

        return res.status(200).json({ success: true, data: metadata });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

const saveDocument = async (req, res) => {
    try {
        const { title, abstract, authors, url } = req.body;
        const userId = req.userData.id;
        const role = req.userData.role;

        if (role === "STUDENT") {
            return res.status(403).json({ success: false, message: 'Only faculties and admins can upload papers.' });
        }

        const filename = req.file?.filename || null; // Safely access filename
        if (!filename) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        // Parse authors if it is a string
        let parsedAuthors;
        try {
            parsedAuthors = typeof authors === 'string' ? JSON.parse(authors) : authors;
            if (!Array.isArray(parsedAuthors)) {
                throw new Error('Authors must be an array.');
            }
        } catch (error) {
            return res.status(400).json({ success: false, message: 'Invalid authors format. Expected an array.' });
        }
        const previewImage = req.body.previewImage
        const name = filename.split('.')[0];
        if (previewImage) {
            const base64Data = previewImage.replace('data:image/png;base64', ""); // Strip the base64 prefix
            const filename = `${name}.jpeg`;
            const previewImagePath = path.join(documentPreviewDirectory, filename);
            // Write the file
            fs.writeFileSync(previewImagePath, base64Data, "base64");
        }

        // Create the document record in the database
        const document = await DB.document.create({
            data: {
                title,
                abstract,
                authors: parsedAuthors, // Use the parsed array
                url,
                fileName: filename,
                uploadedById: userId,
            },
        });


        return res.status(201).json({ success: true, message: 'Document saved successfully.', document });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to save document.' });
    }
};



// const uploadDocument = async (req, res) => {
//     try {
//         const { authors } = req.body;
//         const userId = req.user.id;

//         let metadata = {};
//         if (req.file.mimetype === "application/pdf") {
//             const pdfBuffer = fs.readFileSync(req.file.path);
//             const pdfData = await pdfParse(pdfBuffer);

//             metadata.title = pdfData.info.Title || req.file.originalname;
//             metadata.authors = pdfData.info.Author
//                 ? pdfData.info.Author.split(",")
//                 : authors ? authors.split(",") : [];
//         } else {
//             metadata.title = req.file.originalname;
//             metadata.authors = authors ? authors.split(",") : [];
//         }

//         const document = await prisma.document.create({
//             data: {
//                 title: metadata.title,
//                 authors: metadata.authors,
//                 url: `/documents/${req.file.filename}`,
//                 type: req.file.mimetype,
//                 uploadedById: userId,
//             },
//         });

//         res.status(201).json({ message: "Document uploaded successfully", document });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

const getAllDocuments = async (req, res) => {
    try {
        const documents = await DB.document.findMany({
            include: { uploadedBy: true },
        });
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDocumentById = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await DB.document.findUnique({
            where: { id: parseInt(id, 10) },
        });

        if (!document) return res.status(404).json({ message: "Document not found" });

        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export {
    extractMetadata,
    saveDocument,
    getAllDocuments,
    getDocumentById
};