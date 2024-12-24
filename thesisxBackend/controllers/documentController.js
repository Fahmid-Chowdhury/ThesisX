import DB from "../DB/db.js";
import fs from "fs";
import path from 'path';
import pdfParse from "pdf-parse"; // Import the library


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

        res.status(200).json({ data: metadata });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const saveDocument = async (req, res) => {
    try {
        const { title, abstract, authors, url, type } = req.body;
        const userId = req.user.id;

        const document = await DB.document.create({
            data: {
                title,
                abstract,
                authors: authors.split(","),
                url,
                type,
                uploadedById: userId,
            },
        });

        res.status(201).json({ message: "Document saved successfully", document });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const cancelDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const userId = req.user.id; 

        const document = await DB.contribution.findUnique({
            where: { id: Number(documentId) },
        });

        if (!document) {
            return res.status(404).json({ message: 'Document not found.' });
        }

        if (document.uploadedById !== userId) {
            return res.status(403).json({ message: 'You do not have permission to delete this document.' });
        }

        const filePath = path.join(__dirname, '../public/documents', document.url);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            }
        });

        await DB.contribution.delete({
            where: { id: Number(documentId) },
        });

        return res.status(200).json({ message: 'Document cancelled and removed successfully.' });
    } catch (error) {
        console.error('Error cancelling document:', error);
        return res.status(500).json({ message: 'An error occurred while cancelling the document.' });
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
    cancelDocument, 
    getAllDocuments, 
    getDocumentById 
};