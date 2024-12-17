
import DB from "../DB/db.js";
import path from "path";

// Function to get availability for a faculty
const getAvailability = async (req, res) => {
    try {
        const userId = req.userData?.id; // Assuming user ID comes from authentication middleware
        const role = req.userData?.role;

        if (!userId || role !== "FACULTY") {
            return res.status(403).json({ success: false, message: "Forbidden: Only faculty can access availability." });
        }

        // Fetch availability from the database
        const faculty = await DB.Faculty.findUnique({
            where: { userId },
            select: { availability: true },
        });

        if (!faculty) {
            return res.status(404).json({ success: false, message: "Faculty not found." });
        }

        return res.status(200).json({
            success: true,
            data: faculty.availability || [],
        });
    } catch (error) {
        console.error("Error fetching availability:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// Function to update faculty availability
const updateAvailability = async (req, res) => {
    try {
        const userId = req.userData?.id;
        const role = req.userData?.role;
        const { availability } = req.body; // Expects an array of date ranges or periods

        if (!userId || role !== "FACULTY") {
            return res.status(403).json({ success: false, message: "Forbidden: Only faculty can update availability." });
        }

        if (!availability || !Array.isArray(availability)) {
            return res.status(400).json({ success: false, message: "Invalid availability format. It must be an array." });
        }

        // Validate availability periods (basic validation example)
        const isValidAvailability = availability.every(period => {
            return period.start && period.end && new Date(period.start) <= new Date(period.end);
        });

        if (!isValidAvailability) {
            return res.status(400).json({ success: false, message: "Invalid availability periods provided." });
        }

        // Update the faculty's availability in the database
        const updatedFaculty = await DB.Faculty.update({
            where: { userId },
            data: { availability },
        });

        return res.status(200).json({
            success: true,
            message: "Availability updated successfully.",
            data: updatedFaculty.availability,
        });
    } catch (error) {
        console.error("Error updating availability:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// Function to get all faculties' availability
const getAllFacultiesAvailability = async (req, res) => {
    try {
        const { department, tags } = req.query;

        // Build filters dynamically
        const filters = {};
        if (department) {
            filters.user = { department };
        }
        if (tags) {
            const tagsArray = tags.split(",");
            filters.researchInterests = { hasSome: tagsArray };
        }

        // Fetch faculties with availability
        const faculties = await DB.Faculty.findMany({
            where: filters,
            select: {
                id: true,
                availability: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        department: true,
                        email: true,
                        image: true,
                    },
                },
            },
        });

        return res.status(200).json({
            success: true,
            data: faculties,
        });
    } catch (error) {
        console.error("Error fetching all faculties' availability:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch faculties' availability." });
    }
};

// Export functions
export {
    getAvailability,
    updateAvailability,
    getAllFacultiesAvailability,
};
