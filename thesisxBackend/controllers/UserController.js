//============= imports =================
import DB from "../DB/db.js";
import sharp from "sharp";
import path from "path";
import fs from "fs";
//=======================================

async function getUser(req, res) {
    try{
        const userId = req.userData.id;
    
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await DB.User.findUnique({
            where:{
                id:userId
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
        const userId = req.userData?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await DB.User.findUnique({
            where: { id:userId },
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
                        available_slot: true,
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
    try {
        const userId = req.userData?.id;
        const imagePath = req.file?.path;

        if (!imagePath) {
            return res.status(400).json({ success: false, message: "Image file is required" });
        }

        const absolutePath = req.file.path; // Absolute path from multer
        
        const relativePath = path.relative(path.resolve("./public/images"), absolutePath); // Convert to relative path

        // Update the user's image path in the database
        await DB.user.update({
            where: { id:userId },
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


const updateBasicInfo = async (req, res) => {
    const userId= req.userData?.id; // Assumes user ID is extracted from the authenticated token
    const { name, email, bio } = req.body;

    // Input validation (basic example; can be expanded as needed)
    if (!name || !email) {
        return res.status(400).json({
            success: false,
            message: "Name and email are required.",
        });
    }

    try {
        // Update user information in the database
        const updatedUser = await DB.user.update({
            where: { id: userId },
            data: {
                name,
                email,
                bio: bio || null, // Optional bio field
            },
        });

        // Respond with the updated data
        res.status(200).json({
            success: true,
            message: "User information updated successfully.",
            data: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                bio: updatedUser.bio,
            },
        });
    } catch (error) {
        console.error("Error updating user information:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating user information.",
        });
    }
};

const updateResearchInterest = async (req, res) => {
    const { interests } = req.body;
    
    try {
        const userId = req.userData?.id; // Assuming user ID is available in the token payload
        const role = req.userData?.role; // Role should be part of the token payload as well
        
        if (!userId || !role ) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!interests || !Array.isArray(interests)) {
            return res.status(400).json({ success: false, message: "Invalid research interests format." });
        }
        let updatedUser;

        if (role === "FACULTY") {
            // Check if faculty exists
            const faculty = await DB.Faculty.findUnique({ where: { userId } });

            if (faculty) {
                // Update the faculty's research interests
                updatedUser = await DB.Faculty.update({
                    where: { userId },
                    data: { researchInterests: interests },
                });
            } else {
                // Create a new faculty entry if not exists
                updatedUser = await DB.Faculty.create({
                    data: {
                        userId, // Assuming the user ID is passed to create a faculty record
                        available_slot:0,
                        researchInterests: interests,
                    },
                });
            }
        } else if (role === "STUDENT") {
            // Check if student exists
            const student = await DB.Student.findUnique({ where: { userId } });

            if (student) {
                // Update the student's research interests
                updatedUser = await DB.Student.update({
                    where: { userId },
                    data: { researchInterests: interests },
                });
            } else {
                // Create a new student entry if not exists
                updatedUser = await DB.Student.create({
                    data: {
                        userId, // Assuming the user ID is passed to create a student record
                        researchInterests: interests,
                    },
                });
            }
        } else {
            return res.status(400).json({ success: false, message: "Invalid user role." });
        }

        return res.status(200).json({ success: true, message: "Research interests updated successfully.", data: updatedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "An error occurred while updating research interests." });
    }

}


const getFaculties = async (req, res) => {
    const { searchTerm, department, tags } = req.query;

    try {
        // Build filters dynamically based on the provided query parameters
        const filters = {
            // Default filter for Faculty's related User fields (searchTerm and department)
        };

        // Filter by searchTerm (faculty name) in the User table
        
        if (searchTerm) {
            filters.user = {
                name: { contains: searchTerm, mode: 'insensitive' }, // Case-insensitive search by faculty name
            };
        }

        // Filter by department in the User table
        if (department) {
            filters.user = {
                ...filters.user,
                department: department,
            };
        }
        if (tags) {
            const tagsArray = tags.split(',');
            filters.researchInterests = { hasSome: tagsArray }; // Search if any of the tags match the faculty's research interests
        }

        console.log(filters)
        // Fetch faculties using Prisma with dynamic filters and selected fields
        const faculties = await DB.Faculty.findMany({
            where: filters,
            select: {
                id: true,
                user: {
                    select: {
                        id:true,
                        name: true,
                        department: true,
                        image: true, // Only selecting the image field from the user
                    },
                },
                available_slot:true, // Select availability directly from faculty
            },
        });

        // Return the filtered faculties with selected fields
        return res.status(200).json({ success: true, data: faculties });
    } catch (error) {
        console.error('Error fetching faculties:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch faculties.' });
    }
};


export { 
    getUser, 
    getProfile,
    uploadUserImage,
    updateBasicInfo,
    updateResearchInterest,
    getFaculties
};
