import DB from "../DB/db.js";

async function GetAppointment(req, res) {
    const user = req.userData

    try {
        if (user.role === "STUDENT") {
            const student = await DB.student.findUnique({
                where: { userId: user.id },
                include: { thesis: true },
            });

            if (!student || !student.thesisID) {
                throw new Error("No thesis found for the student.");
            }

            const appointments = await DB.appointment.findMany({
                where: { thesisId: student.thesisID },
                include: {
                    thesis: { select: { title: true } },
                    faculty: { select: { user: { select: { name: true } } } },
                },
            });

            return res.status(200).json({
                success: true,
                data: appointments
            })
        } else if (user.role === "FACULTY") {

            const faculty = await DB.faculty.findUnique({
                where: { userId: user.id },
            });

            if (!faculty) {
                throw new Error("Faculty not found.");
            }

            const appointments = await DB.appointment.findMany({
                where: { facultyId: faculty.id },
                include: {
                    thesis: { select: { title: true } },
                    faculty: { select: { user: { select: { name: true } } } },
                },
            });

            return res.status(200).json({
                success: true,
                data: appointments
            })
        }

        return res.status(403).json({
            success: false,
            message: 'Unauthorized'
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error"
        })
    }
}
async function GetRequests(req, res) {
    const user = req.userData

    try {
        if (user.role === "STUDENT") {
            const student = await DB.student.findUnique({
                where: { userId: user.id },
                include: { thesis: true },
            });

            if (!student || !student.thesisID) {
                throw new Error("No thesis found for the student.");
            }

            const appointments = await DB.RequestSupervisor.findMany({
                where: { thesisId: student.thesisID },
                include: {
                    thesis: { select: { title: true } },
                    faculty: { select: { user: { select: { name: true } } } },
                },
            });

            return res.status(200).json({
                success: true,
                data: appointments
            })
        } else if (user.role === "FACULTY") {

            const faculty = await DB.faculty.findUnique({
                where: { userId: user.id },
            });

            if (!faculty) {
                throw new Error("Faculty not found.");
            }

            const appointments = await DB.RequestSupervisor.findMany({
                where: { facultyId: faculty.id },
                include: {
                    thesis: { select: { title: true } },
                    faculty: { select: { user: { select: { name: true } } } },
                },
            });

            return res.status(200).json({
                success: true,
                data: appointments
            })
        }

        return res.status(403).json({
            success: false,
            message: 'Unauthorized'
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error"
        })
    }
}

async function GetRequestDetails(req, res) {
    const { id } = req.params
    const userData = req.userData
    console.log(id, userData)
    if (!id) {
        res.status(400).json({
            success: false,
            message: "Invalid request"
        })
    }

    if (!userData.role){
        res.status(400).json({
            success: false,
            message: "Invalid request"
        })
    }
    try {
        const request = await DB.RequestSupervisor.findUnique(
            {
                where: { id: parseInt(id) },
                include: {
                    thesis: {
                        include: {
                            student: {
                                select: {
                                    id: true,
                                    user: {
                                        select: {
                                            id: true,
                                            name: true,
                                            email: true,
                                            image: true
                                        },
                                    },
                                },
                            },
                        }
                    }
                }

            }
        )
        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found."
            });
        }

        console.log(request.thesis.student)

        if (userData.role === 'STUDENT') {
            const isStudent = request.thesis.student.some(student => student.user.id === userData.id);
            console.log(isStudent)

            if (!isStudent) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied: You can only view your own request."
                });
            }
        }

        if (userData.role === 'FACULTY') {

        }
        res.status(200).json({
            data: request
        })
    } catch (error) {
        // Handle unexpected errors
        console.error(error);  // Log the error for debugging
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later."
        });
    }

}

export {
    GetAppointment,
    GetRequests,
    GetRequestDetails,

};