import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const getPublicImage = async (req, res) => {
    const { filename } = req.params;
    const { width, height, quality, format } = req.query;
    const convertToWebp = format === "true";
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    try {
        // Define the public directory where images are stored
        const publicDirectory = path.resolve(__dirname, "../public/images");
        const absoluteImagePath = path.join(publicDirectory, filename);

        // Check if the file exists
        if (!fs.existsSync(absoluteImagePath)) {
            return res.status(404).json({ success: false, message: "Image not found" });
        }

        // Set default values for resizing
        const resizeWidth = width ? parseInt(width) : undefined; // Undefined keeps the original width
        const resizeHeight = height ? parseInt(height) : undefined; // Undefined keeps the original height
        const resizeQuality = quality ? parseInt(quality) : 80; // Default quality

        // Process the image with Sharp
        let imageProcessor = sharp(absoluteImagePath);

        if (resizeWidth || resizeHeight) {
            imageProcessor = imageProcessor.resize(resizeWidth, resizeHeight, { fit: "cover" });
        }

        if (convertToWebp) {
            imageProcessor = imageProcessor.webp({ quality: resizeQuality });
            res.set("Content-Type", "image/webp");
        } else {
            imageProcessor = imageProcessor.jpeg({ quality: resizeQuality });
            res.set("Content-Type", "image/jpeg");
        }

        const outputBuffer = await imageProcessor.toBuffer();

        // Return the processed image
        res.send(outputBuffer);
    } catch (error) {
        console.error("Error retrieving public image:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { getPublicImage }