//============= imports =================
import DB from "../DB/db.js";
//=======================================

async function GetThesisByID(thesisID) {
    
    try {
        const thesis = await DB.thesis.findUnique({
            where: {
                id: parseInt(thesisID), // Find thesis by the ID provided in the params
            },
            include: {
                faculty: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                image: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                student: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                                image:true
                            },
                        },
                    },
                },
            },
        });
    return thesis;

    } catch (err) {
        throw err;
    }
}

async function GetFacultyThesis(req, res) {
    const userData = req.userData;

    if (!userData) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    try {
        const { id, role } = userData;

        // Ensure only students can access this endpoint
        if (role !== "FACULTY") {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Access is restricted to Faculties",
            });
        }

        // Find the student's profile
        const faculty = await DB.faculty.findUnique({
            where: { userId: id } // Correct object syntax
        });


        // Check if the student profile exists
        if (!faculty) {
            return res.status(404).json({
                success: false,
                profileIncomplete: true,
                message: "Faculty profile is incomplete. Please complete your profile.",
            });
        }

        // Check if the student is enrolled in a thesis
        const thesis = await DB.thesis.findMany({
            where: {
                supervisorId: faculty.id
            }
        })

        return res.status(200).json({
            success: true,
            data: thesis,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
async function GetThesis(req, res) {
    const userData = req.userData;

    if (!userData) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    try {
        const { id, role } = userData;

        // Ensure only students can access this endpoint
        if (role !== "STUDENT") {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Access is restricted to students",
            });
        }

        // Find the student's profile
        const student = await DB.student.findUnique({
            where: {
                userId: id,
            },
            select: {
                thesisID: true,
            },
        });

        // Check if the student profile exists
        if (!student) {
            return res.status(404).json({
                success: false,
                profileIncomplete: true,
                message: "Student profile is incomplete. Please complete your profile.",
            });
        }

        // Check if the student is enrolled in a thesis
        if (!student.thesisID) {
            return res.status(200).json({
                success: true,
                thesisID: null,
                message: "No thesis found for this student. Create or join a thesis.",
            });
        }

        // Fetch the thesis details
        const thesis = await GetThesisByID(student.thesisID)

        // If thesis details are not found
        if (!thesis) {
            return res.status(404).json({
                success: false,
                message: "Thesis details not found. Please contact your supervisor.",
            });
        }

        return res.status(200).json({
            success: true,
            thesisID: thesis.id,
            data: thesis,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

async function GetThesisbyID(req, res) {
    const userData = req.userData;

    if (!userData) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    try{
        // check if the user is realated to the thesis
        const thesisID = req.params.id;
        const thesis = await GetThesisByID(thesisID);
        if (!thesis) {
            return res.status(404).json({
                success: false,
                message: "Thesis not found",
            });
        }

        if (userData.role === "FACULTY") {
            // get faculty id
            const faculty = await DB.faculty.findUnique({
                where: { userId: userData.id },
                select: { id: true },
            });

            if (thesis.supervisorId !== faculty.id) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: Access is restricted to the faculty supervisor",
                });
            }
        }

        if (userData.role === "STUDENT") {
            const student = await DB.student.findUnique({
                where: { userId: userData.id },
                select: { id: true, thesisID: true },
            });

            console.log(student)

            if (student.thesisID !== thesis.id) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: Access is restricted to the student enrolled in the thesis",
                });
            }
        }

        return res.status(200).json({
            success: true,
            data: thesis,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }

}

async function CreateThesis(req, res) {
    const userData = req.userData;

    if (!userData) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    try {
        const { id, role } = userData;

        if (role !== "STUDENT") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const student = await DB.student.findUnique({
            where: { userId: id },
            select: { thesisID: true, id: true }, // Include student's internal ID
        });

        if (student?.thesisID) {
            return res.status(400).json({
                success: false,
                message: "Already enrolled in a thesis",
            });
        }

        const { title } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }

        // Perform the transaction
        const thesis = await DB.$transaction(async (prisma) => {
            // Step 1: Create the thesis
            const newThesis = await prisma.thesis.create({
                data: {
                    title,
                },
            });

            // Step 2: Update the student with the thesis ID
            await prisma.student.update({
                where: { id: student.id },
                data: { thesisID: newThesis.id },
            });

            return newThesis; // Return the newly created thesis
        });

        return res.status(201).json({
            success: true,
            message: "Thesis created successfully",
            thesis,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

const getThesisPosts = async (req, res) => {
    const { id } = req.params; // Thesis ID from URL params
    const { page = 1, limit = 10 } = req.query; // Pagination parameters
    const userId = req.userData?.id; // Assuming user ID is extracted from a middleware

    try {
        // Ensure the user is authorized to view this thesis
        const thesis = await DB.thesis.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                student: true, // Include related students
                faculty: true, // Include related faculty
            },
        });

        console.log(thesis)

        if (!thesis) {
            return res.status(404).json({
                success: false,
                message: "Thesis not found",
            });
        }

        // Check if the user is related to this thesis (either as student or faculty)
        const isAuthorized =
            thesis.faculty?.userId === userId || // User is the supervisor
            thesis.student.some((student) => student.userId === userId); // User is one of the students

        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access these posts",
            });
        }

        // Parse pagination values
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const offset = (pageNumber - 1) * pageSize;

        // Fetch posts for the specified thesis ID with pagination
        const posts = await DB.post.findMany({
            where: {
                thesisId: parseInt(id),
            },
            skip: offset,
            take: pageSize,
            orderBy: {
                createdAt: "desc", // Sort posts by newest first
            },
            include: {
                author: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                    },
                }, // Include associated comments
            },
        });

        // Get the total number of posts for pagination info
        const totalPosts = await DB.post.count({
            where: {
                thesisId: parseInt(id),
            },
        });

        res.status(200).json({
            success: true,
            posts,
            totalPosts,
            totalPages: Math.ceil(totalPosts / pageSize),
            currentPage: pageNumber,
        });
    } catch (error) {
        console.error("Error fetching thesis posts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch posts",
        });
    }
};

async function CreateSubmissions ( req, res ) {
    const userData = req.userData;

    if ( userData.role !== "FACULTY"){
        return res.status(403).json({
            success: false,
            message: "Forbidden: Access is restricted to Faculty"
        })
    }

    try {
        const faculty = await DB.faculty.findUnique({
            where: { userId: userData.id }
        });

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: "Faculty not found"
            });
        }

        const { thesisId, title, instruction, deadline, type } = req.body;

        if (!thesisId || !title || !instruction || !deadline || !type) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const thesis = await DB.thesis.findUnique({
            where: { id: thesisId }
        });

        if (!thesis) {
            return res.status(404).json({
                success: false,
                message: "Thesis not found"
            });
        }

        if (thesis.supervisorId !== faculty.id) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Access is restricted to the faculty supervisor"
            });
        }

        const validTypes = [
            "Normal",
            "P1",
            "P2",
            "Final"
        ]

        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid submission type"
            });
        }

        const submission = await DB.submission.create({
            data:{
                title,
                instructions: instruction,
                deadline,
                type,
                thesisId,
            }
        });

        if (!submission) {
            return res.status(500).json({
                success: false,
                message: "Failed to create submission"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Submission created successfully",
            data: submission
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: (err.message || "Internal server error"),
        });
    }
    
}

async function UpdateSubmissions ( req, res ) {
    const userData = req.userData;

    if ( userData.role !== "FACULTY"){
        return res.status(403).json({
            success: false,
            message: "Forbidden: Access is restricted to Faculty"
        })
    }

    try {
        const faculty = await DB.faculty.findUnique({
            where: { userId: userData.id }
        });

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: "Faculty not found"
            });
        }

        const { submissionId, title, instructions, deadline, type } = req.body;

        
        console.log(submissionId, title, instructions, deadline, type);
        if (!submissionId || !title || !instructions || !deadline || !type) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const submission = await DB.submission.findUnique({
            where: { id: submissionId },
            include: {
                thesis: {
                    select: {
                        supervisorId: true
                    }
                }
            }
        });

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: "Submission not found"
            });
        }

        if (submission.thesis.supervisorId !== faculty.id) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Access is restricted to the faculty supervisor"
            });
        }

        const validTypes = [
            "Normal",
            "P1",
            "P2",
            "Final"
        ]

        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid submission type"
            });
        }

        const updatedSubmission = await DB.submission.update({
            where: { id: submissionId },
            data: {
                title,
                instructions: instructions,
                deadline,
                type
            }
        });

        if (!updatedSubmission) {
            return res.status(500).json({
                success: false,
                message: "Failed to update submission"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Submission updated successfully",
            data: updatedSubmission
        });
        

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: (err.message || "Internal server error"),
        });
    }
}

async function GetSubmissions ( req, res ) {
    const userData = req.userData;

    try{
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invalid request"
            });
        }

        const thesis = await DB.thesis.findUnique({
            where: { id: parseInt(id) }
        });

        if (!thesis) {
            return res.status(404).json({
                success: false,
                message: "Thesis not found"
            });
        }

        if (userData.role === "FACULTY") {
            const faculty = await DB.faculty.findUnique({
                where: { userId: userData.id }
            });

            if (thesis.supervisorId !== faculty.id) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: Access is restricted to the faculty supervisor"
                });
            }
        }

        if (userData.role === "STUDENT") {
            const student = await DB.student.findUnique({
                where: { userId: userData.id }
            });

            if (student.thesisID !== thesis.id) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: Access is restricted to the student enrolled in the thesis"
                });
            }
        }

        const submissions = await DB.submission.findMany({
            where: { thesisId: parseInt(id) }
        });

        return res.status(200).json({
            success: true,
            data: submissions
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: (err.message || "Internal server error"),
        });
    }
}

async function EditThesis ( req, res ) {
    const userData = req.userData;

    if ( userData.role === "FACULTY"){
        return res.status(403).json({
            success: false,
            message: "Forbidden: Access is restricted to Students"
        })
    }

    try {
        const student = await DB.student.findUnique({
            where: { userId: userData.id }
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        if (!student.thesisID) {
            return res.status(404).json({
                success: false,
                message: "No thesis found for this student"
            });
        }

        const { title, abstract } = req.body;

        if ( !title ) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const thesis = await DB.thesis.findUnique({
            where: { id: student.thesisID }
        });

        if (!thesis) {
            return res.status(404).json({
                success: false,
                message: "Thesis not found"
            });
        }


        const updatedThesis = await DB.thesis.update({
            where: { id: student.thesisID },
            data: {
                title,
                abstract
            }
        });

        return res.status(200).json({
            success: true,
            message: "Thesis updated successfully",
            data: updatedThesis
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: (err.message || "Internal server error"),
        });
    }
}
export {
    GetThesis,
    GetFacultyThesis,
    CreateThesis,
    GetThesisbyID,
    getThesisPosts,
    CreateSubmissions,
    UpdateSubmissions,
    GetSubmissions,
    EditThesis,
}