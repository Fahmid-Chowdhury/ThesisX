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
        const email = req.userData?.email;

        if (!email) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await DB.User.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
                bio: true,
                verified: true,
                createdAt: true,
                updatedAt: true,
                image: true,
                faculty: {
                    select: {
                        researchInterests: true,
                        availability: true,
                        publications: {
                            select: {
                                id: true,
                                title: true,
                                authors: true,
                                url: true,
                                publicationDate: true,
                            },
                        },
                    },
                },
                student: {
                    select: {
                        researchInterests: true,
                        contributions: {
                            select: {
                                id: true,
                                title: true,
                                authors: true,
                                url: true,
                                publicationDate: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let profile = {
            ...user,
            facultyDetails: user.role === 'FACULTY' ? user.faculty : undefined,
            studentDetails: user.role === 'STUDENT' ? user.student : undefined,
        };

        delete profile.faculty;
        delete profile.student;

        return res.status(200).json({
            success: true,
            data: profile,
        });
    } catch (error) {
        console.error('Error in getProfile:', error);
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



export { 
    getUser, 
    getProfile,
    uploadUserImage,
};
