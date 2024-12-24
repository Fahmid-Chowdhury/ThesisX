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

async function GetThesis(req, res) {
    const userData = req.userData;

    if (!userData) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }
    try {
        const { id, role } = userData;

        if (role !== "STUDENT") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
        

        const thesisId = await DB.student.findUnique({
            where: {
                userId: id, // Replace 'userId' with the actual userId value
            },
            select: {
                thesisID: true, // Select only the thesisId
            },
        });

        console.log(thesisId)

        if (!thesisId.thesisID) {
            return res.status(404).json({
                success: false,
                message: "No thesis found for this student",
            });
        }

        const thesis = await GetThesisByID(thesisId.thesisID)

        if (!thesis) {
            return res.status(500).json({
                success: false,
                message:"Error fetching thesis data"
            })
        }

        return res.status(200).json({
            success: true,
            data: thesis
        })


    } catch (err) {
        console.error(err)
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

        console.log(student)
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

export {
    GetThesis,
    CreateThesis,
}