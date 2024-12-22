import DB from "../DB/db.js";
import fs from "fs";
import pdfParse from "pdf-parse"; // Import the library


export const uploadDocument = async (req, res) => {
    try {
        const { authors } = req.body;
        const userId = req.user.id;

        let metadata = {};
        if (req.file.mimetype === "application/pdf") {
            const pdfBuffer = fs.readFileSync(req.file.path);
            const pdfData = await pdfParse(pdfBuffer);

            metadata.title = pdfData.info.Title || req.file.originalname;
            metadata.authors = pdfData.info.Author
                ? pdfData.info.Author.split(",")
                : authors ? authors.split(",") : [];
        } else {
            metadata.title = req.file.originalname;
            metadata.authors = authors ? authors.split(",") : [];
        }

        const document = await prisma.document.create({
            data: {
                title: metadata.title,
                authors: metadata.authors,
                url: `/documents/${req.file.filename}`,
                type: req.file.mimetype,
                uploadedById: userId,
            },
        });

        res.status(201).json({ message: "Document uploaded successfully", document });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getAllDocuments = async (req, res) => {
    try {
        const documents = await DB.document.findMany({
            include: { uploadedBy: true },
        });
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getDocumentById = async (req, res) => {
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
