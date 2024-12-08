//============= imports =================
import DB from "../DB/db.js";
import bcrypt from "bcryptjs";
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


export { getUser, getProfile };
