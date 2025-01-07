
import DB from "../DB/db.js";
import path from "path";

// Function to get availability for a faculty
const getAvailability = async (req, res) => {
    try {
        const userId = req.userData?.id; // Assuming user ID comes from authentication middleware
        const role = req.userData?.role;

        if (!userId || role === "ADMIN") {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        let facultyId;
        if (role === "STUDENT") {
            const student = await DB.student.findUnique({
                where: { userId: userId },
                include: { thesis: true },
            });
    
            if (!student || !student.thesis) {
                return res.status(404).json({ success: false, message: "Student or thesis not found." });
            }
            facultyId = student.thesis.supervisorId;
            if (!facultyId) {
                return res.status(404).json({ success: false, message: "Faculty not found." });
            }

        } else {
            const faculty = await DB.faculty.findUnique({
                where: {userId}
            })
            if (!faculty) {
                return res.status(404).json({ success: false, message: "Faculty not found." });
            }
            facultyId = faculty.id;
        }
        // Fetch user and student data from DB 

        // Fetch faculty availability data from availability table
        const availability = await DB.availability.findMany({
            where: { facultyId: facultyId },
            select: {
                id: true,
                startTime: true,
                endTime: true,
                type: true,
            },
        });

        if (!availability) {
            return res.status(404).json({ success: false, message: "No availability data found for this faculty." });
        }

        return res.status(200).json({
            success: true,
            data: availability,
        });
    } catch (error) {
        console.error("Error fetching availability:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};


// Function to add availability for a faculty

const addAvailability = async (req, res) => {
    try {
        const userId = req.userData?.id; // Assuming user ID comes from authentication middleware
        const role = req.userData?.role;

        if (!userId || role !== "FACULTY") {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const { startTime, endTime, type } = req.body;

        // Validate request body
        if (!startTime || !endTime || !type) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        const faculty = await DB.faculty.findUnique({
            where: { userId },
        });

        if (!faculty) {
            return res.status(404).json({ success: false, message: "Faculty not found." });
        }

        // Create a new availability entry
        const availability = await DB.availability.create({
            data: {
                facultyId: faculty.id,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                type,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Availability added successfully.",
            availability,
        });
    } catch (error) {
        console.error("Error adding availability:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};
// Function to update availability for a faculty
const updateAvailability = async (req, res) => {
    try {
        const userId = req.userData?.id; // Assuming user ID comes from authentication middleware
        const role = req.userData?.role;

        if (!userId || role !== "FACULTY") {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const { availabilityId, startTime, endTime, type } = req.body;

        // Validate request body
        if (!availabilityId || (!startTime && !endTime && !type)) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        const faculty = await DB.faculty.findUnique({
            where: { userId },
        });

        if (!faculty) {
            return res.status(404).json({ success: false, message: "Faculty not found." });
        }

        // Check if the availability entry exists and belongs to the faculty
        const existingAvailability = await DB.availability.findUnique({
            where: { id: availabilityId },
        });

        if (!existingAvailability || existingAvailability.facultyId !== faculty.id) {
            return res.status(404).json({ success: false, message: "Availability entry not found or unauthorized." });
        }

        // Update availability entry
        const updatedAvailability = await DB.availability.update({
            where: { id: availabilityId },
            data: {
                startTime: startTime ? new Date(startTime) : existingAvailability.startTime,
                endTime: endTime ? new Date(endTime) : existingAvailability.endTime,
                type: type || existingAvailability.type,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Availability updated successfully.",
            availability: updatedAvailability,
        });
    } catch (error) {
        console.error("Error updating availability:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// Export functions
export {
    getAvailability,
    addAvailability,
    updateAvailability,
};
