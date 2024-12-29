import DB from "../DB/db.js";

async function GetAppointment (req, res) {
    const user = req.userData

    try {
        if ( user.role === "STUDENT" ){
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
        } else if ( user.role === "FACULTY") {

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
            message:'Unauthorized'
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error"
        })
    }
}
async function GetRequests (req, res) {
    const user = req.userData

    try {
        if ( user.role === "STUDENT" ){
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
        } else if ( user.role === "FACULTY") {

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
            message:'Unauthorized'
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error"
        })
    }
}


export {
    GetAppointment,
    GetRequests,

};