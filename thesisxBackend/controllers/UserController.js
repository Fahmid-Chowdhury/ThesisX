//============= imports =================
import DB from "../DB/db.js";
import sharp from "sharp";
import path from "path";
import fs from "fs";
//=======================================

async function getUser(req, res) {
    try{
        const email = req.userData.email;
    
        if (!email) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await DB.User.findUnique({
            where:{
                email: email
            },
            select:{
                id:true,
                email: true,
                name: true,
                department: true,
                role: true,
                bio: true,
                verified: true,
                createdAt: true,
                updatedAt: true
            }
        })

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getProfile(req, res) {
    try {
        const email = req.userData.email;

        if (!email) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await DB.User.findUnique({
            where: {
                email: email
            },
            select: {
                id: true,
                email: true,
                name: true,
                department: true,
                role: true,
                bio: true,
                verified: true,
                createdAt: true,
                updatedAt: true,
                faculty: {
                    select: {
                        department: true,
                        researchInterests: true,
                        availability: true,
                        publications: {
                            select: {
                                id: true,
                                title: true,
                                abstract: true,
                                authors: true,
                                publicationDate: true,
                                url: true,
                                createdAt: true
                            }
                        }
                    }
                },
                student: {
                    select: {
                        department: true,
                        researchInterests: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let profile = { ...user };
        if (user.role === 'FACULTY' && user.faculty) {
            profile.facultyDetails = user.faculty;
        } else if (user.role === 'STUDENT' && user.student) {
            profile.studentDetails = user.student;
        }

        // Remove faculty and student raw data if role does not match
        delete profile.faculty;
        delete profile.student;

        return res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const uploadUserImage = async (req, res) => {
    const { userId } = req.params;
    const imagePath = req.file?.path;

    if (!imagePath) {
        return res.status(400).json({ success: false, message: "Image file is required" });
    }

    try {
        // Extract the relative path of the uploaded image
        const absolutePath = req.file.path; // Absolute path from multer
        const relativePath = path.relative(path.resolve("."), absolutePath); // Convert to relative path

        // Update the user's image path in the database
        await DB.user.update({
            where: { id: parseInt(userId) },
            data: { image: relativePath },
        });

        res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            relativePath,
        });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getUserImage = async (req, res) => {
    const { userId } = req.params;
    const { width, height, quality } = req.query;

    try {
        // Fetch the user's image path from the database
        const user = await DB.user.findUnique({
            where: { id: parseInt(userId) },
        });

        if (!user || !user.image || !fs.existsSync(user.image)) {
            return res.status(404).json({ success: false, message: "Image not found" });
        }

        // Resolve the absolute path of the image
        const relativeImagePath = user.image; // Relative path from the database
        const absoluteImagePath = path.resolve(relativeImagePath); // Convert to absolute path

         // Check if the file exists
         if (!fs.existsSync(absoluteImagePath)) {
            return res.status(404).json({ success: false, message: "Image file not found" });
        }

        // Set default values for resizing
        const resizeWidth = width ? parseInt(width) : 300; // Default width
        const resizeHeight = height ? parseInt(height) : 300; // Default height
        const resizeQuality = quality ? parseInt(quality) : 80; // Default quality

        // Process the image with Sharp
        const outputBuffer = await sharp(absoluteImagePath)
            .resize(resizeWidth, resizeHeight, { fit: "cover" }) // Resize image
            .jpeg({ quality: resizeQuality }) // Compress image
            .toBuffer();

        // Return the processed image
        res.set("Content-Type", "image/jpeg");
        res.send(outputBuffer);
    } catch (error) {
        console.error("Error retrieving user image:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export { 
    getUser, 
    getProfile,
    uploadUserImage,
    getUserImage
};
